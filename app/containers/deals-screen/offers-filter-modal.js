import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  FlatList,
  Platform,
  TouchableOpacity
} from "react-native";
import Snackbar from "react-native-snackbar";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";

import Radiobox from "../../components/radiobox";
import BlueGradientBG from "../../components/blue-gradient-bg";
import Checkbox from "../../components/checkbox";
import { Text, Button } from "../../elements";

import { colors } from "../../theme";

export default class OffersFilterModal extends React.Component {
  state = {
    isModalVisible: false,
    activeFilter: "type",
    selectedDiscountType: null,
    selectedCashbackType: null,
    includeOtherOfferTypes: true,
    selectedMerchants: []
  };

  show = () => {
    this.setState({ isModalVisible: true });
  };

  hide = () => {
    this.setState({ isModalVisible: false });
  };

  onDiscountTypePress = discount => {
    this.setState({
      selectedDiscountType: discount
    });
  };

  onCashbackTypePress = cashback => {
    this.setState({
      selectedCashbackType: cashback
    });
  };

  toggleSelectedMerchant = item => {
    const selectedMerchants = [...this.state.selectedMerchants];
    const idx = selectedMerchants.indexOf(item);

    if (idx > -1) {
      selectedMerchants.splice(idx, 1);
    } else {
      selectedMerchants.push(item);
    }
    this.setState({ selectedMerchants });
  };

  renderMerchantItem = ({ item }) => {
    const { selectedMerchants } = this.state;
    return (
      <TouchableOpacity
        onPress={() => this.toggleSelectedMerchant(item)}
        style={styles.filterItem}
      >
        <Text style={styles.filterItemText}>{item}</Text>
        <Checkbox isChecked={selectedMerchants.includes(item)} />
      </TouchableOpacity>
    );
  };

  provideSelectedFiltersToParent = () => {
    const { setFilters } = this.props;
    const {
      selectedDiscountType,
      selectedCashbackType,
      selectedMerchants
    } = this.state;
    setFilters({
      selectedDiscountType,
      selectedCashbackType,
      selectedMerchants
    });
    this.hide();
  };

  render() {
    const {
      offerTypes = { discount: [], cashback: [] },
      offerMerchants = []
    } = this.props;
    const {
      isModalVisible,
      activeFilter,
      selectedDiscountType,
      selectedCashbackType,
      selectedMerchants
    } = this.state;

    return (
      <Modal
        style={{ margin: 0 }}
        isVisible={isModalVisible}
        useNativeDriver={true}
        onBackButtonPress={() => this.setState({ isModalVisible: false })}
      >
        <View style={{ backgroundColor: "#fff", flex: 1 }}>
          <View style={styles.header}>
            <BlueGradientBG />
            <TouchableOpacity
              style={{ paddingVertical: 10, paddingHorizontal: 15 }}
              onPress={this.hide}
            >
              <Icon name="md-arrow-round-back" color="#fff" size={30} />
            </TouchableOpacity>
            <Text weight="Bold" style={{ color: "#fff", fontSize: 20 }}>
              Offers Filter
            </Text>
          </View>
          <View style={styles.body}>
            <View style={styles.filterTypes}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ activeFilter: "type" });
                }}
                style={[
                  styles.filterType,
                  activeFilter == "type" ? styles.selectedFilterType : {}
                ]}
              >
                <Text weight="Medium" style={styles.filterTypeText}>
                  Offer Type
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ activeFilter: "merchant" });
                }}
                style={[
                  styles.filterType,
                  activeFilter == "merchant" ? styles.selectedFilterType : {}
                ]}
              >
                <Text weight="Medium" style={styles.filterTypeText}>
                  Merchant
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.filterValues}>
              {activeFilter == "type" ? (
                <ScrollView style={styles.offerTypes}>
                  <Text weight="Medium" style={styles.offerTypeTitle}>
                    Discount
                  </Text>
                  {offerTypes.discount.map(discount => (
                    <View key={discount}>
                      <TouchableOpacity
                        onPress={() => this.onDiscountTypePress(discount)}
                        style={styles.filterItem}
                      >
                        <Text style={styles.filterItemText}>
                          {discount}% or above
                        </Text>
                        <Radiobox
                          isChecked={discount == selectedDiscountType}
                        />
                      </TouchableOpacity>
                      <View style={{ height: 1, backgroundColor: "#eee" }} />
                    </View>
                  ))}

                  <Text weight="Medium" style={styles.offerTypeTitle}>
                    Cashback
                  </Text>
                  {offerTypes.cashback.map(cashback => (
                    <View key={cashback}>
                      <TouchableOpacity
                        onPress={() => this.onCashbackTypePress(cashback)}
                        style={styles.filterItem}
                      >
                        <Text style={styles.filterItemText}>
                          Rs. {cashback} or above
                        </Text>
                        <Radiobox
                          isChecked={cashback == selectedCashbackType}
                        />
                      </TouchableOpacity>
                      <View style={{ height: 1, backgroundColor: "#eee" }} />
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <FlatList
                  data={offerMerchants}
                  renderItem={this.renderMerchantItem}
                  ItemSeparatorComponent={highlighted => (
                    <View style={{ height: 1, backgroundColor: "#eee" }} />
                  )}
                  keyExtractor={item => item}
                />
              )}
            </View>
          </View>
          <Button
            onPress={this.provideSelectedFiltersToParent}
            text="Apply Filter"
            borderRadius={0}
            color="secondary"
          />
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
      ios: { paddingTop: 20 },
      android: { paddingTop: 10 }
    })
  },
  body: {
    flex: 1,
    flexDirection: "row"
  },
  filterTypes: {
    backgroundColor: "#f4f4f4"
  },
  filterType: {
    paddingVertical: 15,
    paddingLeft: 10,
    paddingRight: 50
  },
  selectedFilterType: {
    backgroundColor: "#fff"
  },
  filterTypeText: {},
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
    padding: 10
  },
  filterItemText: {
    flex: 1
  }
});
