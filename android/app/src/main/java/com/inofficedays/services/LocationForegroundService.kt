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


class LocationForegroundService : Service() {

    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private val CHANNEL_ID = "location_channel"

    override fun onCreate() {
        super.onCreate()
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        createNotificationChannel()
        startForeground(1, createNotification("Location service started"))
        startLocationUpdates()
    }

    private fun startLocationUpdates() {
        val locationRequest = LocationRequest.Builder(
            Priority.PRIORITY_HIGH_ACCURACY, 60000 //30 min interval || 1 minute interval= 60k,
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

            // Call JS sender
            sendLocationToJS(it.latitude, it.longitude)

            // Sending Notification every time location is picked
            val notification = createNotification(
                "Lat: ${it.latitude}, Lng: ${it.longitude}"
            )
            val notificationManager =
                getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.notify(1, notification)
        } ?: run {
            Log.w("LocationService", "Location is null in callback")
        }
    }
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









    private fun createNotification(content: String): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Foreground Location Service")
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
