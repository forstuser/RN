import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  FlatList
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";

import { Text, Button } from "../../elements";
import Checkbox from "../../components/checkbox";
import Radiobox from "../../components/radiobox";
import SmallDot from "../../components/small-dot";
import { API_BASE_URL, getMySellers } from "../../api";

import { colors } from "../../theme";

class FilterOffersModal extends Component {
  state = {
    isVisible: false,
    selectedMainCategory: "Filter by Brands"
  };

  show = () => {
    this.setState({ isVisible: true });
  };

  hide = () => {
    this.setState({ isVisible: false });
  };

  renderMainCategoryItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({ selectedMainCategory: item.title });
        }}
        style={{
          height: 45,
          padding: 5,
          justifyContent: "center",
          backgroundColor:
            this.state.selectedMainCategory === item.title ? "#d8edf7" : null
        }}
      >
        <Text weight="Medium" numberOfLines={1}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  renderCategoryItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.state.selectedMainCategory === "Filter by Brands"
            ? this.props.toggleBrandSelection(item)
            : this.props.toggleCategorySelection(item);
        }}
        style={{
          flexDirection: "row",
          padding: 8,
          alignItems: "center"
        }}
      >
        <Text style={{ flex: 1, fontSize: 12 }}>{item.name}</Text>
        <Checkbox
          isChecked={
            this.state.selectedMainCategory === "Filter by Brands"
              ? this.props.checkedBrandIds.includes(item.id)
              : this.props.checkedCategoryIds.includes(item.id)
          }
        />
      </TouchableOpacity>
    );
  };

  render() {
    let mainCategories = [
      {
        id: 1,
        title: "Filter by Brands"
      },
      {
        id: 2,
        title: "Filter by Categories"
      }
    ];

    let source = null;
    if (this.state.selectedMainCategory === "Filter by Brands") {
      source = this.props.brandsInFilter;
    } else if (this.state.selectedMainCategory === "Filter by Categories") {
      source = this.props.categoriesInFilter;
    }

    return (
      <Modal
        style={{ flex: 1, backgroundColor: "#fff", padding: 5, margin: 0 }}
        isVisible={this.state.isVisible}
        onBackButtonPress={this.hide}
      >
        <View style={{ backgroundColor: "#fff", flex: 1 }}>
          <View style={styles.header}>
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              <TouchableOpacity
                style={{ paddingVertical: 10, paddingHorizontal: 15 }}
                onPress={this.hide}
              >
                <Icon name="md-arrow-back" color="#000" size={24} />
              </TouchableOpacity>
              <Text
                weight="Bold"
                style={{
                  color: colors.mainText,
                  fontSize: 20,
                  marginLeft: 15,
                  paddingVertical: 8
                }}
              >
                Filter
              </Text>
            </View>
            <TouchableOpacity onPress={this.props.resetOffersFilter}>
              <Text
                weight="Bold"
                style={{
                  color: colors.pinkishOrange,
                  fontSize: 18,
                  paddingVertical: 8,
                  paddingRight: 10
                }}
              >
                Reset
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.body}>
            <View
              style={{
                flex: 1,
                flexDirection: "row"
              }}
            >
              <View style={{ flex: 2 }}>
                <FlatList
                  contentContainerStyle={{
                    backgroundColor: "#F4F4F4",
                    height: "100%"
                  }}
                  data={mainCategories}
                  renderItem={this.renderMainCategoryItem}
                  keyExtractor={item => item.id}
                />
              </View>
              <View style={{ flex: 3, paddingLeft: 10 }}>
                <FlatList
                  data={source}
                  extraData={source}
                  renderItem={this.renderCategoryItem}
                  keyExtractor={(item, index) => item.id}
                  ItemSeparatorComponent={() => (
                    <View style={{ backgroundColor: "#efefef", height: 1 }} />
                  )}
                />
              </View>
            </View>
            <Button
              onPress={this.props.applyOffersFilter}
              text="Apply Filter"
              borderRadius={0}
              color="secondary"
            />
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: 0,
    width: "100%",
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    ...Platform.select({
      ios: { height: 70, paddingTop: 20 },
      android: { height: 50, paddingTop: 0 }
    }),
    borderColor: "#efefef",
    borderBottomWidth: 1
  },
  body: {
    flex: 1
  },

  filterType: {
    paddingVertical: 15,
    paddingLeft: 10,
    paddingRight: 50
  },
  selectedMainCategory: {
    backgroundColor: "#fff"
  },
  filterValues: {
    flex: 1,
    backgroundColor: "#fafafa"
  },
  offerTypes: {
    paddingLeft: 10
  },
  offerTypeTitle: {
    color: colors.mainBlue,
    paddingVertical: 10
  },
  filterItem: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center"
  },
  filterItemText: {
    flex: 1
  },
  mainFilterCategory: {
    height: 45,
    padding: 5,
    justifyContent: "center"
  }
});

export default FilterOffersModal;