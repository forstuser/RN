import React, { Component } from "react";
import { View, StyleSheet, Image, Alert } from "react-native";

import store from "../store";
import Text from "./text";

class AsyncImage extends Component {
  render() {
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

const styles = StyleSheet.create({
  image: {}
});

export default AsyncImage;
