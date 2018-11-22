import React from "react";
import {
  View,
  ScrollView,
  FlatList,
  Animated,
  Image,
  Dimensions
} from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
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
  getSellerOffers,
  getSkuWishList
} from "../../api";
import moment from "moment";
import I18n from "../../i18n";

import { colors, defaultStyles } from "../../theme";
import OfferCategory from "./offer-category";
import OfferDetailedItem from "./offer-detailed-item";
import OffersModal from "./offers-modal";
import OffersFilterModal from "./offers-filter-modal";
import Analytics from "../../analytics";
import SkuItemOffer from "./single-sku-offer";
import SingleNormalOffer from "./single-normal-offer";
const windowWidth = Dimensions.get("window").width;
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
    normalOffers: [],
    skuOffers: [],
    wishList: []
  };

  componentDidMount() {
    this.didFocusSubscription = this.props.navigation.addListener(
      "didFocus",
      () => {
        this.fetchCategories();
        this.fetchWishlist();
      }
    );
    //this.listScrollPosition.addListener(this.onListScroll);
  }

  componentWillUnmount() {
    this.didFocusSubscription.remove();
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

  fetchWishlist = async () => {
    try {
      const res = await getSkuWishList();
      this.setState({ wishList: res.result.wishlist_items });
    } catch (wishListError) {
      console.log("wishListError: ", wishListError);
      //this.setState({ wishListError });
    } finally {
      this.setState({ wishList: res.result.wishlist_items });
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
      console.log("Seller Offers: ", result1);
      let resCategories = result1.result;
      const categories = resCategories.map(seller => ({
        ...seller,
        name: seller.name,
        imageUrl: `/consumer/sellers/${seller.id}/upload/1/images/0`
      }));

      this.setState({
        categories,
        selectedCategory: result1.result[0],
        normalOffers: result1.result[0].offers.filter(
          offer => offer.on_sku != true
        ),
        skuOffers: result1.result[0].offers.filter(
          offer => offer.on_sku == true
        )
      });
    } catch (error) {
      console.log(error);
      //this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  onCategorySelect = category => {
    this.setState({
      selectedCategory: category,
      normalOffers: category.offers.filter(offer => offer.on_sku != true),
      skuOffers: category.offers.filter(offer => offer.on_sku == true)
    });
  };

  renderSkuOffers = ({ item, index }) => {
    const { wishList } = this.state;
    return <SkuItemOffer key={index} item={item} wishList={wishList} />;
  };

  renderNormalOffers = ({ item, index }) => {
    const { skuOffers } = this.state;
    return (
      <SingleNormalOffer
        skuOffersLength={skuOffers.length}
        key={index}
        item={item}
      />
    );
  };

  render() {
    const {
      categories,
      selectedCategory,
      isLoading,
      error,
      normalOffers,
      skuOffers
    } = this.state;
    // console.log("Category: ", selectedCategory);
    if (error) {
      return <ErrorOverlay error={error} onRetryPress={this.fetchCategories} />;
    }

    console.log("Normal Offers", normalOffers);
    console.log("SKU Offers", skuOffers);

    // let slides = [];
    // normalOffers.map((offer, index) => {
    //   slides.push({
    //     key: index,
    //     id: offer.id,
    //     title: offer.title,
    //     description: offer.description,
    //     end_date: offer.end_date,
    //     document_details: offer.document_details.index
    //   });
    // });

    // console.log("Slides", slides);

    return (
      <View style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
        {this.state.categories.length != 0 ? (
          <View
            style={[
              {
                zIndex: 2,
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: ITEM_SELECTOR_HEIGHT - 20
              }
              // {
              //   transform: [
              //     {
              //       translateY: this.topPaddingElement
              //     }
              //   ]
              // }
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
          </View>
        ) : (
          <View
            style={[
              {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: ITEM_SELECTOR_HEIGHT
              }
              // {
              //   transform: [
              //     {
              //       translateY: this.topPaddingElement
              //     }
              //   ]
              // }
            ]}
          >
            <Text
              style={{
                padding: 20,
                fontSize: 16,
                textAlign: "center",
                marginTop: 20,
                color: colors.secondaryText
              }}
            >
              No offers available as of now from any of your sellers currently
            </Text>
          </View>
        )}
        {/* {!selectedCategory ? (
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
                //weight="Bold"
                style={{
                  fontSize: 16,
                  color: colors.secondaryText,
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
        )} */}

        {normalOffers.length > 0 ? (
          <View style={{ marginTop: 10 }}>
            <FlatList
              horizontal
              // onScroll={Animated.event(
              //   [
              //     {
              //       nativeEvent: {
              //         contentOffset: { y: this.listScrollPosition }
              //       }
              //     }
              //   ],
              //   { useNativeDriver: true }
              // )}
              contentContainerStyle={{
                paddingTop: ITEM_SELECTOR_HEIGHT - 30
              }}
              style={{ marginTop: 10 }}
              data={normalOffers}
              keyExtractor={item => item.id}
              renderItem={this.renderNormalOffers}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        ) : null}

        {/* {normalOffers.length > 0 ? (
          <AppIntroSlider
            dotColor="#fdd4c0"
            activeDotColor={colors.pinkishOrange}
            slides={slides}
            renderItem={SingleNormalOffer}
            hideNextButton={true}
            hideDoneButton={true}
          />
        ) : null} */}

        {skuOffers.length > 0 ? (
          <FlatList
            // onScroll={Animated.event(
            //   [
            //     {
            //       nativeEvent: {
            //         contentOffset: { y: this.listScrollPosition }
            //       }
            //     }
            //   ],
            //   { useNativeDriver: true }
            // )}
            contentContainerStyle={{
              paddingTop:
                normalOffers.length == 0 ? ITEM_SELECTOR_HEIGHT - 30 : 0
            }}
            style={{ marginTop: normalOffers.length == 0 ? 20 : 5 }}
            data={skuOffers}
            keyExtractor={item => item.id}
            renderItem={this.renderSkuOffers}
          />
        ) : null}

        <LoadingOverlay visible={isLoading} />
      </View>
    );
  }
}
