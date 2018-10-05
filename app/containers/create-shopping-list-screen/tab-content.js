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
  mainCategory = null,
  updateMainCategoryInParent = () => null,
  updateCategorySkuData = () => null,
  loadSkuItems = () => null,
  skuData = {},
  wishList = [],
  addSkuItemToList,
  changeSkuItemQuantityInList,
  openAddManualItemModal
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

  selectActiveSkuMeasurementId = (item, skuMeasurementId) => {
    const itemIdx = items.findIndex(listItem => listItem.id == item.id);
    if (itemIdx > -1) {
      items[itemIdx].activeSkuMeasurementId = skuMeasurementId;
    }
    updateCategorySkuData(activeCategoryId, { items });
  };

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
          ListEmptyComponent={() => (
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text>No items found</Text>
              <Button
                onPress={openAddManualItemModal}
                style={{ height: 40, width: 180, marginTop: 15 }}
                text="Add Manually"
                color="secondary"
              />
            </View>
          )}
          renderItem={({ item }) => (
            <SkuItem
              measurementTypes={measurementTypes}
              item={item}
              wishList={wishList}
              addSkuItemToList={addSkuItemToList}
              changeSkuItemQuantityInList={changeSkuItemQuantityInList}
              selectActiveSkuMeasurementId={selectActiveSkuMeasurementId}
            />
          )}
          extraData={{ wishList, skuData }}
          keyExtractor={(item, index) => item.id}
          // onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
        />
      </View>
    </View>
  );
};
