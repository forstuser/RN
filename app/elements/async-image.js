import React, { Component } from "react";
import { View, StyleSheet, Image, Alert } from "react-native";
import FastImage from "react-native-fast-image";
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
    let headers = {
      Authorization: ""
    };
    const token = store.getState().loggedInUser.authToken;
    if (token) {
      headers.Authorization = token;
    }

    let source = this.props.source;
    if (this.props.uri) {
      source = {
        uri: this.props.uri,
        headers: headers
      };
    } else if (this.props.source && this.props.source.uri) {
      source = {
        uri: this.props.source.uri,
        headers: headers
      };
    }

    if (!this.props.fileType || isImageFileType(this.props.fileType)) {
      const { isLoading, errorMsg, imageSource } = this.state;
      return (
        <FastImage
          style={[styles.image, this.props.style]}
          source={source}
          resizeMode={this.props.resizeMode}
        />
      );
    } else {
      return (
        <Image
          style={[this.props.style, this.props.fileStyle]}
          source={fileIcon}
          resizeMode={this.props.resizeMode}
        />
      );
    }
  }
}

const styles = StyleSheet.create({
  image: {}
});

export default AsyncImage;
