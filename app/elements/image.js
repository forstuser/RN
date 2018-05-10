import React, { Component } from "react";
import { View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import FastImage from "react-native-fast-image";
import { isImageFileType } from "../utils";

import store from "../store";
import Text from "./text";

import brokenImageIcon from "../images/broken_image.png";
const fileIcon = require("../images/ic_file.png");

class Image extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      error: false
    };
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
    if (this.props.source && this.props.source.uri) {
      source = {
        uri: this.props.source.uri,
        headers: headers
      };
    }

    if (!this.props.fileType || isImageFileType(this.props.fileType)) {
      return (
        <View style={[styles.container, this.props.style]}>
          <View style={styles.loader}>
            <ActivityIndicator size="small" animating={this.state.isLoading} />
          </View>
          <FastImage
            onLoadEnd={() => this.setState({ isLoading: false })}
            onError={() => this.setState({ error: true })}
            style={styles.image}
            source={source}
            {...this.props}
          />
          {this.state.error ? (
            <View style={styles.errorImageContainer}>
              <FastImage
                style={styles.errorImage}
                source={brokenImageIcon}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
          ) : (
            <View />
          )}
        </View>
      );
    } else {
      return (
        <Image
          style={[this.props.style, this.props.fileStyle]}
          source={fileIcon}
          {...this.props}
        />
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden"
  },
  image: {
    width: "100%",
    height: "100%"
  },
  loader: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  errorImageContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff"
  },
  errorImage: {
    width: "90%",
    height: "90%",
    maxWidth: 100,
    maxHeight: 100
  }
});

export default Image;
