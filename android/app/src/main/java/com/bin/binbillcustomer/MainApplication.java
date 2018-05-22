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

import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;

import com.microsoft.codepush.react.ReactInstanceHolder;

//public class MainApplication extends NavigationApplication implements ReactInstanceHolder {
//
//  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();
//
//  @Override
//  public void onCreate() {
//    super.onCreate();
//
//    if (!BuildConfig.DEBUG) {
//      Fabric.with(this, new Crashlytics());
//    }
//
//    setActivityCallbacks(new ActivityCallbacks() {
//      @Override
//      public void onActivityResumed(Activity activity) {
//        // Do stuff
//      }
//
//      @Override
//      public void onActivityPaused(Activity activity) {
//        // Do stuff
//      }
//
//      @Override
//      public void onActivityResult(int requestCode, int resultCode, Intent data) {
//        mCallbackManager.onActivityResult(requestCode, resultCode, data);
//      }
//    });
//
//    FacebookSdk.sdkInitialize(getApplicationContext());
//
//    // If you want to use AppEventsLogger to log events.
//    AppEventsLogger.activateApp(this);
//
//    SoLoader.init(this, /* native exopackage */ false);
//
//    StrictMode.VmPolicy.Builder builder = new StrictMode.VmPolicy.Builder();
//    StrictMode.setVmPolicy(builder.build());
//  }
//
//  protected static CallbackManager getCallbackManager() {
//    return mCallbackManager;
//  }
//
//  @Override
//  public boolean isDebug() {
//    // Make sure you are using BuildConfig from your own application
//    return BuildConfig.DEBUG;
//  }
//
//  @Override
//  public String getJSBundleFile() {
//    return CodePush.getJSBundleFile();
//  }
//
//  @Override
//  public String getJSMainModuleName() {
//    return "index";
//  }
//
//  @Override
//  public ReactInstanceManager getReactInstanceManager() {
//    // CodePush must be told how to find React Native instance
//    return getReactNativeHost().getReactInstanceManager();
//  }
//
//  protected List<ReactPackage> getPackages() {
//    // Add additional packages you require here
//    // No need to add RnnPackage and MainReactPackage
//    return Arrays.<ReactPackage>asList(new FastImageViewPackage(), new RNViewShotPackage(), new FBSDKPackage(mCallbackManager),
//        new FIRAnalyticsPackage(), new CodePush(null, getApplicationContext(), BuildConfig.DEBUG),
//        new VectorIconsPackage(), new SvgPackage(), new RNSharePackage(), new PhotoViewPackage(),
//        new NavigationReactPackage(), new LinearGradientPackage(), new PickerPackage(), new RNI18nPackage(),
//        new RNFetchBlobPackage(), new FIRMessagingPackage(), new ReactNativeDocumentPicker(), new RNDeviceInfo(),
//        new BlurViewPackage(), new RNGooglePlacesPackage(), new BinBillPackager());
//  }
//
//  @Override
//  public List<ReactPackage> createAdditionalReactPackages() {
//    return getPackages();
//  }
//
//  // private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
//
//  //   @Override
//  //   public boolean getUseDeveloperSupport() {
//  //     return BuildConfig.DEBUG;
//  //   }
//
//  //   @Override
//  //   protected List<ReactPackage> getPackages() {
//  //     return Arrays.<ReactPackage>asList(
//  //         new MainReactPackage(),
//
//  //     );
//  //   }
//
//  //   @Override
//  //   protected String getJSMainModuleName() {
//  //     return "index";
//  //   }
//  // };
//
//  // @Override
//  // public ReactNativeHost getReactNativeHost() {
//  //   return mReactNativeHost;
//  // }
//
//  // @Override
//  // public void onCreate() {
//  //   super.onCreate();
//  //   SoLoader.init(this, /* native exopackage */ false);
//  // }
//}



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
    AppEventsLogger.activateApp(this);
    if (!BuildConfig.DEBUG) {
      Fabric.with(this, new Crashlytics());
    }
    SoLoader.init(this, /* native exopackage */ false);
  }
}

