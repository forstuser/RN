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
  pastItems = [],
  wishList = [],
  addSkuItemToList,
  changeSkuItemQuantityInList,
  updatePastItems
}) => {
  selectActiveSkuMeasurementId = (item, skuMeasurementId) => {
    const itemIdx = pastItems.findIndex(listItem => listItem.id == item.id);
    if (itemIdx > -1) {
      pastItems[itemIdx].activeSkuMeasurementId = skuMeasurementId;
    }
    updatePastItems(pastItems);
  };

  return (
    <View
      style={{
        flex: 1
      }}
    >
      <View style={{ flex: 1, height: "100%" }}>
        <FlatList
          data={pastItems}
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
          extraData={{ wishList, pastItems }}
          keyExtractor={(item, index) => item.id}
        />
      </View>
    </View>
  );
};
