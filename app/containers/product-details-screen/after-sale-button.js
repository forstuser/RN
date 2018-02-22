import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Linking
} from "react-native";
import RNGooglePlaces from "react-native-google-places";

import Analytics from "../../analytics";

import moment from "moment";
import call from "react-native-phone-call";
import { connect } from "react-redux";
import { ActionSheetCustom as ActionSheet } from "react-native-actionsheet";
import I18n from "../../i18n";
import { Text, Button, ScreenContainer } from "../../elements";

import { colors } from "../../theme";
import KeyValueItem from "../../components/key-value-item";

import { showSnackbar } from "../../containers/snackbar";
import {
  SCREENS,
  MAIN_CATEGORY_IDS,
  CATEGORY_IDS,
  METADATA_KEYS
} from "../../constants";

import { getMetaValueByKey } from "../../utils";

class AfterSaleButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseOptions: [],
      emails: [],
      phoneNumbers: [],
      urls: [],
      activeType: "brand"
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

    if (this.props.product.serviceCenterUrl && this.props.product.brand) {
      baseOptions.push({
        type: "asc",
        text: "Nearest Authorised Service center"
      });
    }

    this.setState({ baseOptions });
  }

  showBaseOptions = () => {
    Analytics.logEvent(Analytics.EVENTS.CLICK_CONTACT_AFTER_SALES);
    if (this.state.baseOptions.length > 0) {
      this.baseOptions.show();
    } else {
      Alert.alert(
        "Customer care is available for brand/manufacturer, insurance and third party warranty providers only."
      );
    }
  };

  handleBaseOptionPress = index => {
    const { brand, insuranceDetails, warrantyDetails } = this.props.product;
    const option = this.state.baseOptions[index];
    if (option) {
      switch (option.type) {
        case "brand":
          Analytics.logEvent(Analytics.EVENTS.CLICK_CONTACT_BRAND);
          this.showBrandOptions();
          break;
        case "insurance":
          Analytics.logEvent(Analytics.EVENTS.CLICK_CONTACT_INSURANCE_PROVIDER);
          this.showInsuranceOrWarranty(
            insuranceDetails[0].provider,
            "insurance"
          );
          break;
        case "warranty":
          Analytics.logEvent(Analytics.EVENTS.CLICK_CONTACT_WARRANTY_PROVIDER);
          this.showInsuranceOrWarranty(warrantyDetails[0].provider, "warranty");
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

    RNGooglePlaces.openPlacePickerModal()
      .then(place => {
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
            latitude: place.latitude,
            longitude: place.longitude
          }
        });
      })
      .catch(error => console.log(error.message));
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
      activeType: "brand"
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
          Analytics.logEvent(Analytics.EVENTS.CLICK_URL);
          this.openUrl(this.state.urls[0]);
        } else {
          this.urlOptions.show();
        }
        break;
    }
  };

  handleEmailPress = index => {
    Analytics.logEvent(Analytics.EVENTS.CLICK_EMAIL);
    const { product, loggedInUser } = this.props;
    const { activeType } = this.state;
    const userName = loggedInUser.name || "";

    let subject = `Issue with ${product.brand ? product.brand.name : ""} ${
      product.categoryName
    }`;

    let brandNameToAddress = product.brand ? product.brand.name : "";

    let productDetails = {
      brandCategory:
        (product.brand ? product.brand.name + " " : "") + product.categoryName,
      purchaseDate: moment(product.purchaseDate).isValid()
        ? moment(product.purchaseDate).format("DD MMM YYYY")
        : "NA",
      modelName:
        getMetaValueByKey(product.metaData, METADATA_KEYS.MODEL_NAME) || "NA",
      modelNumber:
        getMetaValueByKey(product.metaData, METADATA_KEYS.MODEL_NUMBER) || "NA",
      type: getMetaValueByKey(product.metaData, METADATA_KEYS.TYPE) || "NA",
      vin: getMetaValueByKey(product.metaData, METADATA_KEYS.VIN) || "NA",
      registrationNumber:
        getMetaValueByKey(
          product.metaData,
          METADATA_KEYS.REGISTRATION_NUMBER
        ) || "NA",
      imeiNumber:
        getMetaValueByKey(product.metaData, METADATA_KEYS.IMEI_NUMBER) || "NA",
      serialNumber:
        getMetaValueByKey(product.metaData, METADATA_KEYS.SERIAL_NUMBER) ||
        "NA",
      insurancePolicyNo: "NA",
      insuranceProviderName: "NA",
      insuranceEffectiveDate: "NA"
    };
    if (product.insuranceDetails.length > 0) {
      productDetails.insurancePolicyNo =
        product.insuranceDetails[0].policyNo || "NA";
      productDetails.insuranceEffectiveDate = product.insuranceDetails[0]
        .effectiveDate
        ? moment(product.insuranceDetails[0].effectiveDate).format(
            "MMM DD, YYYY"
          )
        : "NA";
      if (
        product.insuranceDetails[0].provider &&
        product.insuranceDetails[0].provider.name
      ) {
        productDetails.insuranceProviderName =
          product.insuranceDetails[0].provider.name;
        if (activeType == "insurance") {
          brandNameToAddress = product.insuranceDetails[0].provider.name;
        }
      }
    }

    if (
      activeType == "warranty" &&
      product.warrantyDetails.length > 0 &&
      product.warrantyDetails[0].provider &&
      product.warrantyDetails[0].provider.name
    ) {
      brandNameToAddress = product.warrantyDetails[0].provider.name;
    }

    let productDetailsText = ``;

    if (product.masterCategoryId == MAIN_CATEGORY_IDS.AUTOMOBILE) {
      subject = `${subject}${
        productDetails.vin ? ", Vin No. " + productDetails.vin : ""
      }`;
    } else if (product.categoryId == CATEGORY_IDS.ELECTRONICS.MOBILE) {
      subject = `${subject}${
        productDetails.imeiNumber
          ? ", IMEI No. " + productDetails.imeiNumber
          : ""
      }`;
    } else if (product.masterCategoryId == MAIN_CATEGORY_IDS.ELECTRONICS) {
      subject = `${subject}${
        productDetails.serialNumber
          ? ", Serial No. " + productDetails.serialNumber
          : ""
      }`;
    }

    if (product.masterCategoryId == MAIN_CATEGORY_IDS.ELECTRONICS) {
      subject = `Issue with ${product.brand ? product.brand.name : ""} ${
        product.model ? product.model : ""
      } ${product.categoryName}`;
    }

    switch (activeType) {
      case "brand":
        if (product.masterCategoryId == MAIN_CATEGORY_IDS.AUTOMOBILE) {
          productDetailsText = `VIN No./Chasis Number: ${
            productDetails.vin
          }\nRegisteration Number: ${
            productDetails.registrationNumber
          }\nModel No: ${productDetails.modelNumber}\nPurchase Date: ${
            productDetails.purchaseDate
          }\nInsurance Poilcy Number: ${
            productDetails.insurancePolicyNo
          }\nInsurance Provider: ${productDetails.insuranceProviderName}`;
        } else if (product.categoryId == CATEGORY_IDS.ELECTRONICS.MOBILE) {
          productDetailsText = `IMEI Number: ${
            productDetails.imeiNumber
          }\nModel No: ${productDetails.modelNumber}\nPurchase Date: ${
            productDetails.purchaseDate
          }`;
        } else if (product.masterCategoryId == MAIN_CATEGORY_IDS.ELECTRONICS) {
          productDetailsText = `Serial Number: ${
            productDetails.serialNumber
          }\nModel No: ${productDetails.modelNumber}\nPurchase Date: ${
            productDetails.purchaseDate
          }`;
        } else if (product.masterCategoryId == MAIN_CATEGORY_IDS.FURNITURE) {
          productDetailsText = `Brand Category: ${
            productDetails.brandCategory
          }\nPurchase Date: ${productDetails.purchaseDate}`;
        }
        break;
      case "warranty":
        if (product.masterCategoryId == MAIN_CATEGORY_IDS.AUTOMOBILE) {
          productDetailsText = `VIN No./Chasis Number: ${
            productDetails.vin
          }\nRegisteration Number: ${
            productDetails.registrationNumber
          }\nModel No: ${productDetails.modelNumber}\nPurchase Date: ${
            productDetails.purchaseDate
          }`;
        } else if (product.categoryId == CATEGORY_IDS.ELECTRONICS.MOBILE) {
          productDetailsText = `Brand Category: ${
            productDetails.brandCategory
          }\nIMEI Number: ${productDetails.imeiNumber}\nModel No: ${
            productDetails.modelNumber
          }\nPurchase Date: ${productDetails.purchaseDate}`;
        } else if (product.masterCategoryId == MAIN_CATEGORY_IDS.ELECTRONICS) {
          productDetailsText = `Brand Category: ${
            productDetails.brandCategory
          }\nSerial Number: ${productDetails.serialNumber}\nModel No: ${
            productDetails.modelNumber
          }\nPurchase Date: ${productDetails.purchaseDate}`;
        }
        break;
      case "insurance":
        if (product.masterCategoryId == MAIN_CATEGORY_IDS.AUTOMOBILE) {
          productDetailsText = `VIN No./Chasis Number: ${
            productDetails.vin
          }\nRegisteration Number: ${
            productDetails.registrationNumber
          }\nModel No: ${productDetails.modelNumber}\nPurchase Date: ${
            productDetails.purchaseDate
          }\nPoilcy Number: ${productDetails.insurancePolicyNo}`;
        } else if (product.categoryId == CATEGORY_IDS.ELECTRONICS.MOBILE) {
          productDetailsText = `Brand Category: ${
            productDetails.brandCategory
          }\nIMEI Number: ${productDetails.imeiNumber}\nModel No: ${
            productDetails.modelNumber
          }\nPurchase Date: ${productDetails.purchaseDate}\nPoilcy Number: ${
            productDetails.insurancePolicyNo
          }`;
        } else if (product.masterCategoryId == MAIN_CATEGORY_IDS.ELECTRONICS) {
          productDetailsText = `Brand Category: ${
            productDetails.brandCategory
          }\nSerial Number: ${productDetails.serialNumber}\nModel No: ${
            productDetails.modelNumber
          }\nPurchase Date: ${productDetails.purchaseDate}\nPoilcy Number: ${
            productDetails.insurancePolicyNo
          }`;
        }
        break;
      default:
    }

    if (product.categoryId == CATEGORY_IDS.HEALTHCARE.INSURANCE) {
      subject = `Issue with Policy ${
        productDetails.insurancePolicyNo != "NA"
          ? "No. " + productDetails.insurancePolicyNo
          : ""
      }`;
      productDetailsText = `Plan Name: ${product.productName}\nPoilcy Number: ${
        productDetails.insurancePolicyNo
      }\nEffective Date: ${productDetails.insuranceEffectiveDate}`;
    }

    if (index < this.state.emails.length) {
      const url = `mailto:${
        this.state.emails[index]
      }?subject=${subject}&body=Dear ${brandNameToAddress} Team,\n\nThe issue I am facing is : 
      <Please write your issue here> \n\n
      My Product Details are:\n${productDetailsText}\n\n\nThanks,\n${userName}\n\nPowered by BinBill`;
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
    Analytics.logEvent(Analytics.EVENTS.CLICK_CALL);

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
      Analytics.logEvent(Analytics.EVENTS.CLICK_URL);
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
    let name = "Manufacturer";
    if (activeType == "insurance") {
      name = "Insurance Provider";
    } else if (activeType == "warranty") {
      name = "Warranty Provider";
    }
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
          title={`Contact ${name}`}
          cancelButtonIndex={4}
          options={[`Email ${name}`, `Call ${name}`, `Request Service`]}
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

const mapStateToProps = state => {
  return {
    loggedInUser: state.loggedInUser
  };
};

export default connect(mapStateToProps)(AfterSaleButton);
