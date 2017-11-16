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

import { connect } from "react-redux";

import { consumerValidate } from "../api";
import LoadingOverlay from "../components/loading-overlay";
import { openAppScreen } from "../navigation";
import { actions as loggedInUserActions } from "../modules/logged-in-user";

class VerifyScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: "",
      isVerifyingOtp: false
    };
  }
  componentDidMount() {
    this.props.navigator.setTitle({
      title: "Verify"
    });
  }

  onSubmitOtp = async () => {
    if (this.state.otp.length != 6) {
      return Alert.alert("Please enter 6 digit OTP you received on your phone");
    }
    try {
      this.setState({
        isVerifyingOtp: true
      });
      const r = await consumerValidate(this.props.phoneNumber, this.state.otp);
      this.props.setLoggedInUserAuthToken(r.authorization);
      openAppScreen();
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
          onChangeText={otp => this.setState({ otp })}
          value={this.state.otp}
          keyboardType="phone-pad"
          placeholder="Enter OTP"
        />
        <Button onPress={this.onSubmitOtp} title="Submit" color="#841584" />
        {this.state.isVerifyingOtp && <LoadingOverlay />}
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setLoggedInUserAuthToken: token => {
      dispatch(loggedInUserActions.setLoggedInUserAuthToken(token));
    }
  };
};

export default connect(null, mapDispatchToProps)(VerifyScreen);
