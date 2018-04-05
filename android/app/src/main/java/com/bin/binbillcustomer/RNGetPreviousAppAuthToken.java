package com.bin.binbillcustomer;

/**
 * Created by pramjeetahlawat on 21/02/18.
 */

import android.content.Context;
import android.content.SharedPreferences;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class RNGetPreviousAppAuthToken extends ReactContextBaseJavaModule {
    public RNGetPreviousAppAuthToken(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void getAuthToken(Promise promise) {
        try {
            SharedPreferences sharedPref = getReactApplicationContext().getSharedPreferences(getReactApplicationContext().getString(R.string.previous_app_shared_pref_file_key), Context.MODE_PRIVATE);
            String authToken = sharedPref.getString(getReactApplicationContext().getString(R.string.previous_app_auth_token_key), null);
            promise.resolve(authToken);
        } catch (Exception e) {
            promise.reject("PREVIOUS_APP_AUTH_TOKEN_ERROR", e);
        }
    }

    @Override
    public String getName() {
        return "RNGetPreviousAppAuthToken";
    }
}
