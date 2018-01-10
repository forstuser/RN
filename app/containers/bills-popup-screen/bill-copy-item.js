import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  FlatList,
  Alert,
  Image,
  TouchableOpacity,
  CameraRoll
} from "react-native";
import moment from "moment";
import PhotoView from "react-native-photo-view";
import ScrollableTabView from "react-native-scrollable-tab-view";
import RNFetchBlob from "react-native-fetch-blob";
import Share from "react-native-share";
import { Text, Button, ScreenContainer, AsyncImage } from "../../elements";
import { API_BASE_URL, fetchFile } from "../../api";
import { isImageFileType, getMimeTypeByExtension } from "../../utils";
import { showSnackbar, hideSnackbar } from "../snackbar";
import I18n from "../../i18n";

const fileIcon = require("../../images/ic_file.png");
const billDownloadIcon = require("../../images/ic_bill_download.png");
const shareIcon = require("../../images/ic_share_white.png");

const uploadDeleteIcon = require("../../images/ic_upload_delete.png");

const BillCopyItem = ({
  billId,
  copy,
  index,
  total,
  onShareBtnClick,
  authToken,
  onDeleteBtnClick
}) => {
  const onDownloadPress = () => {
    if (Platform.OS === "ios") {
      if (isImageFileType(copy.file_type)) {
        showSnackbar({
          text: I18n.t("bill_copy_popup_screen_downloading_image"),
          autoDismissTimerSec: 1000
        });

        RNFetchBlob.config({
          fileCache: true,
          appendExt: copy.file_type
        })
          .fetch("GET", API_BASE_URL + copy.copyUrl, {
            Authorization: authToken
          })
          .then(res => {
            CameraRoll.saveToCameraRoll("file://" + res.path()).then(
              showSnackbar({
                text: I18n.t("bill_copy_popup_screen_downloaded_image"),
                autoDismissTimerSec: 10
              })
            );
          })
          .catch((errorMessage, statusCode) => {
            showSnackbar({
              text: I18n.t("bill_copy_popup_screen_download_error"),
              autoDismissTimerSec: 10
            });
          });
      }
    }
  };

  return (
    <View style={styles.bill}>
      <View style={styles.billCountTextWrapper}>
        <Text style={styles.billCountText}>
          {index + 1} of {total}
        </Text>
      </View>
      {isImageFileType(copy.file_type) && (
        <Image
          style={styles.billImage}
          source={{ uri: API_BASE_URL + copy.copyUrl }}
        />
      )}
      {!isImageFileType(copy.file_type) && (
        <View style={styles.file}>
          <Image style={styles.fileIcon} source={fileIcon} />
          <Text weight="Medium" style={styles.fileName}>
            {!isNaN(billId) && "Bill_" + copy.copyId + "." + copy.file_type}
            {isNaN(billId) && billId}
          </Text>
        </View>
      )}
      <View style={styles.optionsWrapper}>
        {isImageFileType(copy.file_type) && (
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
    alignItems: "center"
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
