import React, { Component } from "react";
import { View, TouchableOpacity, Picker } from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import { Text } from "../../elements";
import LinearGradient from "react-native-linear-gradient";
import { colors } from "../../theme";

class AddSellerHeader extends Component {
  state = {
    user: null
  };
  componentDidMount() {
    this.setState({ user: this.props.user });
  }
  render() {
    //console.log("User in Add Seller Screen_________", this.props.user);
    return (
      <View style={styles.container}>
        <LinearGradient
          start={{ x: 0.0, y: 0 }}
          end={{ x: 0.0, y: 1 }}
          colors={[colors.mainBlue, colors.aquaBlue]}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        />
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => this.props.navigation.goBack()}
        >
          <Icon name="md-arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
        {/* <Text weight="Bold" style={styles.heading}>
          Search Seller
        </Text> */}
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Picker
            mode="dropdown"
            selectedValue="Gurgaon"
            style={{
              height: 25,
              width: 250,
              borderRadius: 10,
              backgroundColor: "#fff"
            }}
            //   onValueChange={(itemValue, itemIndex) =>
            //     this.setState({ city: itemValue })
            //   }
          >
            {this.state.user.addresses.map(address => (
              <Picker.Item
                label={
                  address.address_line_1
                    ? address.address_line_1
                        .concat(" ")
                        .concat(address.address_line_2)
                    : address.address_line_2
                }
                value={address}
              />
            ))}
          </Picker>
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    height: 50
  },
  backIcon: {
    padding: 10,
    position: "absolute",
    top: 0,
    left: 10,
    zIndex: 2
  },
  heading: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    marginTop: 10
  }
};

export default AddSellerHeader;
