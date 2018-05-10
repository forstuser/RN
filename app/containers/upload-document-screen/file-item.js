import React, { Component } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Alert,
  Image,
  TouchableOpacity,
  Platform
} from "react-native";
import moment from "moment";
import PhotoView from "react-native-photo-view";

import ScrollableTabView from "react-native-scrollable-tab-view";
import { Text, Button, ScreenContainer } from "../../elements";
import { API_BASE_URL } from "../../api";
import { isImageFileType } from "../../utils";

const fileIcon = require("../../images/ic_file.png");
const uploadDeleteIcon = require("../../images/ic_upload_delete.png");

const FileItem = ({ file, index, total, removeFile }) => (
  <View style={styles.bill}>
    <View style={styles.billCountTextWrapper}>
      <Text style={styles.billCountText}>
        {index + 1} of {total}
      </Text>
    </View>
    {isImageFileType(file.mimeType) ? (
      <PhotoView
        style={styles.billImage}
        source={{ uri: Platform.OS == "ios" ? `file://${file.uri}` : file.uri }}
        resizeMode="contain"
      />
    ) : (
      <View style={styles.file}>
        <Image style={styles.fileIcon} source={fileIcon} />
        <Text weight="Medium" style={styles.fileName}>
          {file.filename}
        </Text>
      </View>
    )}
    <View style={styles.optionsWrapper}>
      <TouchableOpacity onPress={removeFile} style={styles.option}>
        <Image style={styles.optionIcon} source={uploadDeleteIcon} />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  bill: {
    alignItems: "center",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0
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
    bottom: 10,
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

export default FileItem;
