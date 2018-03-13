import React from "react";
import { StyleSheet, View, Image } from "react-native";
import Text from "../elements/text";
import { colors } from "../theme";
import I18n from "../i18n";

import { MAIN_CATEGORY_IDS } from "../constants";

const noDocsIcon = require("../images/ic_no_docs.png");

const EmptyProductListPlaceholder = ({ mainCategoryId, navigator }) => {
  let desc = "";
  switch (mainCategoryId) {
    case MAIN_CATEGORY_IDS.FURNITURE:
      desc = I18n.t("products_list_no_result_desc_furniture");
      break;
    case MAIN_CATEGORY_IDS.ELECTRONICS:
      desc = I18n.t("products_list_no_result_desc_electronics");
      break;
    case MAIN_CATEGORY_IDS.AUTOMOBILE:
      desc = I18n.t("products_list_no_result_desc_automobile");
      break;
    case MAIN_CATEGORY_IDS.TRAVEL:
      desc = I18n.t("products_list_no_result_desc_travel");
      break;
    case MAIN_CATEGORY_IDS.HEALTHCARE:
      desc = I18n.t("products_list_no_result_desc_healthcare");
      break;
    case MAIN_CATEGORY_IDS.SERVICES:
      desc = I18n.t("products_list_no_result_desc_services");
      break;
    case MAIN_CATEGORY_IDS.FASHION:
      desc = I18n.t("products_list_no_result_desc_fashion");
      break;
    case MAIN_CATEGORY_IDS.HOUSEHOLD:
      desc = I18n.t("products_list_no_result_desc_household");
      break;
    case MAIN_CATEGORY_IDS.OTHERS:
      desc = I18n.t("products_list_no_result_desc_others");
      break;
    case MAIN_CATEGORY_IDS.PERSONAL:
      desc = I18n.t("products_list_no_result_desc_personal");
      break;
    default:
      desc = "";
  }
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={noDocsIcon} />
      <Text weight="Bold" style={styles.title}>
        {I18n.t("products_list_no_result_title")}
      </Text>
      <Text style={styles.desc}>{desc}</Text>
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
  desc: {
    fontSize: 16,
    textAlign: "center",
    padding: 16,
    color: colors.lighterText
  }
});

export default EmptyProductListPlaceholder;
