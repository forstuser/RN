import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import moment from "moment";
import { Text, Button, AsyncImage } from "../../elements";
import I18n from "../../i18n";
import { colors } from "../../theme";
import { API_BASE_URL } from "../../api";
import { openBillsPopUp } from "../../navigation";
import { isImageFileType } from "../../utils";

const visitingCardIcon = require("../../images/main-categories/ic_visiting_card.png");
const personalDocIcon = require("../../images/main-categories/ic_personal_doc.png");

const ProductListItem = ({ product, onPress }) => {
  let productName = product.productName;
  if (!productName) {
    productName = product.sub_category_name || product.categoryName;
  }
  let imageSource = personalDocIcon;
  //visiting card
  if (product.categoryId == 27) {
    imageSource = visitingCardIcon;
  }

  return (
    <TouchableOpacity onPress={() => onPress()} style={styles.container}>
      <View style={styles.details}>
        {product.copies &&
          product.copies.length > 0 &&
          isImageFileType(
            product.copies[0].file_type || product.copies[0].fileType
          ) && (
            <AsyncImage
              fileType={
                product.copies[0].file_type || product.copies[0].fileType
              }
              style={styles.image}
              uri={API_BASE_URL + product.copies[0].copyUrl}
            />
          )}
        {product.copies &&
          product.copies.length > 0 &&
          !isImageFileType(
            product.copies[0].file_type || product.copies[0].fileType
          ) && <Image style={styles.image} source={imageSource} />}
        {product.copies &&
          product.copies.length == 0 && (
            <Image style={styles.image} source={imageSource} />
          )}
        {!product.copies && <Image style={styles.image} source={imageSource} />}
        <View style={styles.texts}>
          <Text weight="Bold" style={styles.name}>
            {productName.toUpperCase()}
          </Text>
          <Text weight="Medium" style={styles.uploadDate}>
            {moment(product.purchaseDate).format("DD MMM YYYY")}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {},
  details: {
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row"
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 16
  },
  texts: {
    flex: 1,
    justifyContent: "center"
  },
  name: {
    fontSize: 14,
    color: colors.mainText
  },
  uploadDate: {
    marginTop: 5,
    fontSize: 12,
    color: colors.secondaryText
  }
});
export default ProductListItem;
