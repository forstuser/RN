import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { Text, Button, ScreenContainer } from "../../elements";
import { colors } from "../../theme";
import CheckBox from "../../components/checkbox";
import DatePicker from "../../elements/date-picker";
import TextInput from "../../elements/text-input";

import Camera from "./camera";
import ChecklistModal from "./checklist-modal";

export default class ClaimCashback extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const isCameraOpen = navigation.getParam("isCameraOpen", false);
    return {
      title: isCameraOpen ? "Take Your Bill Picture" : "Claim Cashback"
    };
  };

  state = {
    isCameraOpen: true,
    isChecklistModalVisible: false,
    images: []
  };

  componentDidMount() {
    this.props.navigation.setParams({ isCameraOpen: true });
  }

  openCamera = () => {
    this.setState({ isCameraOpen: true });
    this.props.navigation.setParams({ isCameraOpen: true });
  };

  pushImageToState = imageUri => {
    const images = [...this.state.images];
    images.push(imageUri);
    this.setState({ images });
  };

  onCaptureImage = imageUri => {
    this.pushImageToState(imageUri);
    this.setState({ isCameraOpen: false });
    this.props.navigation.setParams({ isCameraOpen: false });
  };

  hideOverCameraChecklist = () => {
    this.setState({ showChecklistOverCamera: false });
  };

  hideChecklistModal = () => {
    this.setState({ isChecklistModalVisible: false });
  };

  render() {
    const { isCameraOpen, isChecklistModalVisible, images } = this.state;
    return (
      <ScreenContainer style={{ padding: 0, backgroundColor: "#fff" }}>
        {isCameraOpen ? (
          <Camera onCaptureImage={this.onCaptureImage} />
        ) : (
          <View style={{ padding: 16 }}>
            <View
              style={{
                borderBottomColor: "#c2c2c2",
                borderBottomWidth: 1,
                marginBottom: 15,
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <Text weight="Medium" style={{ color: colors.mainBlue, flex: 1 }}>
                {images.length} Image{images.length > 1 ? "s" : ""}
              </Text>
              <TouchableOpacity
                onPress={this.openCamera}
                style={{
                  width: 30,
                  height: 30,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Icon name="md-add" size={24} color={colors.pinkishOrange} />
              </TouchableOpacity>
            </View>
            <DatePicker placeholder="Date of Purchase" placeholder2="*" />
            <TextInput
              placeholder="Total Amount of Bill"
              keyboardType="numeric"
            />

            <TouchableOpacity
              onPress={() => this.setState({ isChecklistModalVisible: true })}
              style={{ alignSelf: "center", alignItems: "center" }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: "#f1f1f1",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Image
                  style={{ width: 20, height: 26 }}
                  source={require("../../images/checklist_icon.png")}
                />
              </View>
              <Text
                style={{ marginTop: 7, color: colors.mainBlue, fontSize: 10 }}
              >
                View Checklist
              </Text>
            </TouchableOpacity>

            <Button
              text="Next"
              color="secondary"
              style={{
                height: 40,
                width: 140,
                alignSelf: "center",
                marginTop: 20
              }}
            />
          </View>
        )}
        <ChecklistModal
          isChecklistModalVisible={isChecklistModalVisible}
          hideChecklistModal={this.hideChecklistModal}
        />
      </ScreenContainer>
    );
  }
}
