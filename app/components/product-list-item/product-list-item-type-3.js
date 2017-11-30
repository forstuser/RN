import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import moment from "moment";
import { Text, Button } from "../../elements";
import I18n from "../../i18n";
import { colors } from "../../theme";
import { API_BASE_URL } from "../../api";

const ProductListItem = ({ product }) => {
  return (
    <View style={styles.container}>
      <View style={styles.details}>
        <Image
          style={styles.image}
          source={{ uri: API_BASE_URL + "/" + product.cImageURL + "1" }}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  details: {
    paddingTop: 16,
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
