import React from "react";
import { View, ScrollView, FlatList, Animated, Image } from "react-native";

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
import moment from "moment";

import { colors, defaultStyles } from "../../theme";
import OfferCategory from "./offer-category";
import OfferDetailedItem from "./offer-detailed-item";
import OffersModal from "./offers-modal";
import OffersFilterModal from "./offers-filter-modal";
import Analytics from "../../analytics";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const ITEM_SELECTOR_HEIGHT = 120;
// const ITEM_SELECTOR_HEIGHT_WITH_FILTERS = ITEM_SELECTOR_HEIGHT + 36;

export default class OffersTab extends React.Component {
  lastListScrollPosition = 0;
  listScrollPosition = new Animated.Value(0);
  topPaddingElement = new Animated.Value(0);

  state = {
    categories: [],
    selectedCategory: null,
    isLoading: false,
    error: null,
    offers: []
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
    this.setState({
      isLoading: true,
      error: null,
      selectedCategory: null,
      offers: []
    });
    try {
      const result1 = await getSellerOffers();
      console.log("Seller Offers: ", result1.result);
      let resCategories = result1.result;
      const categories = resCategories.map(seller => ({
        ...seller,
        name: seller.name,
        imageUrl: `/consumer/sellers/${seller.id}/upload/1/images/0`
      }));

      this.setState({ categories });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  onCategorySelect = category => {
    this.setState({ selectedCategory: category, offers: category.offers });
  };

  render() {
    const {
      categories,
      selectedCategory,
      isLoading,
      error,
      offers
    } = this.state;
    // console.log("Category: ", selectedCategory);
    if (error) {
      return <ErrorOverlay error={error} onRetryPress={this.fetchCategories} />;
    }

    return (
      <View style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: ITEM_SELECTOR_HEIGHT
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
            selectedItem={selectedCategory}
            onItemSelect={this.onCategorySelect}
            startOthersAfterCount={4}
          />
        </Animated.View>
        {!selectedCategory ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              marginTop: ITEM_SELECTOR_HEIGHT
            }}
          >
            {categories.length > 0 ? (
              <Text
                weight="Bold"
                style={{
                  fontSize: 16,
                  color: "#c2c2c2",
                  textAlign: "center",
                  margin: 15
                }}
              >
                Please select a Seller to view ongoing Offers
              </Text>
            ) : null}
          </View>
        ) : (
          <View />
        )}

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
            paddingTop: ITEM_SELECTOR_HEIGHT
          }}
          style={{ flex: 1 }}
          data={offers}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View
              style={{ ...defaultStyles.card, margin: 10, borderRadius: 5 }}
            >
              <Image
                style={{ height: 120, flex: 1, width: null }}
                source={{
                  uri:
                    API_BASE_URL +
                    `/offer/${item.id}/images/${item.document_details.index ||
                      0}`
                }}
              />
              <View style={{ padding: 10 }}>
                <Text weight="Medium" style={{ fontSize: 19 }}>
                  {item.title}
                </Text>
                <Text style={{ fontSize: 15 }}>{item.description}</Text>
                <Text style={{ fontSize: 15, color: colors.mainBlue }}>
                  Expire on: {moment(item.end_date).format("DD MMM, YYYY")}
                </Text>
              </View>
            </View>
          )}
        />
        {this.state.categories.length !== 0 ? (
          <Animated.View
            style={[
              {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: ITEM_SELECTOR_HEIGHT
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
              selectedItem={selectedCategory}
              onItemSelect={this.onCategorySelect}
              startOthersAfterCount={4}
            />
          </Animated.View>
        ) : (
          <Animated.View
            style={[
              {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: ITEM_SELECTOR_HEIGHT
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
            <Text
              weight="Bold"
              style={{
                padding: 10,
                fontSize: 16,
                textAlign: "center",
                marginTop: 20,
                color: "#c2c2c2"
              }}
            >
              No offers available as of now from your seller currently
            </Text>
          </Animated.View>
        )}
        <LoadingOverlay visible={isLoading} />
      </View>
    );
  }
}
