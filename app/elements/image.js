import React, { Component } from "react";
import { View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import FastImage from "react-native-fast-image";
import PhotoView from "react-native-photo-view";
import { isImageFileType } from "../utils";

import store from "../store";
import Text from "./text";

import brokenImageIcon from "../images/broken_image.png";
import { colors } from "../theme";
const fileIcon = require("../images/ic_file.png");

class Image extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      error: false
    };
  }

  componentDidMount() {
    // if (this.props.source && !this.props.source.uri) {
    //   this.setState({
    //     isLoading: false
    //   });
    // }
  }

  render() {
    let { source, fileType, style, fileStyle, usePhotoView } = this.props;
    let headers = {
      Authorization: ""
    };
    const token = store.getState().loggedInUser.authToken;
    if (token) {
      headers.Authorization = token;
    }

    if (source && source.uri) {
      source = {
        ...source,
        headers
      };
    }

    let props = { ...this.props };
    delete props.style;

    if (!fileType || isImageFileType(fileType)) {
      return (
        <View collapsable={false} style={[styles.container, style]}>
          {usePhotoView ? (
            <PhotoView
              onLoadEnd={() => this.setState({ isLoading: false })}
              onError={() => this.setState({ error: true })}
              style={styles.image}
              source={source}
              {...props}
            />
          ) : (
            <FastImage
              onLoadEnd={() => this.setState({ isLoading: false })}
              onError={() => this.setState({ error: true })}
              style={styles.image}
              source={source}
              {...props}
            />
          )}
          {this.state.isLoading ? (
            <View collapsable={false} style={styles.loader}>
              <ActivityIndicator size="small" color={colors.mainBlue} />
            </View>
          ) : (
            <View collapsable={false} />
          )}
          {this.state.error ? (
            <View collapsable={false} style={styles.errorImageContainer}>
              <FastImage
                style={styles.errorImage}
                source={brokenImageIcon}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
          ) : (
            <View collapsable={false} />
          )}
        </View>
      );
    } else {
      return (
        <Image
          style={[style, fileStyle]}
          source={fileIcon}
          resizeMode={this.props.resizeMode}
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
