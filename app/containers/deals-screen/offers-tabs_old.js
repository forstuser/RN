import React from "react";
import { View, ScrollView, FlatList, Animated } from "react-native";

import Snackbar from "../../utils/snackbar";
import { Text } from "../../elements";
import ErrorOverlay from "../../components/error-overlay";
import LoadingOverlay from "../../components/loading-overlay";
import ItemSelector from "../../components/item-selector";
import Tag from "../../components/tag";
import {
  API_BASE_URL,
  fetchOfferCategories,
  fetchCategoryOffers,
  getSellerOffers
} from "../../api";
import { colors } from "../../theme";
import OfferCategory from "./offer-category";
import OfferDetailedItem from "./offer-detailed-item";
import OffersModal from "./offers-modal";
import OffersFilterModal from "./offers-filter-modal";
import Analytics from "../../analytics";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const ITEM_SELECTOR_HEIGHT = 95;
const ITEM_SELECTOR_HEIGHT_WITH_FILTERS = ITEM_SELECTOR_HEIGHT + 36;

export default class OffersTab extends React.Component {
  lastListScrollPosition = 0;
  listScrollPosition = new Animated.Value(0);
  topPaddingElement = new Animated.Value(0);

  state = {
    categories: [],
    selectedCategory: null,
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
    offerCategories: [],
    error: null
  };

  componentDidMount() {
    this.fetchCategories();
    this.listScrollPosition.addListener(this.onListScroll);
  }

  onListScroll = ({ value }) => {
    console.log(
      "lastListScrollPosition: ",
      this.lastListScrollPosition,
      "value: ",
      value
    );

    if (value > 0) {
      if (value > this.lastListScrollPosition) {
        Animated.timing(this.topPaddingElement, {
          toValue: -ITEM_SELECTOR_HEIGHT,
          duration: 200,
          useNativeDriver: true
        }).start();
      } else if (value < this.lastListScrollPosition) {
        Animated.timing(this.topPaddingElement, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        }).start();
      }
      this.lastListScrollPosition = value;
    } else if (value == 0) {
      Animated.timing(this.topPaddingElement, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }).start();
      this.lastListScrollPosition = value;
    }
  };

  fetchCategories = async () => {
    this.setState({ isLoading: true, error: null });
    try {
      const res = await fetchOfferCategories();
      let resCategories = res.categories;
      const categories = resCategories.map(category => ({
        ...category,
        name: category.category_name,
        imageUrl: category.image_url
      }));
      this.setState({
        categories
      });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  fetchOffers = async () => {
    const {
      selectedCategory,
      selectedCashbackType,
      selectedDiscountType,
      onlyOtherOfferTypes,
      selectedMerchants
    } = this.state;
    this.setState({ isLoading: true });
    try {
      const res = await fetchCategoryOffers({
        categoryId: selectedCategory.id,
        discount: selectedDiscountType,
        cashback: selectedCashbackType,
        otherOfferTypes: onlyOtherOfferTypes,
        merchants: selectedMerchants
      });
      this.setState({
        offerCategories: res.result || []
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

  onCategorySelect = category => {
    console.log("category: ", category);
    const { selectedCategory } = this.state;
    if (selectedCategory && selectedCategory.id == category.id) {
      return;
    }
    Analytics.logEvent(Analytics.EVENTS.CLICK_OFFERS_CATEGORY, {
      category_name: category.category_name
    });

    const { setSelectedOfferCategory } = this.props;
    setSelectedOfferCategory(category);

    let discountTypes = [];
    for (discountCategory in category.filter.discount) {
      const categoryDiscountTypes = category.filter.discount[discountCategory];
      categoryDiscountTypes.forEach(categoryDiscountType => {
        if (discountTypes.indexOf(categoryDiscountType) == -1) {
          discountTypes.push(categoryDiscountType);
        }
      });
    }

    let cashbackTypes = [];
    for (cashbackCategory in category.filter.cashback) {
      const categoryCashbackTypes = category.filter.cashback[cashbackCategory];
      categoryCashbackTypes.forEach(categoryCashbackType => {
        if (cashbackTypes.indexOf(categoryCashbackType) == -1) {
          cashbackTypes.push(categoryCashbackType);
        }
      });
    }

    let offerMerchants = [];
    for (merchantCategory in category.filter.merchant) {
      const categoryMerchants = category.filter.merchant[merchantCategory];
      categoryMerchants.forEach(categoryMerchant => {
        if (offerMerchants.indexOf(categoryMerchant) == -1) {
          offerMerchants.push(categoryMerchant);
        }
      });
    }

    this.setState(
      {
        selectedCategory: category,
        offerTypes: {
          discount: discountTypes,
          cashback: cashbackTypes
        },
        offerMerchants,
        selectedCashbackType: null,
        selectedDiscountType: null,
        selectedMerchants: []
      },
      () => {
        // call the reset function
  
        this.offersFilterModal.resetAllFilters();
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
        offerCategories: [],
        selectedDiscountType,
        selectedCashbackType,
        onlyOtherOfferTypes,
        selectedMerchants
      },
      () => {
        this.fetchOffers();
      }
    );
  };

  showOfferModal = category => {
    const {
      offerTypes,
      offerMerchants,
      selectedDiscountType,
      selectedCashbackType,
      selectedMerchants,
      onlyOtherOfferTypes
    } = this.state;

    this.offersModal.show({
      category,
      offerTypes,
      offerMerchants,
      selectedCashbackType,
      selectedDiscountType,
      selectedMerchants,
      onlyOtherOfferTypes
    });
  };

  render() {
    const {
      categories,
      selectedCategory,
      offerTypes,
      offerMerchants,
      isLoading,
      offerCategories,
      selectedDiscountType,
      selectedCashbackType,
      onlyOtherOfferTypes,
      selectedMerchants,
      error
    } = this.state;

    if (error) {
      return <ErrorOverlay error={error} onRetryPress={this.fetchCategories} />;
    }

    const isFilterApplied =
      selectedDiscountType ||
      selectedCashbackType ||
      onlyOtherOfferTypes ||
      selectedMerchants.length > 0;
    let isOfferCountGreaterThanZero = false;
    for (let i = 0; i < offerCategories.length; i++) {
      if (offerCategories[i].offer_counts > 0) {
        isOfferCountGreaterThanZero = true;
        break;
      }
    }

    return (
      <View style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
        {!selectedCategory ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              marginTop: ITEM_SELECTOR_HEIGHT
            }}
          >
            <Text
              weight="Bold"
              style={{
                fontSize: 16,
                color: "#c2c2c2",
                textAlign: "center",
                margin: 15
              }}
            >
              Please select a category to view the Best of Offers at great
              prices
            </Text>
          </View>
        ) : (
          <View />
        )}
        {offerCategories.length > 0 && isOfferCountGreaterThanZero ? (
          <AnimatedFlatList
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: { y: this.listScrollPosition }
                  }
                }
              ],
              { useNativeDriver: true }
            )}
            contentContainerStyle={{
              paddingTop: isFilterApplied
                ? ITEM_SELECTOR_HEIGHT_WITH_FILTERS
                : ITEM_SELECTOR_HEIGHT
            }}
            style={{ flex: 1 }}
            data={offerCategories}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View>
                <OfferCategory
                  onViewAllPress={() => {
                    this.showOfferModal(item);
                  }}
                  offerCategory={item}
                />
              </View>
            )}
          />
        ) : (
          <View />
        )}
        {offerCategories.length > 0 && !isOfferCountGreaterThanZero ? (
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
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: isFilterApplied
                ? ITEM_SELECTOR_HEIGHT_WITH_FILTERS
                : ITEM_SELECTOR_HEIGHT
            },
            {
              transform: [
                {
                  translateY: this.topPaddingElement
                }
              ]
            }
          ]}
        >
          <ItemSelector
            style={{ backgroundColor: "#fff" }}
            selectModalTitle="Select a Category"
            items={categories}
            // moreItems={categories.slice(4)}
            selectedItem={selectedCategory}
            onItemSelect={this.onCategorySelect}
            startOthersAfterCount={4}
          />
          {isFilterApplied ? (
            <View
              style={{
                height: 36,
                paddingVertical: 5,
                backgroundColor: "#f7f7f7"
              }}
            >
              <ScrollView horizontal>
                {onlyOtherOfferTypes ? (
                  <Tag
                    text="Other Offers"
                    onPressClose={this.offersFilterModal.removeOtherOffers}
                  />
                ) : (
                  <View />
                )}
                {selectedDiscountType ? (
                  <Tag
                    text={selectedDiscountType + "% Discount"}
                    onPressClose={
                      this.offersFilterModal.removeFilterDiscountType
                    }
                  />
                ) : (
                  <View />
                )}
                {selectedCashbackType ? (
                  <Tag
                    text={"Rs. " + selectedCashbackType + " Cashback"}
                    onPressClose={
                      this.offersFilterModal.removeFilterCashbackType
                    }
                  />
                ) : (
                  <View />
                )}
                {selectedMerchants.map(merchant => (
                  <Tag
                    key={merchant}
                    text={merchant}
                    onPressClose={() =>
                      this.offersFilterModal.removeFilterMerchant(merchant)
                    }
                  />
                ))}
              </ScrollView>
            </View>
          ) : (
            <View />
          )}
        </Animated.View>
        {/* {offerCategories.length == -1 ? (
          <View style={{ flex: 1, backgroundColor: "#f7f7f7", padding: 10 }}>
            <FlatList
              data={offerCategories[0].offers}
              renderItem={({ item }) => <OfferDetailedItem item={item} />}
              keyExtractor={item => item.id}
            />
          </View>
        ) : (
          <View />
        )} */}

        <LoadingOverlay visible={isLoading} />
        <OffersModal
          ref={node => (this.offersModal = node)}
          title={selectedCategory ? selectedCategory.name + " Offers" : ""}
          offerCategories={offerCategories}
        />

        <OffersFilterModal
          ref={ref => {
            this.offersFilterModal = ref;
            this.props.setOffersFilterModalRef(ref);
          }}
          offerTypes={offerTypes}
          offerMerchants={offerMerchants}
          setFilters={this.setFilters}
        />
      </View>
    );
  }
}