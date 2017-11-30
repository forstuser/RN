import React, { Component } from "react";
import { View, StyleSheet, Image, Alert } from "react-native";

import { isImageFileType } from "../utils";

import store from "../store";
import Text from "./text";

const fileIcon = require("../images/ic_file.png");

class AsyncImage extends Component {
  render() {
    if (this.props.fileType && !isImageFileType(this.props.fileType)) {
      return (
        <Image
          style={[this.props.style, this.props.fileStyle]}
          source={fileIcon}
        />
      );
    } else {
      return (
        <Image
          style={[styles.image, this.props.style]}
          source={{
            uri: this.props.uri,
            headers: {
              Authorization: store.getState().loggedInUser.authToken
            }
          }}
        />
      );
    }
  }
}

const styles = StyleSheet.create({
  image: {}
});

export default AsyncImage;
