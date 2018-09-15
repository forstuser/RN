import React, { Component } from "react";
import { View, Image, TouchableOpacity } from "react-native";

import { Text } from "../../elements";
import { defaultStyles } from "../../theme";
import Icon from "react-native-vector-icons/Ionicons";

class SingleSeller extends Component {
  render() {
    const { seller } = this.props;
    let price = <Text weight="Bold">{seller.cashback_total}</Text>;
    let onSelectView = null;
    if (this.props.selectedSeller === seller) {
      onSelectView = (
        <View style={styles.selectedView}>
          <View style={styles.imageIcon2}>
            <Icon name="md-checkmark" size={40} color="#50d102" />
          </View>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={{ flex: 1, flexDirection: "row" }}
          onPress={() => this.props.onSellerPressed(seller)}
        >
          <View style={[styles.box, styles.box1]}>
            <Image style={styles.imageIcon1} source={require("./icon.png")} />
          </View>
          <View style={[styles.box, styles.box2]}>
            <Text weight="Bold" style={styles.info}>
              {seller.name}
            </Text>
          </View>
          <View style={[styles.box, styles.box3]}>
            <Text style={styles.price}>BBCash: {price}</Text>
          </View>
          {onSelectView}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = {
  container: {
    ...defaultStyles.card,
    flex: 1,
    flexDirection: "row",
    borderRadius: 10,
    margin: 10
  },
  box: {
    height: 100
  },
  box1: {
    flex: 2.5
  },
  box2: {
    flex: 4.5,
    marginLeft: 10
  },
  box3: {
    flex: 3
  },
  info: {
    marginTop: 35
  },
  price: {
    textAlign: "right",
    marginRight: 20,
    marginTop: 35,
    fontSize: 14
  },
  imageIcon1: {
    height: 80,
    width: 80,
    marginLeft: 10,
    marginTop: 10
  },
  imageIcon2: {
    padding: 10,
    position: "absolute",
    height: 60,
    width: 60,
    top: 20,
    left: 20,
    borderWidth: 2,
    borderRadius: 50,
    borderColor: "#fff"
  },
  selectedView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,.5)"
  }
};

export default SingleSeller;
