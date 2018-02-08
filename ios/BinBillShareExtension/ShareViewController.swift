//
//  ShareViewController.swift
//  BinBIllShareExtension
//
//  Created by Pramjeet Ahlawat on 06/02/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import UIKit
import Social
import MobileCoreServices

class ShareViewController: SLComposeServiceViewController {
  
  
  override func loadPreviewView()-> UIView! {
    let extensionItem = extensionContext?.inputItems[0] as! NSExtensionItem
    let contentType = kUTTypeImage as String
    
    // it works for only one image for now
    let attachment = extensionItem.attachments?.first as! NSItemProvider;
    if(attachment.hasItemConformingToTypeIdentifier(contentType)) {
      attachment.loadItem(forTypeIdentifier: contentType, options: nil) { item, error in
        
        var imgName: String!
        var imgData: Data!
        if let url = item as? URL{
          imgName=url.lastPathComponent
          imgData = try! Data(contentsOf: url)
        }
        
        if let img = item as? UIImage{
          imgData = UIImageJPEGRepresentation(img, 0.8)
        }
        
        
        let fileManager = FileManager.default
        if let sharedContainer = fileManager.containerURL(forSecurityApplicationGroupIdentifier: "group.com.binbill") {
          let dirPath = sharedContainer.path;
          let sharedImageFilePath = "file://"+dirPath + "/"+((imgName != nil) ? imgName: "image-for-direct-upload.jpg");
          
          do {
            try imgData.write(to: URL(string: sharedImageFilePath)!, options: .atomic);
          } catch let error {
            print(error.localizedDescription)
            let alert = UIAlertController(title: error.localizedDescription, message: "Message", preferredStyle: UIAlertControllerStyle.alert)
            alert.addAction(UIAlertAction(title: "Click", style: UIAlertActionStyle.default, handler: nil))
            return
          }
          
          let alert = UIAlertController(title: "Title", message: "Message", preferredStyle: UIAlertControllerStyle.alert)
          alert.addAction(UIAlertAction(title: "Click", style: UIAlertActionStyle.default, handler: nil))
          //            self.present(alert, animated: true, completion: nil)
          
          //keep two 'files' here, as it will become an array in 'query'
          let urlstring = "https://www.binbill.com/direct-upload-document?files="+sharedImageFilePath+"&files="+sharedImageFilePath;
          let binbillurl = NSURL(string: urlstring);
          if(self.openURL(binbillurl! as URL)){
            self.extensionContext!.completeRequest(returningItems: [], completionHandler: nil)
          }
        }
      }
    }
    return nil;
  }
  
  override func isContentValid() -> Bool {
    // Do validation of contentText and/or NSExtensionContext attachments here
    return false
  }
  
  override func didSelectPost() {
    // This is called after the user selects Post. Do the upload of contentText and/or NSExtensionContext attachments.
    
    // Inform the host that we're done, so it un-blocks its UI. Note: Alternatively you could call super's -didSelectPost, which will similarly complete the extension context.
    self.extensionContext!.completeRequest(returningItems: [], completionHandler: nil)
  }
  
  override func configurationItems() -> [Any]! {
    // To add configuration options via table cells at the bottom of the sheet, return an array of SLComposeSheetConfigurationItem here.
    return []
  }
  
  //  Function must be named exactly like this so a selector can be found by the compiler!
  //  Anyway - it's another selector in another instance that would be "performed" instead.
  //  Function must be named exactly like this so a selector can be found by the compiler!
  //  Anyway - it's another selector in another instance that would be "performed" instead.
  @objc func openURL(_ url: URL) -> Bool {
    var responder: UIResponder? = self
    while responder != nil {
      if let application = responder as? UIApplication {
        return application.perform(#selector(openURL(_:)), with: url) != nil
      }
      responder = responder?.next
    }
    return false
  }

}

