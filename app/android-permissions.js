import { PermissionsAndroid } from "react-native";

export const requestStoragePermission = async () => {
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
