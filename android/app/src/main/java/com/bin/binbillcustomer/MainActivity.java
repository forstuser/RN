package com.bin.binbillcustomer;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import com.facebook.react.ReactActivity;

import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

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

  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
  }

  public static Activity getActivity() {
    Activity activity = new Activity();
    activity = mCurrentActivity;
    return activity;
  }
}
