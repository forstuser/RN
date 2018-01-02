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
import I18n from "../../i18n";
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
      case 2:
        const { product } = this.props;
        navigator.geolocation.getCurrentPosition(
          position => {
            this.props.navigator.push({
              screen: "AscSearchScreen",
              passProps: {
                brand: product.brand,
                category: {
                  category_id: product.categoryId,
                  category_name: product.categoryName
                },
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }
            });
          },
          error => Alert.alert(error.message),
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
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
          text={I18n.t("product_details_screen_after_sale_btn")}
        />
        <ActionSheet
          onPress={this.handleOptionPress}
          ref={o => (this.afterSaleOptions = o)}
          title={I18n.t("product_details_screen_after_sale_options_title")}
          cancelButtonIndex={3}
          options={[
            I18n.t("product_details_screen_after_sale_options_email"),
            I18n.t("product_details_screen_after_sale_options_call"),
            I18n.t("product_details_screen_after_sale_options_asc"),
            I18n.t("product_details_screen_after_sale_options_cancel")
          ]}
        />
        <ActionSheet
          onPress={this.handleEmailPress}
          ref={o => (this.emailOptions = o)}
          title={
            this.state.emails.length > 0
              ? "Select Email"
              : "Email Not Available"
          }
          cancelButtonIndex={this.state.emails.length}
          options={[...this.state.emails, "Cancel"]}
        />
        <ActionSheet
          onPress={this.handlePhonePress}
          ref={o => (this.phoneOptions = o)}
          title={
            this.state.emails.phoneNumbers > 0
              ? "Select a phone number"
              : "Phone Number Not Available"
          }
          cancelButtonIndex={this.state.phoneNumbers.length}
          options={[...this.state.phoneNumbers, "Cancel"]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({});

export default AfterSaleButton;
