package com.inofficedays.modules

import android.content.Intent
import android.os.Build
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.inofficedays.services.LocationForegroundService

class LocationServiceModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "LocationServiceModule"

    @ReactMethod
    fun startService() {
        val intent = Intent(reactApplicationContext, LocationForegroundService::class.java)
        Log.d("LocationServiceModule", "startService called")
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            reactApplicationContext.startForegroundService(intent)
        } else {
            reactApplicationContext.startService(intent)
        }
    }

    @ReactMethod
    fun stopService() {
        val intent = Intent(reactApplicationContext, LocationForegroundService::class.java)
        Log.d("LocationServiceModule", "stopService called")
        reactApplicationContext.stopService(intent)
    }
}
