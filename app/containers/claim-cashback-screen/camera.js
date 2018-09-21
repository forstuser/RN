import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import { RNCamera } from "react-native-camera";
import PhotoView from "react-native-photo-view";

import { Text, Button, Image } from "../../elements";
import { colors } from "../../theme";
import CheckBox from "../../components/checkbox";
import LoadingOverlay from "../../components/loading-overlay";

export default class ClaimCashback extends React.Component {
  state = {
    showChecklistOverCamera: true,
    imageUri: null
  };

  hideOverCameraChecklist = () => {
    this.setState({ showChecklistOverCamera: false });
  };

  takeImage = async function(camera) {
    console.log(camera);
    if (camera) {
      const options = { quality: 0.7 };
      const data = await this.camera.takePictureAsync(options);
      console.log(data);
      this.setState({ imageUri: data.uri });
    }
  };

  render() {
    const { onCaptureImage } = this.props;
    const { showChecklistOverCamera, imageUri } = this.state;
    const checklistPoints = [
      "Printed Bill only",
      "Bill should be clear & readable",
      "One Bill in one Click",
      "Use + Sign to capture a longer Bill",
      "Ensure the Bill is inside the frame"
    ];
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 1
            }}
          >
            {imageUri ? (
              <View style={{ flex: 1 }}>
                <PhotoView
                  style={{ width: "100%", height: "100%" }}
                  source={{ uri: imageUri }}
                />
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    flexDirection: "row",
                    paddingBottom: 10,
                    justifyContent: "center"
                  }}
                >
                  <Button
                    style={{ height: 40, width: 150, marginRight: 30 }}
                    text="Retake"
                    onPress={() => this.setState({ imageUri: null })}
                  />
                  <Button
                    style={{ height: 40, width: 150 }}
                    text="Continue"
                    onPress={() => onCaptureImage(imageUri)}
                  />
                </View>
              </View>
            ) : (
              <RNCamera
                style={{
                  flex: 1,
                  alignItems: "center"
                }}
                ref={ref => {
                  this.camera = ref;
                }}
                type={RNCamera.Constants.Type.back}
                flashMode={RNCamera.Constants.FlashMode.on}
                permissionDialogTitle={"Permission to use camera"}
                permissionDialogMessage={
                  "We need your permission to use your camera phone"
                }
              >
                {({ camera, status }) => {
                  if (status !== "READY")
                    return <LoadingOverlay visible={true} />;
                  return (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        width: "100%"
                      }}
                    >
                      <Button
                        onPress={() => this.takeImage(camera)}
                        style={{ width: "100%" }}
                        borderRadius={0}
                        color="secondary"
                        text="Take Image"
                      />
                    </View>
                  );
                }}
              </RNCamera>
            )}
          </View>
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

const styles = StyleSheet.create({});
