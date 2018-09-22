import { NativeModules } from "react-native";

var ApplozicChat = NativeModules.ApplozicChat;
console.log("ApplozicChat: ", ApplozicChat);

export const loginToApplozic = ({ id, name }) => {
  var alUser = {
    userId: "user_" + String(id),
    password: String(id),
    displayName: String(name),
    email: "",
    authenticationTypeId: 1,
    applicationId: "10bf4d406aff6f1cdbad607072d4bb0a2", //replace "applozic-sample-app" with Application Key from Applozic Dashboard
    deviceApnsType: __DEV__ ? 0 : 1 //Set 0 for Development and 1 for Distribution (Release)
  };

  return new Promise((resolve, reject) => {
    ApplozicChat.login(alUser, (error, response) => {
      if (error) {
        console.log("error: ", error);
        reject("Some error occurred!");
      } else {
        //authentication success callback
        console.log("response:", response);
        resolve();
      }
    });
  });
};

export const openChatWithSeller = ({ id }) => {
  return ApplozicChat.openChatWithUser("seller_" + id);
};

export default { loginToApplozic, openChatWithSeller };
