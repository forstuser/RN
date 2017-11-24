import React, { Component } from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import moment from "moment";
import { Text, Button, ScreenContainer } from "../../elements";

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
      <View>
        <KeyValueItem
          keyText="Main Category"
          valueText={product.masterCategoryName}
        />
        <KeyValueItem keyText="Sub-Category" valueText={product.categoryName} />
        <KeyValueItem keyText="Brand" valueText={product.brand.name} />
        <KeyValueItem
          keyText="Date of Purchase"
          valueText={moment(product.purchaseDate).format("MMM DD, YYYY")}
        />
        {product.metaData.map(metaItem => (
          <KeyValueItem
            key={metaItem.name}
            keyText={metaItem.name}
            valueText={metaItem.value}
          />
        ))}
      </View>
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
