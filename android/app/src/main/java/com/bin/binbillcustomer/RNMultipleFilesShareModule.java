package com.bin.binbillcustomer;

/**
 * Created by pramjeetahlawat on 21/02/18.
 */

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.widget.Toast;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;

import java.io.File;
import java.util.ArrayList;

public class RNMultipleFilesShareModule extends ReactContextBaseJavaModule {
  protected Activity activity;
  protected ReactApplicationContext reactContext;

  public RNMultipleFilesShareModule(ReactApplicationContext reactContext) {
    super(reactContext);
//    this.activity = activity;
    this.reactContext = reactContext;
  }

  @ReactMethod
  public void shareFiles(ReadableArray filePaths) {
    ArrayList<Uri> fileUris = new ArrayList<Uri>();

    for (int i = 0; i < filePaths.size(); i++) {
      fileUris.add(Uri.fromFile(new File(filePaths.getString(i))));
    }

    Intent shareIntent = new Intent();
    shareIntent.setAction(Intent.ACTION_SEND_MULTIPLE);
    shareIntent.putParcelableArrayListExtra(Intent.EXTRA_STREAM, fileUris);
    shareIntent.setType("*/*");

    this.reactContext.getCurrentActivity().startActivity(Intent.createChooser(shareIntent, "Share.."));
  }

  @Override
  public String getName() {
    return "RNMultipleFilesShare";
  }
}
