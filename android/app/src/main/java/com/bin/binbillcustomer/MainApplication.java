package com.bin.binbillcustomer;

import com.evollu.react.fa.FIRAnalyticsPackage;
import com.microsoft.codepush.react.CodePush;
import com.oblador.vectoricons.VectorIconsPackage;
import com.horcrux.svg.SvgPackage;
import cl.json.RNSharePackage;
import com.reactnative.photoview.PhotoViewPackage;
import com.reactnativenavigation.NavigationApplication;
import com.BV.LinearGradient.LinearGradientPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.reactnativenavigation.bridge.NavigationReactPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.reactlibrary.RNPdfScannerPackage;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.cmcewen.blurview.BlurViewPackage;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.arttitude360.reactnative.rngoogleplaces.RNGooglePlacesPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import in.sriraman.sharedpreferences.RNSharedPreferencesReactPackage;

import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  @Override
  public void onCreate() {
    super.onCreate();
    AppEventsLogger.activateApp(this);
  }

  @Override
  public boolean isDebug() {
    // Make sure you are using BuildConfig from your own application
    return BuildConfig.DEBUG;
  }

  protected List<ReactPackage> getPackages() {
    // Add additional packages you require here
    // No need to add RnnPackage and MainReactPackage
    return Arrays.<ReactPackage>asList(new MainReactPackage(), new FBSDKPackage(mCallbackManager),
        new RNSharedPreferencesReactPackage(), new SplashScreenReactPackage(), new FIRAnalyticsPackage(),
        new CodePush(null, getApplicationContext(), BuildConfig.DEBUG), new VectorIconsPackage(), new SvgPackage(),
        new RNSharePackage(), new PhotoViewPackage(), new NavigationReactPackage(), new LinearGradientPackage(),
        new PickerPackage(), new RNI18nPackage(), new RNGestureHandlerPackage(), new RNFetchBlobPackage(),
        new FIRMessagingPackage(), new RNPdfScannerPackage(), new ReactNativeDocumentPicker(), new RNDeviceInfo(),
        new BlurViewPackage(), new RNGooglePlacesPackage(), new BinBillPackager());
  }

  @Override
  public List<ReactPackage> createAdditionalReactPackages() {
    return getPackages();
  }

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  // private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
  //   @Override
  //   public boolean getUseDeveloperSupport() {
  //     return BuildConfig.DEBUG;
  //   }

  //   @Override
  //   protected List<ReactPackage> getPackages() {
  //     return Arrays.<ReactPackage>asList(
  //         new MainReactPackage(),

  //     );
  //   }

  //   @Override
  //   protected String getJSMainModuleName() {
  //     return "index";
  //   }
  // };

  // @Override
  // public ReactNativeHost getReactNativeHost() {
  //   return mReactNativeHost;
  // }

  // @Override
  // public void onCreate() {
  //   super.onCreate();
  //   SoLoader.init(this, /* native exopackage */ false);
  // }
}
