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

const renderProductItem = ({ item }) => <ProductListItem product={item} />;
const ProductsList = ({
  products = [],
  isLoading = false,
  onEndReached,
  onEndReachedThreshold = 50,
  onRefresh
}) => {
  if (!isLoading && products.length == 0) {
    return <EmptyProductListPlaceholder />;
  } else {
    return (
      <FlatList
        style={{ flex: 1, backgroundColor: "#fff" }}
        data={products}
        keyExtractor={(item, index) => item.id}
        renderItem={renderProductItem}
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        onRefresh={onRefresh}
        refreshing={isLoading}
      />
    );
  }
};

export default ProductsList;
