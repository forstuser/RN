import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "../../elements";
import { colors } from "../../theme";
import Icon from "react-native-vector-icons/Ionicons";

class AddressView extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { index, address, sellerId, selectedIndex } = this.props;
    return (
      <View style={styles.constainer}>
        <View style={styles.header}>
          {sellerId ? (
            <TouchableOpacity
              onPress={() => {
                this.props.selectAddress(index);
              }}
              style={{
                alignContent: "space-between",
                flexDirection: "row",
                flex: 1,
                paddingLeft: 5,
                alignItems: "center",
                marginVertical: 10
              }}
            >
              <View>
                <TouchableOpacity style={styles.outerCircle}>
                  {selectedIndex == index ? (
                    <View style={styles.innerCircle} />
                  ) : null}
                </TouchableOpacity>
              </View>
              <View
                style={{ paddingRight: 20, paddingBottom: 0, paddingLeft: 15 }}
              >
                <Text style={{ fontSize: 14 }}>
                  {address.address_line_1} {address.address_line_2}{" "}
                  {address.locality_name} {address.city_name}{" "}
                  {address.state_name} {address.pin}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View>
              <Text style={styles.address}> Address {index + 1}</Text>
            </View>
          )}

          {!sellerId ? (
            <View style={{ flexDirection: "row" }}>
              {address.address_type == 1 ? (
                <View style={{ right: 5 }}>
                  <Text style={styles.default}>Default</Text>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    this.props.setDefault(index);
                  }}
                  style={{ right: 5 }}
                >
                  <Text style={styles.setDefault}>Set Default</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => {
                  this.props.updateAddress(index);
                }}
                style={{ marginLeft: 12 }}
              >
                <Text>
                  <Icon
                    name="ios-create-outline"
                    size={20}
                    color={colors.pinkishOrange}
                  />
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.deleteAddressModel(index);
                }}
                style={{ marginLeft: 12 }}
              >
                <Text>
                  <Icon
                    name="ios-trash-outline"
                    size={20}
                    color={colors.pinkishOrange}
                  />
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
        {!sellerId ? (
          <View style={{ marginBottom: 25, marginLeft: 10, width: 250 }}>
            <Text style={{ fontSize: 14 }}>
              {address.address_line_1} {address.address_line_2}{" "}
              {address.locality_name} {address.city_name} {address.state_name}{" "}
              {address.pin}
            </Text>
          </View>
        ) : null}
      </View>
    );
  }
}
const styles = {
  constainer: {
    backgroundColor: "#fff"
    // flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  address: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.mainText
  },
  default: {
    color: colors.secondaryText,
    textDecorationLine: "underline",
    fontSize: 12
  },
  setDefault: {
    color: colors.pinkishOrange,
    textDecorationLine: "underline",
    fontSize: 12
  },
  outerCircle: {
    alignItems: "center",
    justifyContent: "center",
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderColor: "black",
    borderWidth: 1
  },
  innerCircle: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: colors.pinkishOrange,
    borderColor: colors.pinkishOrange,
    borderWidth: 1
  }
};

export default AddressView;
