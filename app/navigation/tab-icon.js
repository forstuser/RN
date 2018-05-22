import React from "react";
import { Image } from "react-native";

import { colors } from "../theme";

export default class TabIcon extends React.Component {
  render() {
    return (
      <Image
        source={this.props.source}
        style={{
          width: 25,
          height: 25,
          marginBottom: -3,
          tintColor: this.props.focused ? colors.mainBlue : colors.lighterText
        }}
      />
    );
  }
}
