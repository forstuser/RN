import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  FlatList
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { Text, Image, Button } from "../../elements";
import { defaultStyles, colors } from "../../theme";

import SkuItem from "./sku-item";

export default ({
  measurementTypes,
  mainCategory,
  updateMainCategoryInParent,
  loadSkuItems,
  skuData
}) => {
  if (!mainCategory.activeCategoryId) {
    updateMainCategoryInParent({
      activeCategoryId: mainCategory.categories[0].id
    });
    return null;
  } else if (!skuData[mainCategory.activeCategoryId]) {
    loadSkuItems({ categoryId: mainCategory.activeCategoryId });
  }

  const { categories, activeCategoryId } = mainCategory;
  const categorySkuData = skuData[activeCategoryId] || {};
  const { isLoading = true, error = null, items = [] } = categorySkuData;

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row"
      }}
    >
      <View
        style={{ flex: 1, backgroundColor: colors.lightBlue, height: "100%" }}
      >
        <FlatList
          data={categories}
          extraData={activeCategoryId}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                updateMainCategoryInParent({
                  activeCategoryId: item.id
                });
              }}
              style={{
                height: 30,
                justifyContent: "center",
                paddingHorizontal: 5,
                backgroundColor:
                  item.id == activeCategoryId ? "#fff" : "transparent"
              }}
            >
              <Text weight="Medium" style={{ fontSize: 10 }} numberOfLines={1}>
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={{ flex: 2, height: "100%" }}>
        <FlatList
          data={items}
          refreshing={isLoading}
          onRefresh={() => loadSkuItems({ categoryId: activeCategoryId })}
          renderItem={({ item }) => (
            <SkuItem measurementTypes={measurementTypes} item={item} />
          )}
          keyExtractor={(item, index) => item.id}
        />
      </View>
    </View>
  );
};
