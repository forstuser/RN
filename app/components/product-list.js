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

const renderProductItem = ({ item }) => <ProductListItem product={item} />;
const ProductList = ({ products }) => (
  <FlatList
    data={products}
    keyExtractor={(item, index) => item.id}
    renderItem={renderProductItem}
  />
);

export default ProductList;
