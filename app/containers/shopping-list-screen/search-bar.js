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

import Checkbox from "../../components/checkbox";

import SkuItem from "./sku-item";

export default class SearchBar extends React.Component {
  state = {
    isBrandsPopupVisible: false
  };
  render() {
    const {
      onSearchTextChange = () => null,
      startSearch = () => null,
      brands = [],
      selectedBrands = [],
      measurementTypes,
      isSearching = false,
      searchItems = [],
      wishList,
      toggleItemInList,
      changeItemQuantity,
      toggleBrand = () => null
    } = this.props;

    const { isBrandsPopupVisible } = this.state;

    const selectedBrandIds = selectedBrands.map(
      selectedBrand => selectedBrand.id
    );

    return (
      <View
        style={{
          backgroundColor: "#fff",
          flex: searchItems.length > 0 || isSearching ? 1 : undefined
        }}
      >
        <View
          style={{
            margin: 10,
            flexDirection: "row",
            borderRadius: 5,
            ...defaultStyles.card
          }}
        >
          <TextInput
            style={{
              flex: 1,
              height: 36,
              padding: 10
            }}
            placeholder="Search"
            onChangeText={text => onSearchTextChange(text)}
            returnKeyType="search"
            onSubmitEditing={startSearch}
          />
          <TouchableOpacity
            onPress={() =>
              this.setState({ isBrandsPopupVisible: !isBrandsPopupVisible })
            }
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderTopRightRadius: 5,
              borderBottomRightRadius: 5,
              backgroundColor: colors.pinkishOrange,
              padding: 10
            }}
          >
            <Text
              weight="Medium"
              style={{ color: "#fff", fontSize: 10, marginRight: 5 }}
            >
              {selectedBrands.length == 0
                ? "All Brands"
                : selectedBrands[0].title +
                  (selectedBrands.length > 1
                    ? "+" + String(selectedBrands.length - 1)
                    : "")}
            </Text>
            <Icon
              name="ios-arrow-down"
              color="#fff"
              size={15}
              style={{ marginTop: 2 }}
            />
          </TouchableOpacity>
        </View>
        {searchItems.length > 0 || isSearching ? (
          <View
            style={{
              flex: 1
            }}
          >
            <FlatList
              data={searchItems}
              renderItem={({ item }) => (
                <SkuItem
                  measurementTypes={measurementTypes}
                  item={item}
                  wishList={wishList}
                  toggleItemInList={toggleItemInList}
                  changeItemQuantity={changeItemQuantity}
                />
              )}
              extraData={wishList}
              keyExtractor={(item, index) => item.id}
            />
          </View>
        ) : (
          <View />
        )}
        {isBrandsPopupVisible ? (
          <View
            style={{
              position: "absolute",
              top: 50,
              right: 10,
              ...defaultStyles.card,
              borderRadius: 5,
              maxHeight: 350
            }}
          >
            <FlatList
              data={brands}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => toggleBrand(item)}
                  style={{
                    flexDirection: "row",
                    padding: 8,
                    width: 150,
                    alignItems: "center"
                  }}
                >
                  <Text style={{ flex: 1, fontSize: 10 }}>{item.title}</Text>
                  <Checkbox isChecked={selectedBrandIds.includes(item.id)} />
                </TouchableOpacity>
              )}
              extraData={wishList}
              keyExtractor={(item, index) => item.id}
              ItemSeparatorComponent={() => (
                <View style={{ backgroundColor: "#efefef", height: 1 }} />
              )}
            />
          </View>
        ) : (
          <View />
        )}
      </View>
    );
  }
}
