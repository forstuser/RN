import React, { Component } from "react";
import { View, Image, TouchableOpacity } from "react-native";

import Modal from "../../components/modal";
import { defaultStyles } from "../../theme";
import { Text } from "../../elements";
import { SCREENS } from "../../constants";

class RedeemViaModal extends Component {
  state = {
    isVisible: false
  };

  show = () => {
    this.setState({
      isVisible: true
    });
  };

  hide = () => {
    this.setState({
      isVisible: false
    });
  };

  closeModal = () => {
    this.setState({
      isVisible: false
    });
  };

  onSellerPressed = () => {
    this.hide();
    this.props.navigation.navigate(SCREENS.SELECT_SELLER_SCREEN_WALLET);
  };

  onPaytmPressed = () => {
    this.hide();
    this.props.navigation.navigate(SCREENS.REDEEM_VIA_PAYTM_SCREEN, {
      totalCashback: this.props.totalCashback
    });
  };

  render() {
    return (
      <Modal
        isVisible={this.state.isVisible}
        title="Redeem Via"
        style={{
          ...defaultStyles.card,
          height: 300
        }}
        onClosePress={this.closeModal}
      >
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={[styles.box, styles.box1]}>
            <TouchableOpacity onPress={this.onPaytmPressed}>
              <Image
                style={styles.paytmIcon}
                source={require("./paytm.png")}
                resizeMode="contain"
              />
              <Text style={styles.iconHeading1}>Paytm*</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.box, styles.box2]}>
            <TouchableOpacity onPress={this.onSellerPressed}>
              <Image
                style={styles.sellerIcon}
                source={require("./seller.png")}
                resizeMode="contain"
              />
              <Text style={styles.iconHeading2}>Seller</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.heading}>
          *if you claim cashback through Paytm, 2% will be deducted
        </Text>
      </Modal>
    );
  }
}

const styles = {
  mainBox: {
    flex: 1
  },
  box1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  box2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  paytmIcon: {
    height: 75,
    width: 75
  },
  sellerIcon: {
    height: 75,
    width: 75
  },
  iconHeading1: {
    fontSize: 16,
    marginTop: 15,
    marginLeft: 15
  },
  iconHeading2: {
    fontSize: 16,
    marginTop: 15,
    marginLeft: 20
  },
  heading: {
    fontSize: 10,
    marginLeft: 10,
    marginBottom: 10
  }
};

export default RedeemViaModal;
