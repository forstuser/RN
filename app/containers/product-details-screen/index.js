import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  FlatList,
  Image,
  Alert,
  TouchableOpacity,
  Dimensions
} from "react-native";
import ScrollableTabView, {
  DefaultTabBar
} from "react-native-scrollable-tab-view";
import { API_BASE_URL, getProductDetails } from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";

import { colors } from "../../theme";

import ImportantTab from "./important-tab";
import GeneralTab from "./general-tab";
import SellerTab from "./seller-tab";

class ProductDetailsScreen extends Component {
  static navigatorStyle = {
    tabBarHidden: true
  };
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      product: {}
    };
  }
  async componentDidMount() {
    this.props.navigator.setTitle({ title: "Product Details" });
    try {
      const res = await getProductDetails(this.props.productId);
      this.setState({
        product: res.product,
        isLoaded: true
      });
    } catch (e) {
      Alert.alert(e.message);
    }
  }

  render() {
    const { product, isLoaded } = this.state;
    if (!isLoaded) {
      return null;
    }
    const metaUnderName = product.metaData
      .map(metaItem => metaItem.value)
      .join("/");
    return (
      <ScreenContainer style={{ padding: 0, backgroundColor: "#fff" }}>
        <View style={styles.upperContainer}>
          <Image
            style={styles.image}
            source={{ uri: API_BASE_URL + "/" + product.cImageURL + "1" }}
          />
          <Text weight="Bold" style={styles.name}>
            {product.productName}
          </Text>
          <Text weight="Medium" style={styles.metaUnderName}>
            {metaUnderName}
          </Text>
          <Text weight="Medium" style={styles.totalText}>
            Total
          </Text>
          <View style={styles.totalContainer}>
            <Text weight="Bold" style={styles.totalAmount}>
              ₹ {product.value}
            </Text>
          </View>
        </View>
        <ScrollableTabView
          style={{ marginTop: 20 }}
          renderTabBar={() => <DefaultTabBar />}
          tabBarUnderlineStyle={{ backgroundColor: colors.mainBlue, height: 2 }}
          tabBarBackgroundColor="#fafafa"
          tabBarTextStyle={{ fontSize: 14, fontFamily: `Quicksand-Bold` }}
          tabBarActiveTextColor={colors.mainBlue}
          tabBarInactiveTextColor={colors.secondaryText}
        >
          <ImportantTab tabLabel="IMPORTANT" product={product} />
          <SellerTab tabLabel="SELLER" product={product} />
          <GeneralTab tabLabel="GENERAL INFO" product={product} />
        </ScrollableTabView>
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  upperContainer: {
    alignItems: "center"
  },
  image: {
    width: 100,
    height: 100
  },
  name: {
    fontSize: 24
  },
  metaUnderName: {
    fontSize: 16,
    color: colors.secondaryText,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 18
  },
  totalText: {
    fontSize: 24,
    marginBottom: 7
  },
  totalAmount: {
    fontSize: 24
  }
});

export default ProductDetailsScreen;
