import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  FlatList
} from "react-native";
import moment from "moment";
import { Text, Button } from "../elements";
import I18n from "../i18n";
import { colors } from "../theme";
import ProductListItem from "./product-list-item";
import EmptyProductListPlaceholder from "./empty-product-list-placeholder";

// destructuring not working for some reasons
const ProductsList = props => {
  const {
    navigation,
    products = [],
    isLoading = false,
    onEndReached,
    onEndReachedThreshold = 50,
    onRefresh,
    mainCategoryId,
    category
  } = props;

  const renderProductItem = ({ item }) => (
    <View collapsable={false} 
      style={{
        marginHorizontal: 10,
        marginTop: 2
      }}
    >
      <ProductListItem navigation={navigation} product={item} />
    </View>
  );
  if (!isLoading && products.length == 0) {
    return (
      <EmptyProductListPlaceholder
        mainCategoryId={mainCategoryId}
        category={category}
        navigation={navigation}
      />
    );
  } else {
    return (
      <View collapsable={false} 
        style={{
          flex: 1,
          backgroundColor: "#FAFAFA",
          paddingTop: 0,
          marginTop: 10
        }}
      >
        <FlatList
          data={products}
          keyExtractor={(item, index) => item.id}
          renderItem={renderProductItem}
          onEndReached={onEndReached}
          onEndReachedThreshold={onEndReachedThreshold}
          onRefresh={onRefresh}
          refreshing={isLoading}
        />
      </View>
    );
  }
};

export default ProductsList;
