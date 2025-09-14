package com.myplantapp.facebook_login

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import com.facebook.AccessToken
import com.facebook.CallbackManager
import com.facebook.FacebookCallback
import com.facebook.FacebookException
import com.facebook.login.LoginManager
import com.facebook.login.LoginResult
import com.facebook.react.bridge.*
import com.facebook.FacebookSdk
import com.facebook.GraphRequest
import com.myplantapp.R
import org.json.JSONObject

class FacebookLoginModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val callbackManager: CallbackManager = CallbackManager.Factory.create()
    private var loginPromise: Promise? = null

    override fun getName(): String {
        return "FacebookLogin"
    }

    init {
        // Khởi tạo Facebook SDK
        FacebookSdk.setClientToken(reactContext.getString(R.string.facebook_client_token))
        FacebookSdk.setApplicationId(reactContext.getString(R.string.facebook_app_id))
        FacebookSdk.setAutoInitEnabled(true)
        FacebookSdk.fullyInitialize()
        reactContext.addActivityEventListener(object : BaseActivityEventListener() {
            override fun onActivityResult(
                activity: Activity,
                requestCode: Int,
                resultCode: Int,
                data: Intent?
            ) {
                callbackManager.onActivityResult(requestCode, resultCode, data)
            }
        })
    }

    @ReactMethod
    fun login(permissions: ReadableArray, promise: Promise) {
        loginPromise = promise
        val activity = reactContext.currentActivity

        if (activity == null) {
            promise.reject("NO_ACTIVITY", "Activity doesn't exist")
            return
        }

        // Chuyển đổi ReadableArray sang List<String>
        val permissionsList = mutableListOf<String>()
        for (i in 0 until permissions.size()) {
            permissionsList.add(permissions.getString(i) ?: "")
        }

        // Đăng ký callback
        LoginManager.getInstance().registerCallback(
            callbackManager,
            object : FacebookCallback<LoginResult> {
                override fun onSuccess(result: LoginResult) {
                    val accessToken = result.accessToken
                    loginPromise?.let {
                        getUserProfile(accessToken, it)
                        loginPromise = null
                    }
                }

                override fun onCancel() {
                    promise.reject("CANCELLED", "Login cancelled")
                    loginPromise = null
                }

                override fun onError(error: FacebookException) {
                    promise.reject("ERROR", error.message)
                    loginPromise = null
                }
            })

        // Thực hiện login
        UiThreadUtil.runOnUiThread {
            LoginManager.getInstance().logInWithReadPermissions(
                activity,
                permissionsList
            )
        }
    }

    @ReactMethod
    fun logout(promise: Promise) {
        try {
            LoginManager.getInstance().logOut()
            promise.resolve("Logged out successfully")
        } catch (e: Exception) {
            promise.reject("LOGOUT_ERROR", e.message)
        }
    }

    @ReactMethod
    fun isLoggedIn(promise: Promise) {
        val accessToken = AccessToken.getCurrentAccessToken()
        promise.resolve(accessToken != null && !accessToken.isExpired)
    }

    @ReactMethod
    fun getAccessToken(promise: Promise) {
        val accessToken = AccessToken.getCurrentAccessToken()
        if (accessToken != null && !accessToken.isExpired) {
            val map = Arguments.createMap()
            map.putString("accessToken", accessToken.token)
            map.putString("userId", accessToken.userId)
            map.putDouble("expirationTime", accessToken.expires.time.toDouble())
            promise.resolve(map)
        } else {
            promise.reject("NO_ACCESS_TOKEN", "No access token available")
        }

    }

    private fun getUserProfile(accessToken: AccessToken, promise: Promise) {
        val request = GraphRequest.newMeRequest(accessToken) { jsonObject, _ ->
            try {
                val userInfo = Arguments.createMap()
                userInfo.putString("accessToken", accessToken.token)
                userInfo.putString("userId", accessToken.userId)

                jsonObject?.let {
                    if (it.has("id")) userInfo.putString("id", it.getString("id"))
                    if (it.has("name")) userInfo.putString("name", it.getString("name"))
                    if (it.has("email")) userInfo.putString("email", it.getString("email"))
                    if (it.has("picture")) {
                        val picture = it.getJSONObject("picture")
                        if (picture.has("data")) {
                            val data = picture.getJSONObject("data")
                            if (data.has("url")) {
                                userInfo.putString("photoURL", data.getString("url"))
                            }
                        }
                    }
                }

                promise.resolve(userInfo)
            } catch (e: Exception) {
                promise.reject("PROFILE_ERROR", e.message)
            }
        }

        val parameters = Bundle()
        parameters.putString("fields", "id,name,email,picture.type(large)")
        request.parameters = parameters
        request.executeAsync()
    }

    // Xử lý callback từ Facebook
    fun handleActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        callbackManager.onActivityResult(requestCode, resultCode, data)
    }


}
