import React from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image
} from "react-native";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";

import LoadingOverlay from "../../components/loading-overlay";

import { Text, Button } from "../../elements";
import { getCashbackTransactions } from "../../api";
import { defaultStyles, colors } from "../../theme";
const tick = require("../../images/tick.png");

export default class CashbackQueryAdditionalInfoScreen extends React.Component {
  static navigationOptions = {
    title: "Additional Information"
  };

  state = {
    additionalInfo: "",
    isLoading: false,
    isSuccessModalVisible: false
  };

  submit = () => {
    const { navigation } = this.props;
    const selectedTransaction = navigation.state.params.selectedTransaction;
    const selectedReason = navigation.state.params.selectedReason;
    const additionalInfo = this.state.additionalInfo;

    this.setState({ isSuccessModalVisible: true });
  };

  onOkayPress = () => {
    const { navigation } = this.props;
    this.setState({ isSuccessModalVisible: false }, () => {
      navigation.popToTop();
    });
  };

  render() {
    const { additionalInfo, isLoading, isSuccessModalVisible } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ padding: 16, flex: 1 }}>
          <Text weight="Medium" style={{ padding: 11 }}>
          Do you want to add any remarks?

          </Text>
          <TextInput
            style={{
              height: 155,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#cfcfcf",
              marginTop: 5,
              textAlignVertical: "top",
              padding: 15
            }}
            placeholder="Write here..."
            underlineColorAndroid={"transparent"}
            value={additionalInfo}
            multiline
            onChangeText={additionalInfo => this.setState({ additionalInfo })}
          />
        </View>
        <Button
          onPress={this.submit}
          text="Submit"
          color="secondary"
          borderRadius={0}
        />
        <LoadingOverlay visible={isLoading} />
        <Modal useNativeDriver={true} isVisible={isSuccessModalVisible}>
          <View
            collapsable={false}
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              paddingVertical: 20,
              paddingHorizontal: 10,
              justifyContent: "center",
              alignItems: "center",
              width: 300,
              alignSelf: "center"
            }}
          >
            <Image
              style={{
                width: 90,
                height: 90
              }}
              source={tick}
              resizeMode="contain"
            />
            <Text
              weight="Bold"
              style={{ fontSize: 15, textAlign: "center", marginTop: 20 }}
            >
              Thank you for submitting your query.
            </Text>
            <Text
              weight="Medium"
              style={{ fontSize: 13, textAlign: "center", marginVertical: 20 }}
            >
              We will get back to you shortly.
            </Text>
            <Button
              onPress={this.onOkayPress}
              style={{ width: 150, height: 40 }}
              text="Okay"
              color="secondary"
            />
          </View>
        </Modal>
      </View>
    );
  }
}
