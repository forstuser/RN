package com.bin.binbillcustomer;

import android.app.Activity;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;


import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by pramjeetahlawat on 21/02/18.
 */

public class BinBillPackager implements ReactPackage {
//
//    private Activity mActivity = null;
//
//    public BinBillPackager(Activity activity) {
//        mActivity = activity;
//    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new RNMultipleFilesShareModule(reactContext));
        modules.add(new RNDirectUploadFileModule(reactContext));
        modules.add(new RNOpenAppSettingsModule(reactContext));
        modules.add(new RNGetPreviousAppAuthToken(reactContext));
        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
