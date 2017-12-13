import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
  Text as NativeText
} from "react-native";

import ScrollableTabView, {
  DefaultTabBar
} from "react-native-scrollable-tab-view";

import Modal from "react-native-modal";

import { API_BASE_URL, getProductDetails } from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";

import I18n from "../../i18n";

import { colors } from "../../theme";

import Details from "./details";
import ImportantTab from "./important-tab";
import GeneralTab from "./general-tab";
import SellerTab from "./seller-tab";
import ContactAfterSaleButton from "./after-sale-button";

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
    this.props.navigator.setTitle({
      title: I18n.t("product_details_screen_title")
    });
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
    return (
      <View style={styles.container}>
        <Details product={product} />
        <ScrollableTabView
          style={{ marginTop: 20, marginBottom: 70 }}
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
        <View style={styles.contactAfterSalesBtn}>
          <ContactAfterSaleButton product={product} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
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
  },
  contactAfterSalesBtn: {
    position: "absolute",
    bottom: 10,
    left: 16,
    right: 16
  }
});

export default ProductDetailsScreen;
