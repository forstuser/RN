import React, { Component } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Alert,
  Image,
  TouchableOpacity
} from "react-native";
import moment from "moment";
import ScrollableTabView from "react-native-scrollable-tab-view";
import { Text, Button, ScreenContainer, AsyncImage } from "../../elements";
import { API_BASE_URL } from "../../api";
import { isImageFileType } from "../../utils";

const fileIcon = require("../../images/ic_file.png");
const billDownloadIcon = require("../../images/ic_bill_download.png");
const shareIcon = require("../../images/ic_share_white.png");

const BillCopyItem = ({ billId, copy, index, total }) => (
  <View style={styles.bill}>
    <View style={styles.billCountTextWrapper}>
      <Text style={styles.billCountText}>
        {index + 1} of {total}
      </Text>
    </View>
    {isImageFileType(copy.file_type) && (
      <AsyncImage
        style={styles.billImage}
        uri={API_BASE_URL + "/" + copy.copyUrl}
      />
    )}
    {!isImageFileType(copy.file_type) && (
      <View style={styles.file}>
        <Image style={styles.fileIcon} source={fileIcon} />
        <Text weight="Medium" style={styles.fileName}>
          {!isNaN(billId) && "Bill_" + copy.copyId}
          {isNaN(billId) && billId}
        </Text>
      </View>
    )}
    <View style={styles.optionsWrapper}>
      <TouchableOpacity style={styles.option}>
        <Image style={styles.optionIcon} source={billDownloadIcon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.option}>
        <Image style={styles.optionIcon} source={shareIcon} />
      </TouchableOpacity>
    </View>
  </View>
);

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
