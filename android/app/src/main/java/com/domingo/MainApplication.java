package com.domingo;

import android.app.Application;

import com.facebook.react.ReactApplication;
import cl.json.RNSharePackage;
import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.imagepicker.ImagePickerPackage;
import com.mustansirzia.fused.FusedLocationPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import cl.json.ShareApplication;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ShareApplication, ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNSharePackage(),
            new ReactNativeLocalizationPackage(),
            new SplashScreenReactPackage(),
            new MapsPackage(),
            new ImagePickerPackage(),
            new FusedLocationPackage(),
            new FIRMessagingPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    // try {
    //     FirebaseApp.initializeApp(this);
    // }
    // catch (Exception e) {
    // }
  }

  @Override
     public String getFileProviderAuthority() {
            return "com.domingo.provider";
     }
}
