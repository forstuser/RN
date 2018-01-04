import React from "react";
import {
  Linking,
  Platform,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Alert
} from "react-native";
import call from "react-native-phone-call";
import moment from "moment";
import { Text, Button } from "../../elements";
import I18n from "../../i18n";
import { colors } from "../../theme";
import { API_BASE_URL } from "../../api";

const directionIcon = require("../../images/ic_directions.png");
const callIcon = require("../../images/ic_call.png");

const openMap = product => {
  const seller = product.sellers;
  if (seller) {
    const address = [seller.address, seller.city, seller.state].join(", ");
    return Linking.openURL(
      Platform.OS == "ios"
        ? `http://maps.apple.com/?q=${address}`
        : `https://www.google.com/maps/search/?api=1&query=${address}`
    );
  }
  Alert.alert("Address not available");
};

const callSeller = product => {
  const seller = product.sellers;
  if (seller && seller.contact) {
    return call({ number: String(product.sellers.contact) }).catch(e =>
      Alert.alert(e.message)
    );
  }
  Alert.alert("Phone number not available");
};

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
          {product.sellers != null && (
            <Text style={styles.sellerName}>{product.sellers.sellerName}</Text>
          )}
          {product.sellers == null &&
            product.bill != null &&
            product.bill.sellers != null && (
              <Text style={styles.sellerName}>
                {product.bill.sellers.sellerName}
              </Text>
            )}
          {/* <Text>{JSON.stringify(product)}</Text> */}

          <Text weight="Medium" style={styles.purchaseDate}>
            {moment(product.purchaseDate).format("MMM DD, YYYY")}
          </Text>
        </View>
        <Text weight="Bold" style={styles.amount}>
          ₹ {product.value}
        </Text>
      </View>
      {product.categoryId != 22 && (
        <View style={styles.directionAndCall}>
          <TouchableOpacity
            onPress={() => openMap(product)}
            style={styles.directionAndCallItem}
          >
            <Text weight="Bold" style={styles.directionAndCallText}>
              Directions
            </Text>
            <Image style={styles.directionAndCallIcon} source={directionIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => callSeller(product)}
            style={styles.directionAndCallItem}
          >
            <Text weight="Bold" style={styles.directionAndCallText}>
              Call
            </Text>
            <Image style={styles.directionAndCallIcon} source={callIcon} />
          </TouchableOpacity>
        </View>
      )}
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
    flex: 1
  },
  name: {
    fontSize: 14,
    color: colors.mainText
  },
  sellerName: {
    fontSize: 12,
    color: colors.mainText,
    marginVertical: 5
  },
  purchaseDate: {
    fontSize: 12,
    color: colors.secondaryText
  },
  amount: {
    marginTop: 20
  },
  directionAndCall: {
    flexDirection: "row"
  },
  directionAndCallItem: {
    height: 40,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#ececec",
    borderWidth: 1
  },
  directionAndCallText: {
    color: colors.pinkishOrange,
    marginRight: 6
  },
  directionAndCallIcon: {
    width: 18,
    height: 18
  }
});
export default ProductListItem;
