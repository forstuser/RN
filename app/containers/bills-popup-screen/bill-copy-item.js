import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  FlatList,
  Alert,
  TouchableOpacity,
  CameraRoll,
  Dimensions,
  WebView
} from "react-native";
import moment from "moment";

import ScrollableTabView from "react-native-scrollable-tab-view";
import RNFetchBlob from "react-native-fetch-blob";
import Share from "react-native-share";
import { Text, Button, ScreenContainer, Image } from "../../elements";
import { API_BASE_URL } from "../../api";
import { isImageFileType, getMimeTypeByExtension } from "../../utils";
import { showSnackbar, hideSnackbar } from "../../utils/snackbar";
import I18n from "../../i18n";
import ImageZoom from "react-native-image-pan-zoom";

import { requestStoragePermission } from "../../android-permissions";

const fileIcon = require("../../images/ic_file.png");
const billDownloadIcon = require("../../images/ic_bill_download.png");
const shareIcon = require("../../images/ic_share_white.png");

const uploadDeleteIcon = require("../../images/ic_upload_delete.png");

const android = RNFetchBlob.android;

const BillCopyItem = ({
  billId,
  copy,
  index,
  total,
  onShareBtnClick,
  authToken,
  onDeleteBtnClick
}) => {
  console.log("copy laste nd", copy);
  const mimeType = getMimeTypeByExtension(copy.file_type);
  const onDownloadPress = async openAfterDownload => {
    if ((await requestStoragePermission()) == false) return;

    showSnackbar({
      text: I18n.t("bill_copy_popup_screen_downloading_file"),
      autoDismissTimerSec: 1000
    });

    if (Platform.OS === "ios") {
      RNFetchBlob.config({
        fileCache: true,
        appendExt: copy.file_type
      })
        .fetch("GET", API_BASE_URL + copy.copyUrl, {
          Authorization: authToken
        })
        .then(res => {
          if (isImageFileType(copy.file_type) && !openAfterDownload) {
            CameraRoll.saveToCameraRoll("file://" + res.path()).then(
              showSnackbar({
                text: I18n.t("bill_copy_popup_screen_downloaded_image_ios"),
                autoDismissTimerSec: 10
              })
            );
          } else {
            RNFetchBlob.ios.openDocument(res.path());
          }
        })
        .catch((errorMessage, statusCode) => {
          showSnackbar({
            text: I18n.t("bill_copy_popup_screen_download_error"),
            autoDismissTimerSec: 10
          });
        });
    } else {
      RNFetchBlob.config({
        path: RNFetchBlob.fs.dirs.DownloadDir + "/file." + copy.file_type,
        addAndroidDownloads: {
          notification: true,
          title: "Bill FIle Downloaded",
          mime: mimeType,
          description: "BinBill bill file",
          mediaScannable: true
        }
      })
        .fetch("GET", API_BASE_URL + copy.copyUrl, {
          Authorization: authToken
        })
        .then(res => {
          console.log("file path: ", res.path());
          if (openAfterDownload) {
            android.actionViewIntent(res.path(), mimeType);
          } else {
            showSnackbar({
              text: "File Downloaded!!"
            });
          }
        })
        .catch((errorMessage, statusCode) => {
          showSnackbar({
            text: I18n.t("bill_copy_popup_screen_download_error"),
            autoDismissTimerSec: 10
          });
        });
    }
  };

  return (
    <View collapsable={false} style={styles.bill}>
      <View collapsable={false} style={styles.billCountTextWrapper}>
        <Text style={styles.billCountText}>
          {index + 1} of {total}
        </Text>
      </View>
      {isImageFileType(copy.file_type) && (
        // <AsyncImage
        //   style={styles.billImage}
        //   fileType={copy.file_type}
        //   uri={API_BASE_URL + "/" + copy.copyUrl}
        // />
        <Image
          // usePhotoView={true}
          style={styles.billImage}
          source={{ uri: API_BASE_URL + copy.copyUrl }}
          resizeMode="contain"
        />
      )}
      {!isImageFileType(copy.file_type) && (
        <View collapsable={false} style={styles.file}>
          <Image style={styles.fileIcon} source={fileIcon} />
          <Text weight="Medium" style={styles.fileName}>
            {!isNaN(billId) && "Bill_" + copy.copyId + "." + copy.file_type}
            {isNaN(billId) && billId}
          </Text>
          <Button
            text="Open file"
            onPress={onDownloadPress}
            style={{ width: 150 }}
          />
        </View>
      )}
      <View collapsable={false} style={styles.optionsWrapper}>
        {(isImageFileType(copy.file_type) || Platform.OS == "android") && (
          <TouchableOpacity style={styles.option} onPress={onDownloadPress}>
            <Image style={styles.optionIcon} source={billDownloadIcon} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.option} onPress={onShareBtnClick}>
          <Image style={styles.optionIcon} source={shareIcon} />
        </TouchableOpacity>
        {onDeleteBtnClick && (
          <TouchableOpacity style={styles.option} onPress={onDeleteBtnClick}>
            <Image style={styles.optionIcon} source={uploadDeleteIcon} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bill: {
    alignItems: "center",
    zIndex: 0
  },
  billCountTextWrapper: {
    backgroundColor: "rgba(135,135,135,0.8)",
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: -10,
    zIndex: 2
  },
  billCountText: {
    color: "#fff"
  },
  billImage: {
    width: "100%",
    height: "100%"
  },
  file: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  fileIcon: {
    width: 100,
    height: 100,
    marginBottom: 10
  },
  fileName: {
    color: "#fff"
  },
  optionsWrapper: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row"
  },
  option: {
    borderColor: "#fff",
    borderWidth: 2,
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#484848",
    marginHorizontal: 10
  },
  optionIcon: {
    width: 24,
    height: 24
  }
});

export default BillCopyItem;
