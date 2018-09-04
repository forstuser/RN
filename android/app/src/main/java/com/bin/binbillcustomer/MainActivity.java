package com.bin.binbillcustomer;

import android.app.Activity;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.provider.OpenableColumns;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.util.Log;
import android.widget.ImageView;
import org.devio.rn.splashscreen.SplashScreen;

import com.facebook.react.ReactActivity;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

public class MainActivity extends ReactActivity {

  private static final int REQUEST_STORAGE = 131;

  private ImageView splash1, splash2, splash3;

  private Intent intentForShareVia;

  private static Activity mCurrentActivity = null;

  @Override
  protected String getMainComponentName() {
    return "BinBill";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {

    super.onCreate(savedInstanceState);
    SplashScreen.show(this);
    mCurrentActivity = this;
    Log.d("INTENT", "intent");
    if (getIntent() != null) {
      handleIntent(getIntent());
    }
  }

  // to address 'Activity com.bin.binbillcustomer.MainActivity has leaked window' issue
   @Override
   protected void onPause() {
     SplashScreen.hide(this);
     super.onPause();
   }

  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    handleIntent(intent);
  }

  private void handleIntent(Intent intent){
    String action = intent.getAction();
    String type = intent.getType();
    if (Intent.ACTION_SEND.equals(action) && type != null && type.startsWith("image/")) {
      intentForShareVia=intent;
      checkStoragePermission();
    } else {
      SharedPreferences sharedPref = this.getSharedPreferences(getString(R.string.shared_pref_file_key),
              Context.MODE_PRIVATE);
      SharedPreferences.Editor editor = sharedPref.edit();
      editor.remove(getString(R.string.shared_pref_direct_upload_file_path_key));
      editor.commit();
    }
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
  }

  private void checkStoragePermission() {
    Log.d("INTENT", "checkStoragePermission");
    if (ActivityCompat.checkSelfPermission(this,
        android.Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
      ActivityCompat.requestPermissions(this, new String[] { android.Manifest.permission.WRITE_EXTERNAL_STORAGE },
          REQUEST_STORAGE);
    } else {
      Log.d("INTENT", "checkStoragePermission else");
      getSharedFileAndStoreUriToSharedPreferences();
    }
  }

  @Override
  public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    switch (requestCode) {
    case REQUEST_STORAGE:
      if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
        getSharedFileAndStoreUriToSharedPreferences();
      }
    }
  }

  private void getSharedFileAndStoreUriToSharedPreferences() {
    if(intentForShareVia==null || !intentForShareVia.hasExtra(Intent.EXTRA_STREAM) || intentForShareVia.getExtras().get(Intent.EXTRA_STREAM)==null){
      return;
    }

    String uri = getImageUrlWithAuthority(this, (Uri) intentForShareVia.getExtras().get(Intent.EXTRA_STREAM));

    /**
     * Save the bitmap URI in sharedPref
     */
    SharedPreferences sharedPref = this.getSharedPreferences(getString(R.string.shared_pref_file_key),
        Context.MODE_PRIVATE);
    ;
    SharedPreferences.Editor editor = sharedPref.edit();
    if (uri != null && !uri.isEmpty()) {
      Log.d("INTENT", "final uri: " + uri);
      editor.putString(getString(R.string.shared_pref_direct_upload_file_path_key), uri.toString());
    } else {
      Log.d("INTENT", "remove uriString");
      editor.remove(getString(R.string.shared_pref_direct_upload_file_path_key));
    }
    editor.commit();
  }

  public static String getImageUrlWithAuthority(Context context, Uri uri) {
    InputStream is = null;
    if (uri.getAuthority() != null) {
      try {
        is = context.getContentResolver().openInputStream(uri);
        Bitmap bmp = BitmapFactory.decodeStream(is);
        return writeToTempImageAndGetPathUri(context, bmp).toString();
      } catch (FileNotFoundException e) {
        e.printStackTrace();
      } finally {
        try {
          is.close();
        } catch (IOException e) {
          e.printStackTrace();
        }
      }
    }
    return null;
  }

  public static Uri writeToTempImageAndGetPathUri(Context inContext, Bitmap inImage) {
    ByteArrayOutputStream bytes = new ByteArrayOutputStream();
    inImage.compress(Bitmap.CompressFormat.JPEG, 100, bytes);
    String path = MediaStore.Images.Media.insertImage(inContext.getContentResolver(), inImage, "Title", null);
    return Uri.parse(path);
  }

  public static Activity getActivity() {
    Activity activity = new Activity();
    activity = mCurrentActivity;
    return activity;
  }
}
