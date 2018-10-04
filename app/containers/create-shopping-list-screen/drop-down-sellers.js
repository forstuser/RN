import React from "react";
import { Picker, StyleSheet, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import ScrollableTabView, {
  ScrollableTabBar
} from "react-native-scrollable-tab-view";

import { Text, Image } from "../../elements";
import DrawerScreenContainer from "../../components/drawer-screen-container";

import {
  getSkuReferenceData,
  getSkuItems,
  getSkuWishList,
  addSkuItemToWishList,
  clearWishList,
  getMySellers,
  getSellerSkuCategories
} from "../../api";

import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";
import { showSnackbar } from "../../utils/snackbar";

import BlankShoppingList from "./blank-shopping-list";
import SearchBar from "./search-bar";
import TabContent from "./tab-content";
import BarcodeScanner from "./barcode-scanner";
import AddManualItemModal from "./add-manual-item-modal";
import ClearOrContinuePreviousListModal from "./clear-or-continue-previous-list-modal";
import PastItems from "./past-items";
import FilterModal from "./filter-modal";
import WishListLimitModal from "./wishlist-limit-modal";
import { colors } from "../../theme";
import { SCREENS } from "../../constants";
import Analytics from "../../analytics";

class DropDownSellers extends React.Component {
  render() {
    //return this.props.sellerName;
    return (
      <Picker
        mode="dropdown"
        selectedValue={this.props.sellerName}
        style={{ height: 50, width: 100 }}
        // onValueChange={(itemValue, itemIndex) =>
        //   this.props.onDropdownChange(itemValue, itemIndex)
        // }
        // onValueChange={(itemValue, itemIndex) =>
        //   this.setState({ language: itemValue })
        // }
      >
        <Picker.Item label="Huzaifa Shop" value="java" />
        <Picker.Item label="Zop" value="js" />
      </Picker>
    );
  }
}

export default DropDownSellers;
