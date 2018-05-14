import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView
} from "react-native";
import { Text, Button } from "../elements";
import Modal from "react-native-modal";
import { colors } from "../theme";
import Icon from "react-native-vector-icons/Ionicons";
import { API_BASE_URL, addUserCreatedMeals, addUserCreatedTodos } from "../api";
import { SCREENS, EASY_LIFE_TYPES } from "../constants";
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
    setTimeout(() => {
      if (this["input0"]) {
        this["input0"].focus();
      }
    }, 200);
  };

  hide = () => {
    this.setState({
      visible: false
    });
  };

  addRow = () => {
    this.setState(
      {
        list: [...this.state.list, ""]
      },
      () => {
        const i = this.state.list.length - 1;
        setTimeout(() => {
          if (this[`input${i}`]) {
            this[`input${i}`].focus();
          }
        }, 200);
      }
    );
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
      if (this.props.type == EASY_LIFE_TYPES.WHAT_TO_COOK) {
        const res = await addUserCreatedMeals({
          meals: this.state.list.filter(item => item && item.trim().length > 0),
          stateId: this.props.stateId,
          date: this.props.date
        });

        this.props.addItems(res.mealList);
      } else {
        let names = this.state.list.filter(
          item => item && item.trim().length > 0
        );
        const res = await addUserCreatedTodos({
          names: names,
          date: this.props.date
        });
        this.props.addItems(res.todoList);
      }
      this.setState({ visible: false, list: [""] });
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({
        isLoading: false
      });
    }
  };

  onRemoveBtnPress = index => {
    let list = [...this.state.list];
    list.splice(index, 1);
    this.setState({ list });
  };

  render() {
    const { list, visible, isLoading } = this.state;
    const { navigator, type } = this.props;
    let placeHolderText = "Enter Task Name";
    if (type == EASY_LIFE_TYPES.WHAT_TO_COOK) {
      placeHolderText = "Enter Dish Name";
    }

    if (!visible) return null;
    return (
      <View collapsable={false} >
        {visible && (
          <View collapsable={false} >
            <Modal
              isVisible={true}
              onBackButtonPress={this.hide}
              avoidKeyboard={Platform.OS == "ios"}
            >
              <View collapsable={false}  style={styles.finishModal}>
                <TouchableOpacity style={styles.closeIcon} onPress={this.hide}>
                  <Icon name="md-close" size={30} color={colors.mainText} />
                </TouchableOpacity>
                <ScrollView
                  style={{ marginTop: 30 }}
                  contentContainerStyle={{ padding: 5 }}
                >
                  {this.state.list.map((item, index) => (
                    <View collapsable={false} >
                      <CustomTextInput
                        ref={ref => {
                          this["input" + index] = ref;
                        }}
                        placeholder={placeHolderText}
                        value={item}
                        onChangeText={text => this.textChange(text, index)}
                      />
                      {index > 0 ? (
                        <TouchableOpacity
                          style={styles.removeBtn}
                          onPress={() => this.onRemoveBtnPress(index)}
                        >
                          <Icon name="md-close" color="white" size={20} />
                        </TouchableOpacity>
                      ) : (
                        <View collapsable={false}  />
                      )}
                    </View>
                  ))}
                </ScrollView>
                <TouchableOpacity onPress={this.addRow}>
                  <Text
                    weight="Medium"
                    style={{
                      marginBottom: 25,
                      paddingLeft: 5,
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
          </View>
        )}
      </View>
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
    marginVertical: 40,
    width: "100%",
    maxWidth: 350,
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
  },
  removeBtn: {
    height: 30,
    width: 30,
    position: "absolute",
    top: 8,
    alignItems: "center",
    justifyContent: "center",
    right: 5,
    elevation: 2,
    borderRadius: 15,
    backgroundColor: colors.pinkishOrange
  }
});

export default WhatToListModal;
