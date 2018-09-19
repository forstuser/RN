import React from "react";
import { View, Image } from "react-native";
import Modal from "react-native-modal";

import { Text, Button } from "../../elements";
import { SCREENS } from "../../constants";
const tick = require("../../images/tick.png");

export default class SuccessModal extends React.Component {
  state = {
    isVisible: false
  };

  show = () => {
    this.setState({ isVisible: true });
  };

  onOkayPress = () => {
    const { navigation } = this.props;
    this.setState({ isVisible: false }, () => {
      navigation.navigate(SCREENS.CASHBACK_BILLS_SCREEN);
    });
  };

  render() {
    const { isVisible } = this.state;
    return (
      <Modal useNativeDriver={true} isVisible={isVisible}>
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
            Thank you for submitting your Cashback Claim
          </Text>
          <Text
            weight="Medium"
            style={{ fontSize: 13, textAlign: "center", marginVertical: 20 }}
          >
            You will receive notification once the verification process is
            complete.
          </Text>
          <Button
            onPress={this.onOkayPress}
            style={{ width: 150, height: 40 }}
            text="Okay"
            color="secondary"
          />
        </View>
      </Modal>
    );
  }
}
