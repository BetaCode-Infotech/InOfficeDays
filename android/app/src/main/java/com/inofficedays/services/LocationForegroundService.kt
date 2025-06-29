package com.inofficedays.services

import android.app.*
import android.content.Context
import android.content.Intent
import android.location.Location
import android.location.LocationManager
import android.os.IBinder
import android.os.Looper
import android.util.Log
import androidx.core.app.NotificationCompat
import com.inofficedays.R
import com.google.android.gms.location.*

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
            Priority.PRIORITY_HIGH_ACCURACY, 60000
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
                Log.d("LocationService", "Lat: ${it.latitude}, Lng: ${it.longitude}")

                // Optional: update notification
                val notification = createNotification(
                    "Lat: ${it.latitude}, Lng: ${it.longitude}"
                )
                val notificationManager =
                    getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
                notificationManager.notify(1, notification)
            }
        }
    }

    private fun createNotification(content: String): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Foreground Location Service")
            .setContentText(content)
            .setSmallIcon(R.mipmap.ic_launcher)  // replace with your icon
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
