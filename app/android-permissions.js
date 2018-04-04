import {
  PermissionsAndroid,
  Platform,
  Alert,
  NativeModules
} from "react-native";

export const requestCameraPermission = async () => {
  if (Platform.OS != "android") return true;
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );
    console.log("granted:", granted);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      setTimeout(() => {
        Alert.alert(
          "You need to provide permission to access Camera.",
          "Please open app settings and turn on the camera permission.",
          [
            {
              text: "Cancel",
              onPress: () => { }
            },
            {
              text: "Open Settings",
              onPress: () =>
                NativeModules.RNOpenAppSettingsModule.openAppSettings()
            }
          ]
        );
      }, 200);
      return false;
    } else {
      return false;
    }
  } catch (err) {
    console.log("Camera permission denied 2");
    return false;
  }
};

export const requestStoragePermission = async () => {
  if (Platform.OS != "android") return true;
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      setTimeout(() => {
        Alert.alert(
          "You need to provide permission to access Media files.",
          "Please open app settings and turn on the storage permission.",
          [
            {
              text: "Cancel",
              onPress: () => { }
            },
            {
              text: "Open Settings",
              onPress: () =>
                NativeModules.RNOpenAppSettingsModule.openAppSettings()
            }
          ]
        );
      }, 200);
      return false;
    } else {
      return false;
    }
  } catch (err) {
    console.log("Storage permission denied 2");
    return false;
  }
};
