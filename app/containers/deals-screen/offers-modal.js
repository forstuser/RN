import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  FlatList,
  Platform,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import Snackbar from "react-native-snackbar";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";

import Radiobox from "../../components/radiobox";
import { Text, Image } from "../../elements";
import LoadingOverlay from "../../components/loading-overlay";
import ItemSelector from "../../components/item-selector";
import BlueGradientBG from "../../components/blue-gradient-bg";
import Tag from "../../components/tag";
import OffersFilterModal from "./offers-filter-modal";

import { colors } from "../../theme";
import { API_BASE_URL, fetchCategoryOffers } from "../../api";

import OfferDetailedItem from "./offer-detailed-item";

import sortIcon from "../../images/sort_icon.png";
import _ from "lodash";

export default class OffersModal extends React.Component {
  state = {
    isModalVisible: false,
    selectedCategory: null,
    offers: [],
    discountOffers: [],
    cashbackOffers: [],
    otherOffers: [],
    offerTypes: {
      discount: [],
      cashback: []
    },
    offerMerchants: [],
    selectedDiscountType: "",
    selectedCashbackType: "",
    onlyOtherOfferTypes: false,
    selectedMerchants: [],
    isLoading: false,
    isSortModalVisible: false,
    sort: "desc" // or asc
  };

  show = ({
    category,
    offerTypes,
    offerMerchants,
    selectedCashbackType,
    selectedDiscountType,
    onlyOtherOfferTypes,
    selectedMerchants
  }) => {
    const {
      discount: discountOffers,
      cashback: cashbackOffers,
      others: otherOffers
    } = category.offers;
    const offers = [...discountOffers, ...cashbackOffers, ...otherOffers];

    this.setState({
      isModalVisible: true,
      selectedCategory: category,
      offers,
      discountOffers,
      cashbackOffers,
      otherOffers,
      offerTypes,
      offerMerchants,
      selectedDiscountType,
      selectedCashbackType,
      onlyOtherOfferTypes,
      selectedMerchants
    });
  };

  loadOffers = async () => {
    const {
      offers,
      discountOffers,
      cashbackOffers,
      otherOffers,
      selectedDiscountType,
      selectedCashbackType,
      onlyOtherOfferTypes,
      selectedMerchants,
      sort
    } = this.state;
    this.setState({ isLoading: true });
    const lastDiscountOffer = discountOffers.slice(-1)[0];
    const lastCashbackOffer = cashbackOffers.slice(-1)[0];
    const lastOtherOffer = otherOffers.slice(-1)[0];
    try {
      const res = await fetchCategoryOffers({
        categoryId: this.state.selectedCategory.id,
        lastDiscountOfferId: lastDiscountOffer
          ? lastDiscountOffer.id
          : undefined,
        lastCashbackOfferId: lastCashbackOffer
          ? lastCashbackOffer.id
          : undefined,
        lastOtherOfferId: lastOtherOffer ? lastOtherOffer.id : undefined,
        discount: selectedDiscountType,
        cashback: selectedCashbackType,
        otherOfferTypes: onlyOtherOfferTypes,
        merchants: selectedMerchants,
        sort:
          (selectedCashbackType && !selectedDiscountType) ||
            (selectedDiscountType && !selectedCashbackType)
            ? sort
            : undefined
      });
      const {
        discount: resDiscountOffers,
        cashback: resCashbackOffers,
        others: resOtherOffers
      } = res.result.offers;
      const resOffers = [
        ...resDiscountOffers,
        ...resCashbackOffers,
        ...resOtherOffers
      ];
      this.setState({
        offers: [...offers, ...resOffers],
        discountOffers: [...discountOffers, ...resDiscountOffers],
        cashbackOffers: [...cashbackOffers, ...resCashbackOffers],
        otherOffers: [...otherOffers, ...resOtherOffers]
      });
    } catch (e) {
      this.setState({ isLoading: false });
      Snackbar.show({
        title: e.message,
        duration: Snackbar.LENGTH_SHORT
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  loadOffersFirstPage = () => {
    this.setState(
      {
        offers: [],
        discountOffers: [],
        cashbackOffers: [],
        otherOffers: []
      },
      () => {
        this.loadOffers();
      }
    );
  };

  onItemSelect = category => {
    this.setState(
      {
        selectedCategory: category
      },
      () => {
        this.loadOffersFirstPage();
      }
    );
  };

  setFilters = ({
    selectedDiscountType,
    selectedCashbackType,
    onlyOtherOfferTypes,
    selectedMerchants
  }) => {
    this.setState(
      {
        selectedDiscountType,
        selectedCashbackType,
        onlyOtherOfferTypes,
        selectedMerchants
      },
      () => {
        this.loadOffersFirstPage();
      }
    );
  };

  removeOtherOffers = () => {
    if (this.offersFilterModal) {
      this.offersFilterModal.removeOtherOffers();
    }
  };

  removeFilterDiscountType = () => {
    if (this.offersFilterModal) {
      this.offersFilterModal.removeFilterDiscountType();
    }
  };

  removeFilterCashbackType = () => {
    if (this.offersFilterModal) {
      this.offersFilterModal.removeFilterCashbackType();
    }
  };

  removeFilterMerchant = merchant => {
    if (this.offersFilterModal) {
      this.offersFilterModal.removeFilterMerchant(merchant);
    }
  };

  hideSortModal = () => {
    this.setState({
      isSortModalVisible: false
    });
  };

  setSort = sort => {
    this.setState(
      {
        sort,
        isSortModalVisible: false
      },
      () => {
        this.loadOffersFirstPage();
      }
    );
  };

  render() {
    const { title, offerCategories } = this.props;
    const {
      isModalVisible,
      selectedCategory,
      offers,
      isLoading,
      offerTypes,
      offerMerchants,
      selectedDiscountType,
      selectedCashbackType,
      onlyOtherOfferTypes,
      selectedMerchants,
      isSortModalVisible,
      sort
    } = this.state;
    let sortBy =
      selectedCashbackType && !selectedDiscountType ? "Cashback" : "Discount";

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
              onPress={() => this.setState({ isModalVisible: false })}
            >
              <Icon name="md-arrow-round-back" color="#fff" size={30} />
            </TouchableOpacity>
            <Text
              weight="Bold"
              style={{ color: "#fff", fontSize: 20, flex: 1, paddingRight: 10 }}
              numberOfLines={1}
            >
              {title}
            </Text>
            {(selectedCashbackType && !selectedDiscountType) ||
              (selectedDiscountType && !selectedCashbackType) ? (
                <TouchableOpacity
                  style={{ marginRight: 12 }}
                  onPress={() => this.setState({ isSortModalVisible: true })}
                >
                  <Image source={sortIcon} style={{ width: 26, height: 20 }} />
                </TouchableOpacity>
              ) : (
                <View />
              )}
            <TouchableOpacity
              style={{ marginRight: 10 }}
              onPress={() => this.offersFilterModal.show()}
            >
              <Icon name="md-options" color="#f7f7f7" size={30} />
            </TouchableOpacity>
          </View>
          <View style={styles.body}>
            <ItemSelector
              items={offerCategories.map(category => ({
                name: category.category_name,
                imageUrl: category.image_url,
                ...category
              }))}
              selectedItem={selectedCategory}
              onItemSelect={this.onItemSelect}
            />
            {selectedCategory ? (
              <View style={{ backgroundColor: "#f7f7f7", flex: 1 }}>
                {selectedDiscountType ||
                  selectedCashbackType ||
                  onlyOtherOfferTypes ||
                  selectedMerchants.length > 0 ? (
                    <View style={{ height: 36, paddingVertical: 5 }}>
                      <ScrollView horizontal>
                        {onlyOtherOfferTypes ? (
                          <Tag
                            text="Other Offers"
                            onPressClose={this.removeOtherOffers}
                          />
                        ) : (
                            <View />
                          )}
                        {selectedDiscountType ? (
                          <Tag
                            text={selectedDiscountType + "% Discount"}
                            onPressClose={this.removeFilterDiscountType}
                          />
                        ) : (
                            <View />
                          )}
                        {selectedCashbackType ? (
                          <Tag
                            text={"Rs. " + selectedCashbackType + " Cashback"}
                            onPressClose={this.removeFilterCashbackType}
                          />
                        ) : (
                            <View />
                          )}
                        {selectedMerchants.map(merchant => (
                          <Tag
                            key={merchant}
                            text={merchant}
                            onPressClose={() =>
                              this.removeFilterMerchant(merchant)
                            }
                          />
                        ))}
                      </ScrollView>
                    </View>
                  ) : (
                    <View />
                  )}
                {!isLoading && offers.length == 0 ? (
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Text
                      weight="Medium"
                      style={{
                        fontSize: 20,
                        textAlign: "center",
                        color: colors.lighterText,
                        padding: 20
                      }}
                    >
                      No offers found for applied filters
                    </Text>
                  </View>
                ) : (
                    <View />
                  )}
                <FlatList
                  data={offers}
                  renderItem={({ item }) => (
                    <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
                      <OfferDetailedItem
                        item={item}
                        categoryImageUrl={
                          API_BASE_URL + selectedCategory.image_url
                        }
                      />
                    </View>
                  )}
                  keyExtractor={(item, index) => item.id + "-" + index}
                  onEndReached={this.loadOffers}
                  onEndReachedThreshold={0.5}
                  ListFooterComponent={
                    <View
                      style={{
                        height: 60,
                        justifyContent: "center"
                      }}
                    >
                      <ActivityIndicator animating={isLoading} />
                    </View>
                  }
                />
              </View>
            ) : (
                <View />
              )}
          </View>
          <OffersFilterModal
            ref={ref => {
              this.offersFilterModal = ref;
            }}
            offerTypes={offerTypes}
            offerMerchants={offerMerchants}
            setFilters={this.setFilters}
          />
          <Modal
            style={{ margin: 0 }}
            isVisible={isSortModalVisible}
            useNativeDriver={true}
            onBackButtonPress={this.hideSortModal}
            onBackdropPress={this.hideSortModal}
          >
            <View style={styles.sortModal}>
              <TouchableOpacity
                onPress={() => this.setSort("desc")}
                style={styles.sortOption}
              >
                <Radiobox isChecked={sort == "desc"} />
                <Text weight="Medium" style={styles.sortOptionText}>
                  High to low ({sortBy})
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: "#efefef"
                }}
              />
              <TouchableOpacity
                onPress={() => this.setSort("asc")}
                style={styles.sortOption}
              >
                <Radiobox isChecked={sort == "asc"} />
                <Text weight="Medium" style={styles.sortOptionText}>
                  Low to High ({sortBy})
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
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
    flex: 1
  },
  sortModal: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 5
  },
  sortOption: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center"
  },
  sortOptionText: {
    marginLeft: 10
  }
});
