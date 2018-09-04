package com.bin.binbillcustomer;

/**
 * Created by pramjeetahlawat on 21/02/18.
 */

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.Promise;

import java.io.File;
import java.util.ArrayList;

public class RNDirectUploadFileModule extends ReactContextBaseJavaModule {
    public RNDirectUploadFileModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void getFIlePath(Promise promise) {
        try {
            SharedPreferences sharedPref = getReactApplicationContext().getSharedPreferences(getReactApplicationContext().getString(R.string.shared_pref_file_key), Context.MODE_PRIVATE);
            String filePath = sharedPref.getString(getReactApplicationContext().getString(R.string.shared_pref_direct_upload_file_path_key), null);
            SharedPreferences.Editor editor = sharedPref.edit();
            editor.remove(getReactApplicationContext().getString(R.string.shared_pref_direct_upload_file_path_key));
            editor.commit();
            promise.resolve(filePath);
        } catch (Exception e) {
            promise.reject("DIRECT_FILE_URI_ERROR", e);
        }
    }

    @Override
    public String getName() {
        return "RNDirectUploadFileModule";
    }
}
