import React, { Component } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  View,
  Button,
  Text,
  TextInput,
  Alert
} from "react-native";
import { consumerGetOtp } from "../api";
import LoadingOverlay from "../components/loading-overlay";

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: "",
      isGettingOtp: false
    };
  }
  componentDidMount() {
    this.props.navigator.setTitle({
      title: "Get Started"
    });
  }

  onSubmitPhoneNumber = async () => {
    if (this.state.phoneNumber.length != 10) {
      return Alert.alert("Please enter 10 digit mobile number");
    }
    try {
      this.setState({
        isGettingOtp: true
      });
      await consumerGetOtp(this.state.phoneNumber);
      this.setState({
        isGettingOtp: false
      });
      this.props.navigator.push({
        screen: "VerifyScreen",
        passProps: {
          phoneNumber: this.state.phoneNumber
        }
      });
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  render() {
    return (
      <View style={{ height: Dimensions.get("window").height, padding: 16 }}>
        <TextInput
          style={{
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            padding: 5
          }}
          onChangeText={phoneNumber => this.setState({ phoneNumber })}
          value={this.state.text}
          keyboardType="phone-pad"
          placeholder="Enter your mobile number"
        />
        <Button
          onPress={this.onSubmitPhoneNumber}
          title="Verify"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
        {this.state.isGettingOtp && <LoadingOverlay />}
      </View>
    );
  }
}

export default LoginScreen;
