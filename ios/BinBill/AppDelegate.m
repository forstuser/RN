/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

#import "RCCManager.h"

#import <React/RCTRootView.h>

#import "RNFIRMessaging.h"

#import "RCTLinkingManager.h"

#import <Firebase/Firebase.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>

#import <CodePush/CodePush.h>

#import <Fabric/Fabric.h>
#import <Crashlytics/Crashlytics.h>

#import <AVFoundation/AVFoundation.h>

@import GooglePlaces;
@import GoogleMaps;

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity
 restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler
{
  return [RCTLinkingManager application:application
                   continueUserActivity:userActivity
                     restorationHandler:restorationHandler];
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  
  [Fabric with:@[[Crashlytics class]]];
  
  //without this line audio won't play if side switch is on mute on device
  [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayback error:nil];
  
  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];
  
  [GMSPlacesClient provideAPIKey:@"AIzaSyBRc60dgzwy-6ilVQZxcdUfjLrWMJmEG9I"];
  [GMSServices provideAPIKey:@"AIzaSyBRc60dgzwy-6ilVQZxcdUfjLrWMJmEG9I"];
  
  [FIRApp configure];
  [[UNUserNotificationCenter currentNotificationCenter] setDelegate:self];

  NSURL *jsCodeLocation;

//  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];

  #ifdef DEBUG
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  #else
    jsCodeLocation = [CodePush bundleURL];
  #endif
  
  // **********************************************
  // *** Wix/React-native-navigation *****
  // **********************************************
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  self.window.backgroundColor = [UIColor whiteColor];
  [[RCCManager sharedInstance] initBridgeWithBundleURL:jsCodeLocation launchOptions:launchOptions];
  
  /*
  // original RN bootstrap - remove this part
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"BinBill"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  */
  
  return YES;
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  
    BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:application openURL:url
    sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
           annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
                    ];
    // Add any custom logic here.
  return handled;
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
  [FBSDKAppEvents activateApp];
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler
 {
     [RNFIRMessaging willPresentNotification:notification withCompletionHandler:completionHandler];
   }

 #if defined(__IPHONE_11_0)
 - (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler
 {
     [RNFIRMessaging didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
   }
 #else
 - (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void(^)())completionHandler
 {
     [RNFIRMessaging didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
   }
 #endif

 //You can skip this method if you don't want to use local notification
 -(void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
     [RNFIRMessaging didReceiveLocalNotification:notification];
   }

 - (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
     [RNFIRMessaging didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
   }


@end
