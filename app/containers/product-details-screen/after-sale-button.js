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
import { SCREENS } from "../../constants";

class AfterSaleButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseOptions: [],
      emails: [],
      phoneNumbers: [],
      urls: [],
      activeType: "Manufacturer"
    };
  }

  componentDidMount() {
    const { brand, insuranceDetails, warrantyDetails } = this.props.product;
    const baseOptions = [];
    if (this.props.product.brand) {
      baseOptions.push({ type: "brand", text: "Contact Manufacturer" });
    }

    if (insuranceDetails.length > 0 && insuranceDetails[0].provider) {
      baseOptions.push({
        type: "insurance",
        text: "Contact Insurance Provider"
      });
    }

    if (warrantyDetails.length > 0 && warrantyDetails[0].provider) {
      baseOptions.push({
        type: "warranty",
        text: "Contact Warranty Provider"
      });
    }

    if (this.props.product.serviceCenterUrl) {
      baseOptions.push({
        type: "asc",
        text: "Nearest Authorised Service center"
      });
    }

    this.setState({ baseOptions });
  }

  showBaseOptions = () => {
    if (this.state.baseOptions.length > 0) {
      this.baseOptions.show();
    } else {
      Alert.alert(
        "Customer care is available for only brand/manufacturer, insurance provider and third party warranty providers"
      );
    }
  };

  handleBaseOptionPress = index => {
    const { brand, insuranceDetails, warrantyDetails } = this.props.product;
    const option = this.state.baseOptions[index];
    if (option) {
      switch (option.type) {
        case "brand":
          this.showBrandOptions();
          break;
        case "insurance":
          this.showInsuranceOrWarranty(
            insuranceDetails[0].provider,
            "Insurance Provider"
          );
          break;
        case "warranty":
          this.showInsuranceOrWarranty(
            warrantyDetails[0].provider,
            "Warranty Provider"
          );
          break;
        case "asc":
          return this.openAscScreen();
      }
      this.contactOptions.show();
    }
  };

  openAscScreen = () => {
    const { product } = this.props;
    if (!product.brand) {
      return showSnackbar({
        text: `Product brand not available. Please upload your bill if you haven't`
      });
    }
    navigator.geolocation.getCurrentPosition(
      position => {
        this.props.navigator.push({
          screen: SCREENS.ASC_SEARCH_SCREEN,
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
  };

  showBrandOptions = () => {
    const { brand } = this.props.product;
    let urls = [],
      emails = [],
      phoneNumbers = [];

    brand.details.forEach(item => {
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
      }
    });

    this.setState({
      urls,
      emails,
      phoneNumbers,
      activeType: "Manufacturer"
    });
  };

  showInsuranceOrWarranty = (provider, type) => {
    let urls = [],
      emails = [],
      phoneNumbers = [];

    if (provider.contact) {
      phoneNumbers = provider.contact
        .split(/\\/)
        .filter(number => number.length > 0);
    }

    if (provider.email) {
      emails = provider.email.split(/\\/).filter(email => email.length > 0);
    }

    if (provider.url) {
      urls = provider.url.split(/\\/).filter(url => url.length > 0);
    }

    this.setState({
      urls,
      emails,
      phoneNumbers,
      activeType: type
    });
  };

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
    }
  };

  handleEmailPress = index => {
    const { product } = this.props;
    let purchaseDate = moment(product.purchaseDate).isValid()
      ? moment(product.purchaseDate).format("DD MMM YYYY")
      : "N/A";
    let modelName = "NA";
    let modelNo = "NA";
    let type = "NA";
    let serialNo = "NA";

    if (product.metaData) {
      const metaData = product.metaData;
      const keys = Object.keys(metaData);
      const modelNameKey = keys.find(
        key => key.toLowerCase().indexOf("model name") > -1
      );
      if (modelNameKey) {
        modelName = metaData[modelNameKey];
      }
      const modelNoKey = keys.find(
        key => key.toLowerCase().indexOf("model number") > -1
      );
      if (modelNoKey) {
        modelNo = metaData[modelNoKey];
      }
      const typeKey = keys.find(key => key.toLowerCase().indexOf("type") > -1);
      if (typeKey) {
        type = metaData[typeKey];
      }
      const serialNoKey = keys.find(
        key => key.toLowerCase().indexOf("serial") > -1
      );
      if (serialNoKey) {
        serialNo = metaData[serialNoKey];
      }
    }

    if (index < this.state.emails.length) {
      const url = `mailto:${
        this.state.emails[index]
      }?subject=Service Request for ${product.productName}&body=Dear ${
        product.brand.name
      } Team,\n\nMy Product Details are:\n${
        product.categoryName
      }\nModel Name: ${modelName}\nModel No: ${modelNo}\nSerial No: ${serialNo}\nType: ${type}\nPurchase Date: ${purchaseDate}
      \nThe issue with my product is:\n\n\nThanks,\n\n\nPowered by BinBill`;
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
      //remove anything between ()
      const phoneNumber = (this.state.phoneNumbers[index] + "(Toll free)")
        .replace(/\(.+\)/, "")
        .trim();
      call({ number: phoneNumber }).catch(e => Alert.alert(e.message));
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
    const { baseOptions, urls, emails, phoneNumbers, activeType } = this.state;

    return (
      <View>
        <Button
          onPress={this.showBaseOptions}
          color="secondary"
          text={I18n.t("product_details_screen_after_sale_btn")}
        />
        <ActionSheet
          onPress={this.handleBaseOptionPress}
          ref={o => (this.baseOptions = o)}
          title={I18n.t("product_details_screen_after_sale_options_title")}
          cancelButtonIndex={baseOptions.length}
          options={[...baseOptions.map(option => option.text), "Cancel"]}
        />
        <ActionSheet
          onPress={this.handleOptionPress}
          ref={o => (this.contactOptions = o)}
          title={`Contact ${activeType}`}
          cancelButtonIndex={4}
          options={[
            `Email ${activeType}`,
            `Call ${activeType}`,
            `Service Request/Repair`
          ]}
        />
        <ActionSheet
          onPress={this.handleEmailPress}
          ref={o => (this.emailOptions = o)}
          title={emails.length > 0 ? "Select Email" : "Email Not Available"}
          cancelButtonIndex={emails.length}
          options={[...emails, "Cancel"]}
        />
        <ActionSheet
          onPress={this.handlePhonePress}
          ref={o => (this.phoneOptions = o)}
          title={
            phoneNumbers.length > 0
              ? "Select a phone number"
              : "Phone Number Not Available"
          }
          cancelButtonIndex={phoneNumbers.length}
          options={[...phoneNumbers, "Cancel"]}
        />
        <ActionSheet
          onPress={this.handleUrlPress}
          ref={o => (this.urlOptions = o)}
          title={urls.length > 0 ? "Select an address" : "No Link Available"}
          cancelButtonIndex={this.state.urls.length}
          options={[
            ...urls.map(url => (
              <View>
                <Text weight="Bold" style={{ color: colors.mainBlue }}>
                  {url}
                </Text>
              </View>
            )),
            "Cancel"
          ]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({});

export default AfterSaleButton;
