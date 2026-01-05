package com.inofficedays.modules

import android.content.Intent
import android.os.Build
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.inofficedays.services.LocationForegroundService

class LocationServiceModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        // Singleton instance for service to access emitter
        var instance: LocationServiceModule? = null
    }

    init {
        instance = this
    }

    override fun getName() = "LocationServiceModule"

    @ReactMethod
    fun startService() {
        val intent = Intent(reactContext, LocationForegroundService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            reactContext.startForegroundService(intent)
        } else {
            reactContext.startService(intent)
        }
    }

    @ReactMethod
    fun stopService() {
        val intent = Intent(reactContext, LocationForegroundService::class.java)
        reactContext.stopService(intent)
    }

    // Function for service to send event to JS
    fun sendLocationEvent(latitude: Double, longitude: Double) {
        val params = Arguments.createMap()
        params.putDouble("latitude", latitude)
        params.putDouble("longitude", longitude)


        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("locationUpdate", params)
    }
}
