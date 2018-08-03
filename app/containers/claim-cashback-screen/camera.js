import React from "react";
import { View } from "react-native";

import { RNCamera } from "react-native-camera/types";

import { Text, Button } from "../../elements";
import { colors } from "../../theme";
import CheckBox from "../../components/checkbox";

export default class ClaimCashback extends React.Component {
  static navigationOptions = () => {
    return {
      title: "Take Your Bill Picture"
    };
  };

  state = {
    isCameraOpen: false,
    showChecklistOverCamera: true
  };

  hideOverCameraChecklist = () => {
    this.setState({ showChecklistOverCamera: false });
  };

  render() {
    const { showChecklistOverCamera } = this.state;
    const checklistPoints = [
      "Printed Bill only",
      "Bill should be clear & readable",
      "One Bill in one Click",
      "Use + Sign to capture a longer Bill",
      "Capture Bill inside Red Box"
    ];
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <RNCamera
            style={{
              flex: 1,
              alignItems: "center"
            }}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.on}
            permissionDialogTitle={"Permission to use camera"}
            permissionDialogMessage={
              "We need your permission to use your camera phone"
            }
          />
          {showChecklistOverCamera ? (
            <View
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: "rgba(0,0,0,0.6)",
                flex: 1
              }}
            >
              <View style={{ flex: 1, padding: 10 }}>
                {checklistPoints.map((checklistPoint, index) => (
                  <View key={checklistPoint} style={{ flexDirection: "row" }}>
                    <View
                      style={{
                        backgroundColor: colors.success,
                        height: 20,
                        width: 20,
                        borderRadius: 10,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 10,
                        marginBottom: 8
                      }}
                    >
                      <Text style={{ color: "#fff" }}>{index + 1}</Text>
                    </View>
                    <Text style={{ color: "#fff" }}>{checklistPoint}</Text>
                  </View>
                ))}
              </View>
              <View style={{ flexDirection: "row", padding: 10 }}>
                <CheckBox />
                <Text style={{ color: "#fff", marginLeft: 10 }}>
                  Don’t show this message again
                </Text>
              </View>
              <Button
                onPress={this.hideOverCameraChecklist}
                style={{ width: "100%" }}
                borderRadius={0}
                color="secondary"
                text="Ok"
              />
            </View>
          ) : (
            <View />
          )}
        </View>
      </View>
    );
  }
}
