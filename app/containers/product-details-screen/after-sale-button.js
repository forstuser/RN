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

import { showSnackbar } from "../../containers/snackbar";

class AfterSaleButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emails: [],
      phoneNumbers: [],
      urls: []
    };
  }

  componentDidMount() {
    const urls = [];
    const emails = [];
    const phoneNumbers = [];
    if (!this.props.product.brand) {
      return;
    }
    this.props.product.brand.details.forEach(item => {
      switch (item.typeId) {
        case 1:
          urls.push(item.details);
          break;
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
      urls,
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
        break;
      case 2:
        if (this.state.urls.length == 1) {
          this.openUrl(this.state.urls[0]);
        } else {
          this.urlOptions.show();
        }
        break;
      case 3:
        const { product } = this.props;
        if (!product.brand) {
          return showSnackbar({
            text: `Product brand not available. Please upload your bill if you haven't`
          });
        }
        navigator.geolocation.getCurrentPosition(
          position => {
            this.props.navigator.push({
              screen: "AscSearchScreen",
              passProps: {
                brand: {
                  id: product.brand.id,
                  brandName: product.brand.name
                },
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
    const { product } = this.props;
    if (index < this.state.emails.length) {
      const url = `mailto:${
        this.state.emails[index]
      }?subject=Service Request for ${product.categoryName}&body=Dear ${
        product.brand.name
      } Team,\n\nMy Product Details are:\n${
        product.categoryName
      }\nPurchase Date: ${moment(product.purchaseDate).format(
        "DD MMM YYYY"
      )}\nThe issue with my product is:\n\n\nThanks,\n\n\nPowered by BinBill`;
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

  handleUrlPress = index => {
    if (index < this.state.urls.length) {
      const url = this.state.urls[index];
      this.openUrl(url);
    }
  };

  openUrl = url => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert("Don't know how to open URI: " + url);
      }
    });
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
          cancelButtonIndex={4}
          options={[
            I18n.t("product_details_screen_after_sale_options_email"),
            I18n.t("product_details_screen_after_sale_options_call"),
            I18n.t("product_details_screen_after_sale_options_service"),
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
            this.state.phoneNumbers.length > 0
              ? "Select a phone number"
              : "Phone Number Not Available"
          }
          cancelButtonIndex={this.state.phoneNumbers.length}
          options={[...this.state.phoneNumbers, "Cancel"]}
        />
        <ActionSheet
          onPress={this.handleUrlPress}
          ref={o => (this.urlOptions = o)}
          title={
            this.state.urls.length > 0
              ? "Select an address"
              : "No Link Available"
          }
          cancelButtonIndex={this.state.urls.length}
          options={[...this.state.urls, "Cancel"]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({});

export default AfterSaleButton;
