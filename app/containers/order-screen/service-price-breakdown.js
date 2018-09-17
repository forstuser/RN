import React from "react";
import { View } from "react-native";
import moment from "moment";

import { Text } from "../../elements";

import Modal from "../../components/modal";

export default class ServicePriceBreakdownModal extends React.Component {
  state = {
    isVisible: false,
    basePrice: 0,
    hourlyPrice: 0,
    startTime: "",
    endTime: "",
    timeElapsedInMinutes: "",
    totalAmount: ""
  };

  show = ({
    basePrice,
    hourlyPrice,
    startTime,
    endTime,
    timeElapsedInMinutes,
    totalAmount
  }) => {
    this.setState({
      isVisible: true,
      basePrice,
      hourlyPrice,
      startTime,
      endTime,
      timeElapsedInMinutes,
      totalAmount
    });
  };

  hide = () => {
    this.setState({ isVisible: false });
  };

  render() {
    const {
      isVisible,
      basePrice,
      hourlyPrice,
      startTime,
      endTime,
      timeElapsedInMinutes,
      totalAmount
    } = this.state;

    let timeElapsedInHalfHours = 0;

    if (timeElapsedInMinutes > 60) {
      timeElapsedInHalfHours = Math.ceil((timeElapsedInMinutes - 60) / 30);
    }

    return (
      <Modal
        isVisible={isVisible}
        title="Pricing"
        style={{ height: 200, backgroundColor: "#fff" }}
        onClosePress={this.hide}
        onBackButtonPress={this.hide}
        onBackdropPress={this.hide}
      >
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text>
            {`a. Fixed Charge (1 Hr : Rs. ${basePrice})\n\nb. Variable Charge (${timeElapsedInHalfHours} : ${hourlyPrice} INR) = ${hourlyPrice}x${timeElapsedInHalfHours}=${hourlyPrice *
              timeElapsedInHalfHours}\n\nc. Total (a + b) = ${totalAmount}`}
          </Text>
        </View>
      </Modal>
    );
  }
}
