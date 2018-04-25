import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Platform
} from "react-native";
import { Text, Button } from "../elements";
import Modal from "react-native-modal";
import { colors } from "../theme";
import Icon from "react-native-vector-icons/Ionicons";
import { API_BASE_URL, addUserCreatedMeals } from "../api";
import { SCREENS } from "../constants";
import CustomTextInput from "./form-elements/text-input";
import { showSnackbar } from "../containers/snackbar";
import LoadingOverlay from "./loading-overlay";
const tick = require("../images/tick.png");

class WhatToListModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      list: [""],
      isLoading: false
    };
  }

  show = () => {
    this.setState({ visible: true });
  };

  hide = () => {
    this.setState({
      visible: false
    });
  };

  addRow = () => {
    this.setState({
      list: [...this.state.list, ""]
    });
  };

  textChange = (text, index) => {
    const newList = [...this.state.list];
    newList[index] = text;
    this.setState({
      list: newList
    });
  };

  onSaveBtn = async () => {
    this.setState({
      isLoading: true
    });
    try {
      const res = await addUserCreatedMeals({
        meals: this.state.list.filter(item => item && item.trim().length > 0),
        stateId: this.props.stateId
      });
      this.props.addItems(res.mealList);
      this.setState({ visible: false, list: [""] });
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({
        isLoading: false
      });
    }
  };

  render() {
    const { list, visible, isLoading } = this.state;
    const { navigator } = this.props;
    return (
      <Modal
        isVisible={visible}
        onBackButtonPress={this.hide}
        avoidKeyboard={Platform.OS == "ios"}
      >
        <View style={styles.finishModal}>
          <TouchableOpacity style={styles.closeIcon} onPress={this.hide}>
            <Icon name="md-close" size={30} color={colors.mainText} />
          </TouchableOpacity>
          <View style={{ marginTop: 30 }}>
            {this.state.list.map((item, index) => (
              <CustomTextInput
                placeholder="Enter Item Name"
                underlineColorAndroid="transparent"
                value={item}
                onChangeText={text => this.textChange(text, index)}
              />
            ))}
          </View>
          <TouchableOpacity onPress={this.addRow}>
            <Text
              weight="Medium"
              style={{
                marginBottom: 25,
                color: "#ff732e"
              }}
            >
              Add more
            </Text>
          </TouchableOpacity>
          <Button
            onPress={this.onSaveBtn}
            style={styles.finishBtn}
            text="SAVE"
            color="secondary"
          />
          <LoadingOverlay visible={isLoading} />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  finishModal: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    justifyContent: "center",
    width: 300,
    alignSelf: "center"
  },
  closeIcon: {
    position: "absolute",
    right: 10,
    top: 10,
    backgroundColor: "transparent"
  },
  text: {
    textAlign: "left"
  },
  finishBtn: {
    width: 120,
    height: 40,
    alignSelf: "center"
  }
});

export default WhatToListModal;
