package com.bin.binbillcustomer;

import android.os.Bundle;
import android.widget.LinearLayout;
import android.graphics.Color;
import android.widget.TextView;
import android.view.Gravity;
import android.util.TypedValue;

import com.reactnativenavigation.controllers.SplashActivity;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends SplashActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
  }

  @Override
  public LinearLayout createSplashLayout() {
    LinearLayout view = new LinearLayout(this);
    TextView textView = new TextView(this);

    view.setBackgroundColor(Color.parseColor("#607D8B"));
    view.setGravity(Gravity.CENTER);

    textView.setTextColor(Color.parseColor("#FFFFFF"));
    textView.setText("BinBill");
    textView.setGravity(Gravity.CENTER);
    textView.setTextSize(TypedValue.COMPLEX_UNIT_DIP, 40);

    view.addView(textView);
    return view;
  }
}
