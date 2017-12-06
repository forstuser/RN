import React from "react";
import { StyleSheet, View, Image } from "react-native";
import Text from "../elements/text";
import { colors } from "../theme";
import { MAIN_CATEGORY_IDS } from "../constants";

const noDocsIcon = require("../images/ic_no_docs.png");

const EmptyProductListPlaceholder = ({ mainCategoryId }) => {
  let text = "";
  switch (mainCategoryId) {
    case MAIN_CATEGORY_IDS.FURNITURE:
      text =
        "Bills of furniture, bathroom fittings, kitchen utensils, home decorations items etc. will appear under this section after you upload them";
      break;
    case MAIN_CATEGORY_IDS.ELECTRONICS:
      text =
        "Bills of electronics items like TV, fridge, washing Machine, mobile, laptop etc. will appear under this section after you upload them";
      break;
    case MAIN_CATEGORY_IDS.AUTOMOBILE:
      text =
        "Bills of automobiles like car, bike, bicycle, scooter etc. will appear under this section after you upload them";
      break;
    case MAIN_CATEGORY_IDS.TRAVEL:
      text =
        "Travel bills like flight tickets, train tickets, cab bills etc. will appear under this section after you upload them";
      break;
    case MAIN_CATEGORY_IDS.HEALTHCARE:
      text =
        "Your medical expenses, prescriptions and health reports will appear under this section after you upload them";
      break;
    case MAIN_CATEGORY_IDS.SERVICES:
      text =
        "Bills related to personal and professional services like spa, saloon, CA, lawyer, tutor, music classes etc. will appear under this section after you upload them";
      break;
    case MAIN_CATEGORY_IDS.FASHION:
      text =
        "Bills for your lifestyle related purchase like clothes, shoes, watches, bags, jewellery etc. will appear under this section after you upload them";
      break;
    case MAIN_CATEGORY_IDS.HOUSEHOLD:
      text =
        "Bills for household expense like groceries, stationary, electricity, water, broadband  etc. will appear under this section after you upload them";
      break;
    case MAIN_CATEGORY_IDS.OTHERS:
      text =
        "Any other document will appear under this section after you upload them";
      break;
    case MAIN_CATEGORY_IDS.PERSONAL:
      text =
        "Documents like PAN card, aadhaar card, driving licence, etc. will appear under this section after you upload them";
      break;
    default:
      text = "";
  }
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={noDocsIcon} />
      <Text weight="Bold" style={styles.title}>
        No Documents Found
      </Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff"
  },
  image: {
    width: 140,
    height: 140
  },
  title: {
    fontSize: 18,
    color: colors.mainText
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    padding: 16,
    color: colors.lighterText
  }
});

export default EmptyProductListPlaceholder;
