package com.bin.binbillcustomer;

import android.app.Application;
import android.content.Intent;
import android.os.StrictMode;

import com.evollu.react.fa.FIRAnalyticsPackage;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.microsoft.codepush.react.CodePush;
import com.oblador.vectoricons.VectorIconsPackage;
import com.horcrux.svg.SvgPackage;
import cl.json.RNSharePackage;
import com.reactnative.photoview.PhotoViewPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.cmcewen.blurview.BlurViewPackage;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.arttitude360.reactnative.rngoogleplaces.RNGooglePlacesPackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.azendoo.reactnativesnackbar.SnackbarPackage;

import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;


public class MainApplication extends Application implements ReactApplication {


  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
              new MainReactPackage(),
              new SnackbarPackage(),
              new SplashScreenReactPackage(),
              new RNSharePackage(),
              new RNFetchBlobPackage(),
              new RNViewShotPackage(),
              new RNGooglePlacesPackage(),
              new SvgPackage(),
              new ReactNativeDocumentPicker(),
              new PickerPackage(),
              new RNDeviceInfo(),
              new PhotoViewPackage(),
              new FastImageViewPackage(),
              new LinearGradientPackage(),
              new VectorIconsPackage(),
              new RNI18nPackage(),
              new FBSDKPackage(mCallbackManager),
              new FIRAnalyticsPackage(),
              new CodePush(null, MainApplication.this, BuildConfig.DEBUG),
              new FIRMessagingPackage(),
              new BlurViewPackage(),
              new BinBillPackager()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    StrictMode.VmPolicy.Builder builder = new StrictMode.VmPolicy.Builder();
    StrictMode.setVmPolicy(builder.build());
    AppEventsLogger.activateApp(this);
    if (!BuildConfig.DEBUG) {
      Fabric.with(this, new Crashlytics());
    }
    SoLoader.init(this, /* native exopackage */ false);
  }
}

