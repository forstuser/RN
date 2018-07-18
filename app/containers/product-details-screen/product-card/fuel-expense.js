import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  FlatList
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";
import moment from "moment";
import { Text } from "../../../elements";
import { MAIN_CATEGORY_IDS, SCREENS, CATEGORY_IDS } from "../../../constants";
import { colors } from "../../../theme";
import Analytics from "../../../analytics";

const dropdownIcon = require("../../../images/ic_dropdown_arrow.png");

export default class FuelExpense extends React.Component {
  state = {
    isModalVisible: false
  };

  openAddFuelExpenseScreen = fuelExpense => {
    Analytics.logEvent(Analytics.EVENTS.ADD_FUEL_EXPENSE);
    this.hideModal();
    const { product, navigation } = this.props;
    this.props.navigation.navigate(SCREENS.ADD_FUEL_EXPENSE_SCREEN, {
      product,
      fuelExpense
    });
  };

  showBreakdown = () => {
    const { product, navigation } = this.props;
    this.setState({ isModalVisible: true });
  };

  hideModal = () => {
    this.setState({ isModalVisible: false });
  };

  render() {
    const { product } = this.props;
    const { isModalVisible } = this.state;

    if (
      product.masterCategoryId != MAIN_CATEGORY_IDS.AUTOMOBILE ||
      product.categoryId == CATEGORY_IDS.AUTOMOBILE.TYRE ||
      product.categoryId == CATEGORY_IDS.AUTOMOBILE.ACCESSORY
    )
      return null;

    const totalAmount = product.fuel_details.reduce(
      (total, detail) => total + detail.value,
      0
    );

    return (
      <View style={styles.container}>
        <View style={styles.details}>
          {product.fuel_details.length > 0 ? (
            <View>
              <Text weight="Medium" style={{ color: colors.secondaryText }}>
                Total Fuel Expense
              </Text>
              <TouchableOpacity
                onPress={this.showBreakdown}
                style={{ flexDirection: "row" }}
              >
                <Text weight="Bold" style={styles.totalAmount}>
                  ₹ {totalAmount}
                </Text>
                <Image style={styles.dropdownIcon} source={dropdownIcon} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.openAddFuelExpenseScreen()}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 20
                }}
              >
                <View style={styles.plusIcon}>
                  <Icon name="md-add" size={15} color="#fff" />
                </View>
                <Text
                  weight="Bold"
                  style={{ color: colors.mainBlue, marginLeft: 5 }}
                >
                  Add New
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => this.openAddFuelExpenseScreen()}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <View style={styles.plusIcon}>
                <Icon name="md-add" size={22} color="#fff" />
              </View>
              <Text
                weight="Bold"
                style={{ color: colors.mainBlue, fontSize: 14, marginLeft: 5 }}
              >
                Add Fuel Expense
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.meterContainer}>
          <Image
            style={styles.meter}
            source={require("../../../images/fuelmeter.png")}
          />

          <Text
            weight="Medium"
            style={{ color: colors.secondaryText, fontSize: 12 }}
          >
            {product.mileage
              ? parseFloat(product.mileage).toFixed(2) + " km/l"
              : "N.A."}
          </Text>
          <Text
            weight="Medium"
            style={{ color: colors.secondaryText, fontSize: 12 }}
          >
            MILEAGE
          </Text>
        </View>
        <Modal
          isVisible={isModalVisible}
          onBackButtonPress={this.hideModal}
          onBackdropPress={this.hideModal}
        >
          <View style={styles.modal}>
            <View style={styles.modalHead}>
              <Text weight="Bold" style={{ fontSize: 18 }}>
                Fuel Expense Details
              </Text>
              <TouchableOpacity
                style={styles.closeIcon}
                onPress={this.hideModal}
              >
                <Icon name="md-close" size={30} color={colors.mainText} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={product.fuel_details}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemDate}>
                      {moment(item.document_date).format("DD MMM, YYYY")}
                    </Text>
                    <Text style={styles.itemMileage}>
                      (Mileage:{" "}
                      {item.mileage
                        ? parseFloat(item.mileage).toFixed(2) + " km/l"
                        : "N.A."})
                    </Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.itemAmount}>₹{item.value}</Text>
                    <Text style={styles.itemMileage}>
                      ({item.rs_km
                        ? parseFloat(item.rs_km).toFixed(2) + " Rs/km"
                        : "N.A."})
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => this.openAddFuelExpenseScreen(item)}
                    style={styles.itemEditIcon}
                  >
                    <Icon name="md-create" color={colors.mainBlue} size={15} />
                  </TouchableOpacity>
                </View>
              )}
            />
            <View style={styles.item}>
              <Text style={styles.itemDate}>Total Cost</Text>
              <Text style={styles.itemAmount}>₹{totalAmount}</Text>
              <View style={styles.itemEditIcon} />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderColor: "#ececec",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    flexDirection: "row",
    padding: 10
  },
  details: {
    flex: 1,
    justifyContent: "center"
  },
  plusIcon: {
    height: 18,
    width: 18,
    backgroundColor: colors.mainBlue,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9
  },
  totalAmount: {
    fontSize: 18,
    color: colors.mainText
  },
  dropdownIcon: {
    width: 24,
    height: 24
  },
  meterContainer: {
    alignItems: "center"
  },
  meter: {
    width: 60,
    height: 60
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 5
  },
  modalHead: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  item: {
    flexDirection: "row",
    borderColor: "#efefef",
    borderTopWidth: 1,
    padding: 10,
    paddingHorizontal: 15,
    alignItems: "center"
  },
  itemMileage: {
    fontSize: 10
  },
  itemDate: {
    flex: 1
  },
  itemEditIcon: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center"
  }
});
