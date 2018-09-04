import {
  PermissionsAndroid,
  Platform,
  Alert,
  NativeModules
} from "react-native";

const requestPermission = async ({ permission, title, desc }) => {
  if (Platform.OS != "android") return true;
  try {
    const granted = await PermissionsAndroid.request(permission);
    console.log(
      "granted :",
      granted,
      "PermissionsAndroid.RESULTS.GRANTED :",
      PermissionsAndroid.RESULTS.GRANTED
    );
    if (granted === true || granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      setTimeout(() => {
        Alert.alert(title, desc, [
          {
            text: "Cancel",
            onPress: () => {}
          },
          {
            text: "Open Settings",
            onPress: () =>
              NativeModules.RNOpenAppSettingsModule.openAppSettings()
          }
        ]);
      }, 200);
      return false;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

export const requestSmsReadPermission = async () => {
  return await requestPermission({
    permission: PermissionsAndroid.PERMISSIONS.READ_SMS,
    title: "You need to provide permission to read SMS.",
    desc: "Please open app settings and turn on the SMS permission."
  });
};

export const requestStoragePermission = async () => {
  return await requestPermission({
    permission: PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    title: "You need to provide permission to access Media files.",
    desc: "Please open app settings and turn on the storage permission."
  });
};

export const requestCameraPermission = async () => {
  const cameraPermission = await requestPermission({
    permission: PermissionsAndroid.PERMISSIONS.CAMERA,
    title: "You need to provide permission to access Camera.",
    desc: "Please open app settings and turn on the camera permission."
  });

  if (cameraPermission) {
    return requestStoragePermission();
  } else {
    return false;
  }
};
