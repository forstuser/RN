import React from "react";
import { Image } from "react-native";

import { colors } from "../theme";

export default class TabIcon extends React.Component {
  render() {
    return (
      <Image
        resizeMode="contain"
        source={this.props.source}
        style={{
          width: "100%",
          height: "100%",
          tintColor: "#fff"
        }}
      />
    );
  }
}
