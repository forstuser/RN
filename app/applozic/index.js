import { NativeModules } from "react-native";

var ApplozicChat = NativeModules.ApplozicChat;
console.log("ApplozicChat: ", ApplozicChat);

export const loginToApplozic = ({ id, name }) => {
  var alUser = {
    userId: String(id),
    password: String(id),
    displayName: String(name),
    email: "",
    authenticationTypeId: 1,
    applicationId: "binbill40002f8f92e5e65dbc8dadc", //replace "applozic-sample-app" with Application Key from Applozic Dashboard
    deviceApnsType: 0 //Set 0 for Development and 1 for Distribution (Release)
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
