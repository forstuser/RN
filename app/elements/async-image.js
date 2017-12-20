import React, { Component } from "react";
import { View, StyleSheet, Image, Alert } from "react-native";
import PhotoView from "react-native-photo-view";

import { fetchFile } from "../api";
import { isImageFileType } from "../utils";

import store from "../store";
import Text from "./text";

const fileIcon = require("../images/ic_file.png");

class AsyncImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      imageSource: `data:image/jpeg;base64,`,
      errorMsg: null
    };
  }

  componentDidMount() {
    // this.fetchImage();
  }

  render() {
    if (!this.props.fileType || isImageFileType(this.props.fileType)) {
      const { isLoading, errorMsg, imageSource } = this.state;
      return (
        <Image
          style={[styles.image, this.props.style]}
          source={{ uri: this.props.uri }}
        />
      );
    } else {
      return (
        <Image
          style={[this.props.style, this.props.fileStyle]}
          source={fileIcon}
        />
      );
    }
  }
}

const styles = StyleSheet.create({
  image: {}
});

export default AsyncImage;
