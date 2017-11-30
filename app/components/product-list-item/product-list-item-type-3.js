import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import moment from "moment";
import { Text, Button, AsyncImage } from "../../elements";
import I18n from "../../i18n";
import { colors } from "../../theme";
import { API_BASE_URL } from "../../api";
import { openBillsPopUp } from "../../navigation";

const ProductListItem = ({ product }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        openBillsPopUp({
          date: product.purchaseDate,
          id: product.productName,
          copies: product.copies
        });
      }}
      style={styles.container}
    >
      <View style={styles.details}>
        <AsyncImage
          fileType={product.copies[0].file_type}
          style={styles.image}
          uri={API_BASE_URL + "/" + product.copies[0].copyUrl}
        />
        <View style={styles.texts}>
          <Text weight="Bold" style={styles.name}>
            {product.productName}
          </Text>
          <Text weight="Medium" style={styles.uploadDate}>
            Uploaded on {moment(product.purchaseDate).format("DD MMM YYYY")}
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
