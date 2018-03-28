import { PermissionsAndroid, Platform } from "react-native";

export const requestCameraPermission = async () => {
  if (Platform.OS != "android") return true;
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: "BinBill Camera Permission",
        message: "So that you can take photos of bills and products."
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      console.log("Camera permission denied");
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
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "BinBill  Permission",
        message: "So that you can upload and share bills and documents"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      console.log("Storage permission denied");
      return false;
    }
  } catch (err) {
    console.log("Storage permission denied 2");
    return false;
  }
};
