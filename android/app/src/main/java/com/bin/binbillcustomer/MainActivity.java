package com.bin.binbillcustomer;

import android.animation.Animator;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.provider.OpenableColumns;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.widget.ImageView;

import com.reactnativenavigation.controllers.SplashActivity;

import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends SplashActivity {

    private ImageView splash1, splash2, splash3;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View createSplashLayout() {

        LayoutInflater inflater =(LayoutInflater)getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        View view = inflater.inflate(R.layout.splash, null);

        splash1 = (ImageView) view.findViewById(R.id.splash_1);
        splash2 = (ImageView) view.findViewById(R.id.splash_2);
        splash3 = (ImageView) view.findViewById(R.id.splash_3);

        splash1.setVisibility(View.VISIBLE);
        AlphaAnimation alphaAnimation = new AlphaAnimation(0.0f, 1.0f);
        alphaAnimation.setDuration(1000);
        splash1.startAnimation(alphaAnimation);
        alphaAnimation.setAnimationListener(new Animation.AnimationListener() {
            @Override
            public void onAnimationStart(Animation animation) {

            }

            @Override
            public void onAnimationEnd(Animation animation) {
                startSecondAnimation();
            }

            @Override
            public void onAnimationRepeat(Animation animation) {

            }
        });

        return view;
    }

    private void startSecondAnimation() {
        splash2.setVisibility(View.VISIBLE);
        //splash1.setVisibility(View.GONE);
        AlphaAnimation alphaAnimation1 = new AlphaAnimation(1.0f, 0.0f);
        alphaAnimation1.setDuration(1000);
        splash1.startAnimation(alphaAnimation1);
        AlphaAnimation alphaAnimation = new AlphaAnimation(0.0f, 1.0f);
        alphaAnimation.setDuration(1000);
        splash2.startAnimation(alphaAnimation);
        alphaAnimation.setAnimationListener(new Animation.AnimationListener() {
            @Override
            public void onAnimationStart(Animation animation) {

            }

            @Override
            public void onAnimationEnd(Animation animation) {
                splash3.setVisibility(View.VISIBLE);
                splash3.setAlpha(0.0f);
                splash3.animate()
                        .translationY(0)
                        .alpha(1.0f)
                        .setDuration(1000)
                        .setListener(new Animator.AnimatorListener() {
                            @Override
                            public void onAnimationStart(Animator animator) {

                            }

                            @Override
                            public void onAnimationEnd(Animator animator) {

                            }

                            @Override
                            public void onAnimationCancel(Animator animator) {

                            }

                            @Override
                            public void onAnimationRepeat(Animator animator) {

                            }
                        });
            }

            @Override
            public void onAnimationRepeat(Animation animation) {

            }
        });


    }
}
