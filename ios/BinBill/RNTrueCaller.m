//
//  RNTruecaller.m
//  BinBill
//
//  Created by Pramjeet Ahlawat on 28/02/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RNTrueCaller.h"
#import <TrueSDK/TrueSDK.h>

@implementation RNTrueCaller

RCT_EXPORT_MODULE();

- (instancetype)init
{
  self = [super init];
  NSLog(@"TRUECALLER INIT");
  if (self) {
    [TCTrueSDK sharedManager].delegate = self;
  }
  
  return self;
}

RCT_REMAP_METHOD(getProfileDetails,
                 findEventsWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  
  
  [[TCTrueSDK sharedManager] requestTrueProfile];
  
  NSArray *nativeModuleList = @[@"react-native-fbsdk", @"react-native-camera", @"react-native-maps"];
  
  if (true) {
    resolve(nativeModuleList);
  } else {
    NSError *error = nil;
    reject(@"no_events", @"There were no events", error);
  }
}

- (void)didReceiveTrueProfile:(nonnull TCTrueProfile *)profile {
  NSLog(@"TRUECALLER PROFILE: %@", profile);
  //Custom code
}

- (void)didFailToReceiveTrueProfileWithError:(nonnull TCError *)error {
  //Custom code
  NSLog(@"TRUECALLER ERROR: %@", error);
}

@end
