import React from "react";
import { StyleSheet, View, Image, Alert } from "react-native";

import { ScreenContainer, Text } from "../../elements";

import SelectCategoryHeader from "./select-category-header";

class Product extends React.Component {
  render() {
    const { mainCategoryId } = this.props;
    return (
      <ScreenContainer style={styles.container}>
        <SelectCategoryHeader
          mainCategoryId={mainCategoryId}
          preSelectCategory={{ id: 142, name: "iogo" }}
          onCategorySelect={category => {
            // Alert.alert(String(category.id));
          }}
        />
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0
  }
});

export default Product;
