//
//  RNMultipleFilesShare.swift
//  BinBill
//
//  Created by Pramjeet Ahlawat on 27/12/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

import Foundation
import UIKit

@objc(RNMultipleFilesShare)
class RNMultipleFilesShare: NSObject {
  
  @objc(shareFiles:)
  func shareFiles(files: [String]) -> Void {
    
    let urls = files.map({
      (file: String) -> NSURL in
      return NSURL(fileURLWithPath: file)
    })
    
    let activityViewController = UIActivityViewController(activityItems: urls , applicationActivities: nil)
    
    DispatchQueue.main.async(execute: {
      let vc=getVisibleViewController(UIApplication.shared.keyWindow?.rootViewController)
      vc?.present(activityViewController, animated: true, completion: nil)
    })
  }
}

func getVisibleViewController(_ rootViewController: UIViewController?) -> UIViewController? {
  
  var rootVC = rootViewController
  if rootVC == nil {
    rootVC = UIApplication.shared.keyWindow?.rootViewController
  }
  
  if rootVC?.presentedViewController == nil {
    return rootVC
  }
  
  if let presented = rootVC?.presentedViewController {
    if presented.isKind(of: UINavigationController.self) {
      let navigationController = presented as! UINavigationController
      return navigationController.viewControllers.last!
    }
    
    if presented.isKind(of: UITabBarController.self) {
      let tabBarController = presented as! UITabBarController
      return tabBarController.selectedViewController!
    }
    
    return getVisibleViewController(presented)
  }
  return nil
}
