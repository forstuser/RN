import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Linking
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import call from "react-native-phone-call";
import moment from "moment";

import {
  SCREENS,
  MAIN_CATEGORY_IDS,
  CATEGORY_IDS,
  METADATA_KEYS
} from "../../../../constants";

import Analytics from "../../../../analytics";
import I18n from "../../../../i18n";
import { showSnackbar } from "../../../snackbar";

import { Text, AsyncImage } from "../../../../elements";
import { colors } from "../../../../theme";

import { getMetaValueByKey } from "../../../../utils";

class Card extends React.Component {
  handleEmailPress = email => {
    Analytics.logEvent(Analytics.EVENTS.CLICK_EMAIL);
    const { product, loggedInUser, type } = this.props;
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
        if (type == "insurance") {
          brandNameToAddress = product.insuranceDetails[0].provider.name;
        }
      }
    }

    if (
      type == "warranty" &&
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

    switch (type) {
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

    const url = `mailto:${email}?subject=${subject}&body=Dear ${brandNameToAddress} Team,\n\nThe issue I am facing is : 
      <Please write your issue here> \n\n
      My Product Details are:\n${productDetailsText}\n\n\nThanks,\n${userName}\n\nPowered by BinBill`;
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          snackbar({
            text: "Can't open this email"
          })
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(e => snackbar({
        text: e.message
      })
      )
  };

  handlePhonePress = phoneNumber => {
    Analytics.logEvent(Analytics.EVENTS.CLICK_CALL);
    call({
      number: phoneNumber.replace(/\(.+\)/, "").trim()
    }).catch(e => snackbar({
      text: e.message
    })
    )
  };

  handleUrlPress = url => {
    Analytics.logEvent(Analytics.EVENTS.CLICK_ON_SERVICE_REQUEST);
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        snackbar({
          text: "Don't know how to open URI: " + url
        })
      }
    });
  };

  render() {
    const {
      cardStyle,
      title,
      imageUrl,
      imageSource,
      name,
      phoneNumbers = [],
      emails = [],
      urls = []
    } = this.props;

    return (
      <View style={styles.container}>
        <Text weight="Bold" style={styles.title}>
          {title}
        </Text>
        <View style={[styles.card, cardStyle]}>
          <View style={styles.imageContainer}>
            {imageUrl ? (
              <AsyncImage
                style={styles.image}
                uri={imageUrl}
                resizeMode="contain"
              />
            ) : null}
            {imageSource ? (
              <Image
                style={styles.image}
                source={imageSource}
                resizeMode="contain"
              />
            ) : null}
          </View>
          <View style={styles.cardBody}>
            <Text weight="Bold" style={styles.name}>
              {name}
            </Text>
            {phoneNumbers.length > 0 && (
              <View>
                <Text weight="Medium" style={styles.sectionTitle}>
                  {I18n.t("product_details_screen_connect_numbers")}
                </Text>
                <View>
                  {phoneNumbers.map(phoneNumber => (
                    <TouchableOpacity
                      key={phoneNumber}
                      onPress={() => this.handlePhonePress(phoneNumber)}
                      style={styles.item}
                    >
                      <Icon
                        name="ios-call"
                        size={15}
                        color={colors.pinkishOrange}
                      />
                      <Text style={styles.itemText} weight="Medium">
                        {phoneNumber}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {urls.length > 0 && (
              <View>
                <Text weight="Medium" style={styles.sectionTitle}>
                  {I18n.t("product_details_screen_connect_links")}
                </Text>
                <View>
                  {urls.map(url => (
                    <TouchableOpacity
                      key={url}
                      onPress={() => this.handleUrlPress(url)}
                      style={styles.item}
                    >
                      <Icon
                        name="ios-globe-outline"
                        size={15}
                        color={colors.pinkishOrange}
                      />
                      <Text style={styles.itemText} weight="Medium">
                        {url}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            {emails.length > 0 && (
              <View>
                <Text weight="Medium" style={styles.sectionTitle}>
                  {I18n.t("product_details_screen_connect_emails")}
                </Text>
                <View>
                  {emails.map(email => (
                    <TouchableOpacity
                      key={email}
                      onPress={() => this.handleEmailPress(email)}
                      style={styles.item}
                    >
                      <Icon
                        name="md-mail-open"
                        size={15}
                        color={colors.pinkishOrange}
                      />
                      <Text style={styles.itemText} weight="Medium">
                        {email}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 8,
    marginTop: 0
  },
  title: {
    color: colors.mainText,
    marginBottom: 10
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 3,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    marginBottom: 10
  },
  imageContainer: {
    width: "100%",
    height: 100,
    borderBottomWidth: 1,
    borderColor: "#ececec",
    alignItems: "center",
    justifyContent: "center"
  },
  image: {
    width: 180,
    height: 60
  },
  cardBody: {
    padding: 16
  },
  sectionTitle: {
    marginVertical: 10,
    fontSize: 12
  },
  item: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  itemText: {
    fontSize: 12,
    color: colors.secondaryText,
    marginLeft: 8
  }
});

export default Card;
