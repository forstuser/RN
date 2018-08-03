import React from "react";
import { View } from "react-native";

import { Text, Button } from "../../elements";
import { colors } from "../../theme";
import CheckBox from "../../components/checkbox";

import Camera from "./camera";

export default class ClaimCashback extends React.Component {
  static navigationOptions = () => {
    return {
      title: "Take Your Bill Picture"
    };
  };

  state = {
    isCameraOpen: true,
    showChecklistOverCamera: true
  };

  hideOverCameraChecklist = () => {
    this.setState({ showChecklistOverCamera: false });
  };

  render() {
    const { isCameraOpen } = this.state;
    return (
      <View style={{ flex: 1 }}>{isCameraOpen ? <Camera /> : <View />}</View>
    );
  }
}
