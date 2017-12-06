import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Linking
} from "react-native";
import moment from "moment";
import call from "react-native-phone-call";
import { ActionSheetCustom as ActionSheet } from "react-native-actionsheet";

import { Text, Button, ScreenContainer } from "../../elements";

import { colors } from "../../theme";
import KeyValueItem from "../../components/key-value-item";

class AfterSaleButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emails: [],
      phoneNumbers: []
    };
  }

  componentDidMount() {
    const emails = [];
    const phoneNumbers = [];
    if (!this.props.product.brand) {
      return;
    }
    this.props.product.brand.details.forEach(item => {
      switch (item.typeId) {
        case 2:
          emails.push(item.details);
          break;
        case 3:
          phoneNumbers.push(item.details);
          break;
        default:
      }
    });

    this.setState({
      emails,
      phoneNumbers
    });
  }

  handleOptionPress = index => {
    switch (index) {
      case 0:
        this.emailOptions.show();
        break;
      case 1:
        this.phoneOptions.show();
    }
  };

  handleEmailPress = index => {
    if (index < this.state.emails.length) {
      const url = `mailto:${this.state.emails[index]}`;
      Linking.canOpenURL(url)
        .then(supported => {
          if (!supported) {
            Alert.alert("Can't open this email");
          } else {
            return Linking.openURL(url);
          }
        })
        .catch(e => Alert.alert(e.message));
    }
  };

  handlePhonePress = index => {
    if (index < this.state.phoneNumbers.length) {
      call({ number: this.state.phoneNumbers[index] }).catch(e =>
        Alert.alert(e.message)
      );
    }
  };

  render() {
    const { product } = this.props;
    return (
      <View>
        <Button
          onPress={() => {
            this.afterSaleOptions.show();
          }}
          color="secondary"
          text="CONTACT AFTER SALES"
        />
        <ActionSheet
          onPress={this.handleOptionPress}
          ref={o => (this.afterSaleOptions = o)}
          title="Choose an option"
          cancelButtonIndex={4}
          options={[
            "Email Manufacturer",
            "Call Manufacturer",
            "Service Request",
            "Nearest Authorised Service center",
            "Cancel"
          ]}
        />
        <ActionSheet
          onPress={this.handleEmailPress}
          ref={o => (this.emailOptions = o)}
          title="Select Email"
          cancelButtonIndex={this.state.emails.length}
          options={[...this.state.emails, "Cancel"]}
        />
        <ActionSheet
          onPress={this.handlePhonePress}
          ref={o => (this.phoneOptions = o)}
          title="Select Phone number"
          cancelButtonIndex={this.state.phoneNumbers.length}
          options={[...this.state.phoneNumbers, "Cancel"]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({});

export default AfterSaleButton;
