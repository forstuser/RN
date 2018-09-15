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
    timeElapsed: "",
    totalAmount: ""
  };

  show = ({
    basePrice,
    hourlyPrice,
    startTime,
    endTime,
    timeElapsed,
    totalAmount
  }) => {
    this.setState({
      isVisible: true,
      basePrice,
      hourlyPrice,
      startTime,
      endTime,
      timeElapsed,
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
      timeElapsed,
      totalAmount
    } = this.state;

    const timeElapsedInHours = moment(endTime).diff(startTime, "hours");

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
            {`a. Fixed Charge (1 Hr : Rs. ${basePrice})\n\nb. Variable Charge (${timeElapsed} : ${hourlyPrice} INR) = ${hourlyPrice}x${timeElapsedInHours}=${hourlyPrice *
              timeElapsedInHours}\n\nc. Total (a + b) = ${totalAmount}`}
          </Text>
        </View>
      </Modal>
    );
  }
}
