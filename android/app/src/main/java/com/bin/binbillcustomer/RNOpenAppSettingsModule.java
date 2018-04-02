package com.bin.binbillcustomer;

/**
 * Created by pramjeetahlawat on 21/02/18.
 */

import android.content.Intent;
import android.net.Uri;
import android.provider.Settings;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


public class RNOpenAppSettingsModule extends ReactContextBaseJavaModule {
  private final ReactApplicationContext reactContext;
  public RNOpenAppSettingsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

  @ReactMethod
  public void openAppSettings() {
    Intent intent = new Intent();
    intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
    Uri uri = Uri.fromParts("package", reactContext.getPackageName(), null);
    intent.setData(uri);
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    reactContext.startActivity(intent);
  }

  @Override
  public String getName() {
    return "RNOpenAppSettingsModule";
  }
}
