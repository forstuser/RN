import React, { Component } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  TouchableOpacity
} from "react-native";
import moment from "moment";
import { Text, Button, ScreenContainer } from "../../elements";
import I18n from "../../i18n";
import { colors } from "../../theme";
import KeyValueItem from "../../components/key-value-item";

class GeneralTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      product: {}
    };
  }

  render() {
    const { product } = this.props;
    return (
      <ScrollView>
        <KeyValueItem
          keyText={I18n.t("product_details_screen_main_category")}
          valueText={product.masterCategoryName}
        />
        <KeyValueItem
          keyText={I18n.t("product_details_screen_sub_category")}
          valueText={product.categoryName}
        />
        {product.brand && (
          <KeyValueItem
            keyText={I18n.t("product_details_screen_brand")}
            valueText={product.brand.name}
          />
        )}
        <KeyValueItem
          keyText={I18n.t("product_details_screen_date_of_purchase")}
          valueText={moment(product.purchaseDate).format("MMM DD, YYYY")}
        />
        {product.metaData.map((metaItem, index) => (
          <KeyValueItem
            key={index}
            keyText={metaItem.name}
            valueText={metaItem.value}
          />
        ))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  image: {
    width: 100,
    height: 100
  },
  subTitle: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 30
  }
});

export default GeneralTab;
