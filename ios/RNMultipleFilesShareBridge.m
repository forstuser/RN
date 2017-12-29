//
//  RNMultipleFilesShareBridge.m
//  BinBill
//
//  Created by Pramjeet Ahlawat on 27/12/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(RNMultipleFilesShare, NSObject)

RCT_EXTERN_METHOD(shareFiles:(NSArray<NSString> *)files)

@end
