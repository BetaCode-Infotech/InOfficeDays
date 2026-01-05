package com.inofficedays.services

import android.app.*
import android.content.Context
import android.content.Intent
import android.location.Location
import android.os.IBinder
import android.os.Looper
import android.util.Log
import androidx.core.app.NotificationCompat
import com.inofficedays.R
import com.facebook.react.ReactApplication
import com.facebook.react.ReactInstanceManager
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.android.gms.location.*
import com.inofficedays.modules.LocationServiceModule
import android.os.Handler
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL



class LocationForegroundService : Service() {

    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private val CHANNEL_ID = "location_channel"
    companion object {
        private const val PREFS_NAME = "UserPrefs"
        private const val KEY_USER_ID = "userId"
    }

    override fun onCreate() {
        super.onCreate()
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        createNotificationChannel()
        startForeground(1, createNotification("Foreground","Location service started"))
        startLocationUpdates()
    }

    private fun startLocationUpdates() {
        val locationRequest = LocationRequest.Builder(
            Priority.PRIORITY_HIGH_ACCURACY,1800000  //30=1800000 min interval || 1 minute interval= 60k,
        ).setMinUpdateDistanceMeters(0f)
            .build()

        fusedLocationClient.requestLocationUpdates(
            locationRequest, locationCallback, Looper.getMainLooper()
        )
    }

private val locationCallback = object : LocationCallback() {
    override fun onLocationResult(locationResult: LocationResult) {
        val location: Location? = locationResult.lastLocation
        location?.let {
            Log.d("LocationService", "Location received: ${it.latitude}, ${it.longitude}")
            //Push location data to a API
            pushDataToServer(it.latitude, it.longitude)
            // Call JS sender
            sendLocationToJS(it.latitude, it.longitude)

            // Sending Notification every time location is picked
            //val notification = createNotification("Foreground Service", "Lat: ${it.latitude}, Lng: ${it.longitude}")
            //val notificationManager =getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            //notificationManager.notify(1, notification)
        } ?: run {
            Log.w("LocationService", "Location is null in callback")
        }
    }
}
private fun saveUserId(userId: String) {
        val prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        prefs.edit().putString(KEY_USER_ID, userId).apply()
        Log.d("LocationService", "✅ UserId saved: $userId")
    }

private fun getUserId(): String? {
        val prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        return prefs.getString(KEY_USER_ID, null)
    }

private fun clearUserId() {
        val prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        prefs.edit().remove(KEY_USER_ID).apply()
        Log.d("LocationService", "✅ UserId cleared")
    }

private fun pushDataToServer(latitude: Double, longitude: Double) {
    val prefs = getSharedPreferences("UserPrefs", Context.MODE_PRIVATE)
    val userId = prefs.getString("userId", null)

    // Only call API if userId exists
    if (userId == null) {
        Log.w("LocationService", "User ID is null, skipping API call")
        return
    }
    Thread {
        try {
            val url = URL(
                "http://pdhanewala.com:4000/inOffice/location/monitorLocation"
            )

            val conn = url.openConnection() as HttpURLConnection
            conn.requestMethod = "POST"
            conn.setRequestProperty("Content-Type", "application/json")
            conn.connectTimeout = 15000
            conn.readTimeout = 15000
            conn.doOutput = true

            val payload = JSONObject().apply {
                put("latitude", latitude)
                put("longitude", longitude)
                put("USER_ID", userId)
                put("timestamp", System.currentTimeMillis())
            }

            conn.outputStream.use {
                it.write(payload.toString().toByteArray(Charsets.UTF_8))
            }

            if (conn.responseCode == HttpURLConnection.HTTP_OK) {
                val response = conn.inputStream.bufferedReader().use { it.readText() }

                val json = JSONObject(response)
                val locationMarked = json.optBoolean("LOCATION_MARKED", false)
                val content = json.optString("CONTENT", "")
                val title = json.optString("TITLE", "")

                if (locationMarked) {
                    Handler(Looper.getMainLooper()).post {
                        createNotificationChannel()

                        val notificationManager =
                            getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

                        notificationManager.notify(
                            (System.nanoTime() % Int.MAX_VALUE).toInt(),
                            createNotification(
                                title, content
                            )
                        )
                    }
                }
            } else {
                Log.e("LocationService", "API failed: ${conn.responseCode}")
            }

            conn.disconnect()

        } catch (e: Exception) {
            Log.e("LocationService", "pushDataToServer failed", e)
        }
    }.start()
}



private val pendingLocations = mutableListOf<Pair<Double, Double>>()
private var isListenerAttached = false
private var isReactReady = false

private fun sendLocationToJS(latitude: Double, longitude: Double) {
    Log.d("LocationService", "📍 Attempting to send to JS: $latitude, $longitude")

    val reactApp = applicationContext as ReactApplication
    val reactInstanceManager = reactApp.reactNativeHost.reactInstanceManager
    val currentContext = reactInstanceManager.currentReactContext

    if (isReactReady && currentContext != null && currentContext.hasActiveCatalystInstance()) {
        val params = Arguments.createMap().apply {
            putDouble("latitude", latitude)
            putDouble("longitude", longitude)
        }

        currentContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("locationUpdate", params)

        Log.d("LocationService", "✅ Sent location to JS: $latitude, $longitude")
    } else {
        Log.w("LocationService", "🕒 ReactContext not ready, queuing location and attaching listener...")

        if (!pendingLocations.contains(Pair(latitude, longitude))) {
            pendingLocations.add(Pair(latitude, longitude))
        }

        if (!isListenerAttached) {
            isListenerAttached = true

            reactInstanceManager.addReactInstanceEventListener(object : ReactInstanceManager.ReactInstanceEventListener {
                override fun onReactContextInitialized(reactContext: ReactContext) {
                    Log.d("LocationService", "🚀 ReactContext is now ready. Sending queued locations...")
                    isReactReady = true

                    for ((lat, lng) in pendingLocations) {
                        val params = Arguments.createMap().apply {
                            putDouble("latitude", lat)
                            putDouble("longitude", lng)
                        }

                        reactContext
                            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                            .emit("locationUpdate", params)

                        Log.d("LocationService", "✅ Sent queued location to JS: $lat, $lng")
                    }

                    pendingLocations.clear()
                    isListenerAttached = false
                    reactInstanceManager.removeReactInstanceEventListener(this)
                }
            })

            if (!reactInstanceManager.hasStartedCreatingInitialContext()) {
                reactInstanceManager.createReactContextInBackground()
            }
        }
    }
}








//Foreground Service Notification
    private fun createNotification(title: String, content: String): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle(title)
            .setContentText(content)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .build()
    }

    private fun createNotificationChannel() {
        val channel = NotificationChannel(
            CHANNEL_ID,
            "Location Service Channel",
            NotificationManager.IMPORTANCE_HIGH
        )
        val manager = getSystemService(NotificationManager::class.java)
        manager.createNotificationChannel(channel)
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        super.onDestroy()
        fusedLocationClient.removeLocationUpdates(locationCallback)
    }
}
