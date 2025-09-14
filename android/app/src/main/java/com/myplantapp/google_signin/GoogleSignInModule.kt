package com.myplantapp.google_signin

import android.util.Log
import androidx.credentials.CredentialManager
import androidx.credentials.GetCredentialRequest
import androidx.credentials.GetCredentialResponse
import androidx.credentials.exceptions.GetCredentialException
import com.facebook.react.bridge.*
import com.google.android.libraries.identity.googleid.GetGoogleIdOption
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class GoogleSignInModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "GoogleSignInModule"

    @ReactMethod
    fun signIn(webClientId: String, promise: Promise) {
        val activity = reactContext.currentActivity
            ?: run {
                promise.reject("NO_ACTIVITY", "No current activity is available")
                return
            }

        CoroutineScope(Dispatchers.Main).launch {
            try {
                val credentialManager = CredentialManager.create(reactContext)

                val googleIdOption = GetGoogleIdOption.Builder()
                    .setFilterByAuthorizedAccounts(false)
                    .setServerClientId(webClientId)
                    .setAutoSelectEnabled(false)
                    .build()

                val request = GetCredentialRequest.Builder()
                    .addCredentialOption(googleIdOption)
                    .build()

                val result: GetCredentialResponse = credentialManager.getCredential(
                    request = request,
                    context = activity
                )

                val credential = result.credential
                val googleIdTokenCredential = GoogleIdTokenCredential.createFrom(credential.data)

                val user = Arguments.createMap().apply {
                    putString("idToken", googleIdTokenCredential.idToken)
                    putString("displayName", googleIdTokenCredential.displayName)
                    putString("givenName", googleIdTokenCredential.givenName)
                    putString("familyName", googleIdTokenCredential.familyName)
                    putString(
                        "profilePictureUri",
                        googleIdTokenCredential.profilePictureUri?.toString()
                    )
                }

                promise.resolve(user)

            } catch (e: GetCredentialException) {
                promise.reject("CREDENTIAL_ERROR", e.localizedMessage)
            } catch (e: Exception) {
                promise.reject("SIGN_IN_ERROR", e.localizedMessage)
            }
        }
    }
}
