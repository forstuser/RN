import React from "react";
import {
  View,
  ScrollView,
  FlatList,
  Animated,
  Image,
  Dimensions,
  StyleSheet,
  AsyncStorage
} from "react-native";
import ScrollableTabView, {
  DefaultTabBar
} from "react-native-scrollable-tab-view";
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
  getOffers,
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
import SingleNewProduct from "./single-new-product";
import SkuItemOffer from "./single-sku-offer";
import SingleNormalOffer from "./single-normal-offer";
import SingleBogoOffer from "./single-bogo-offer";
import SingleExtraQuantityOffer from "./single-extra-quant-offer";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const ITEM_SELECTOR_HEIGHT = 120;
// const ITEM_SELECTOR_HEIGHT_WITH_FILTERS = ITEM_SELECTOR_HEIGHT + 36;

export default class OffersTab extends React.Component {
  state = {
    error: null,
    wishList: [],
    showCategory: true
  };

  renderNewProducts = ({ item, index }) => {
    //const { selectedCategory } = this.state;
    const { wishList, getWishList, selectedCategory } = this.props;
    return (
      <SingleNewProduct
        key={index}
        item={item}
        wishList={wishList}
        selectedCategory={selectedCategory}
        getWishList={getWishList}
      />
    );
  };

  renderDiscountOffers = ({ item, index }) => {
    //const { selectedCategory } = this.state;
    const { wishList, getWishList, selectedCategory } = this.props;
    return (
      <SkuItemOffer
        key={index}
        item={item}
        wishList={wishList}
        selectedCategory={selectedCategory}
        getWishList={getWishList}
      />
    );
  };

  renderBogoOffers = ({ item, index }) => {
    //const { selectedCategory } = this.state;
    const { wishList, getWishList, selectedCategory } = this.props;
    return (
      <SingleBogoOffer
        key={index}
        item={item}
        wishList={wishList}
        selectedCategory={selectedCategory}
        getWishList={getWishList}
      />
    );
  };

  renderExtraQuantityOffers = ({ item, index }) => {
    //const { selectedCategory } = this.state;
    const { wishList, getWishList, selectedCategory } = this.props;
    return (
      <SingleExtraQuantityOffer
        key={index}
        item={item}
        wishList={wishList}
        selectedCategory={selectedCategory}
        getWishList={getWishList}
      />
    );
  };

  renderGeneralOffers = ({ item, index }) => {
    return <SingleNormalOffer key={index} item={item} />;
  };
  handleScroll = event => {
    console.log(event.nativeEvent.contentOffset.y);
    if (event.nativeEvent.contentOffset.y > 100) {
      this.setState({ showCategory: false });
    } else if (event.nativeEvent.contentOffset.y < 100) {
      this.setState({ showCategory: true });
    }
  };
  render() {
    const {
      categories,
      selectedCategory,
      isLoading,
      error,
      newProducts,
      discountOffers,
      bogo,
      extraQuantity,
      generalOffers,
      emptyMessage
    } = this.props;

    return (
      <View style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
        {this.state.showCategory ? (
          <View>
            {categories.length > 0 ? (
              <View
                style={[
                  {
                    zIndex: 2,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 140,
                    marginTop: -15
                  }
                ]}
              >
                <ItemSelector
                  style={{ backgroundColor: "#fff" }}
                  selectModalTitle="Select a Category"
                  items={categories}
                  selectedItem={selectedCategory}
                  onItemSelect={this.props.onCategorySelect}
                  startOthersAfterCount={4}
                />
              </View>
            ) : (
              <View
                style={[
                  {
                    height: windowHeight,
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center"
                  }
                ]}
              >
                <Image
                  style={{ width: 150, height: 150 }}
                  source={require("../../images/empty_offers.png")}
                  resizeMode="contain"
                />
                <Text
                  //weight="Medium"
                  style={{
                    padding: 20,
                    fontSize: 16,
                    textAlign: "center",
                    marginTop: 5,
                    color: colors.secondaryText
                  }}
                >
                  {emptyMessage}
                </Text>
              </View>
            )}
          </View>
        ) : null}

        {isLoading == false && categories.length > 0 ? (
          <ScrollableTabView
            renderTabBar={() => (
              <DefaultTabBar
                style={
                  this.state.showCategory ? styles.tabs : styles.stickyTabs
                }
                inactiveTextColor="#aaa"
                activeTextColor="#009ee5"
              />
            )}
            tabBarUnderlineStyle={{
              backgroundColor: colors.mainBlue,
              height: 2
            }}
            ref={node => {
              this.scrollableTabView = node;
            }}
            tabBarBackgroundColor="transparent"
            tabBarTextStyle={{
              fontSize: 13,
              fontFamily: `Roboto-Bold`,
              marginTop: 8,
              textAlign: "center"
            }}
          >
            <ScrollView onScroll={this.handleScroll} tabLabel="Discount">
              {discountOffers.length > 0 ? (
                <FlatList
                  contentContainerStyle={{
                    paddingTop: 0
                  }}
                  style={{
                    marginTop: 5
                  }}
                  data={discountOffers}
                  keyExtractor={item => item.id}
                  renderItem={this.renderDiscountOffers}
                />
              ) : (
                <View
                  style={[
                    {
                      flex: 1,
                      marginTop: 90,
                      alignItems: "center",
                      justifyContent: "center"
                    }
                  ]}
                >
                  <Image
                    style={{ width: 150, height: 150 }}
                    source={require("../../images/empty_offers.png")}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      padding: 20,
                      fontSize: 16,
                      textAlign: "center",
                      color: colors.secondaryText
                    }}
                  >
                    No Offers available from your Seller currently
                  </Text>
                </View>
              )}
            </ScrollView>
            <ScrollView onScroll={this.handleScroll} tabLabel="BOGO">
              {bogo.length > 0 ? (
                <FlatList
                  contentContainerStyle={{
                    paddingTop: 0
                  }}
                  style={{
                    marginTop: 5
                  }}
                  data={bogo}
                  keyExtractor={item => item.id}
                  renderItem={this.renderBogoOffers}
                />
              ) : (
                <View
                  style={[
                    {
                      flex: 1,
                      marginTop: 90,
                      alignItems: "center",
                      justifyContent: "center"
                    }
                  ]}
                >
                  <Image
                    style={{ width: 150, height: 150 }}
                    source={require("../../images/empty_offers.png")}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      padding: 20,
                      fontSize: 16,
                      textAlign: "center",
                      color: colors.secondaryText
                    }}
                  >
                    No Offers available from your Seller currently
                  </Text>
                </View>
              )}
            </ScrollView>
            <ScrollView onScroll={this.handleScroll} tabLabel="Extra">
              {extraQuantity.length > 0 ? (
                <FlatList
                  contentContainerStyle={{
                    paddingTop: 0
                  }}
                  style={{
                    marginTop: 5
                  }}
                  data={extraQuantity}
                  keyExtractor={item => item.id}
                  renderItem={this.renderExtraQuantityOffers}
                />
              ) : (
                <View
                  style={[
                    {
                      flex: 1,
                      marginTop: 90,
                      alignItems: "center",
                      justifyContent: "center"
                    }
                  ]}
                >
                  <Image
                    style={{ width: 150, height: 150 }}
                    source={require("../../images/empty_offers.png")}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      padding: 20,
                      fontSize: 16,
                      textAlign: "center",
                      color: colors.secondaryText
                    }}
                  >
                    No Offers available from your Seller currently
                  </Text>
                </View>
              )}
            </ScrollView>
            <ScrollView onScroll={this.handleScroll} tabLabel="New Products">
              {newProducts.length > 0 ? (
                <FlatList
                  contentContainerStyle={{
                    paddingTop: 0
                  }}
                  style={{
                    marginTop: 5
                  }}
                  data={newProducts}
                  keyExtractor={item => item.id}
                  renderItem={this.renderNewProducts}
                />
              ) : (
                <View
                  style={[
                    {
                      flex: 1,
                      marginTop: 90,
                      alignItems: "center",
                      justifyContent: "center"
                    }
                  ]}
                >
                  <Image
                    style={{ width: 150, height: 150 }}
                    source={require("../../images/empty_offers.png")}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      padding: 20,
                      fontSize: 16,
                      textAlign: "center",
                      color: colors.secondaryText
                    }}
                  >
                    No New Products available from your Seller currently
                  </Text>
                </View>
              )}
            </ScrollView>
            <ScrollView onScroll={this.handleScroll} tabLabel="General">
              {generalOffers.length > 0 ? (
                <FlatList
                  contentContainerStyle={{
                    paddingTop: 0
                  }}
                  style={{ marginTop: 5 }}
                  data={generalOffers}
                  keyExtractor={item => item.id}
                  renderItem={this.renderGeneralOffers}
                />
              ) : (
                <View
                  style={[
                    {
                      flex: 1,
                      marginTop: 90,
                      alignItems: "center",
                      justifyContent: "center"
                    }
                  ]}
                >
                  <Image
                    style={{ width: 150, height: 150 }}
                    source={require("../../images/empty_offers.png")}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      padding: 20,
                      fontSize: 16,
                      textAlign: "center",
                      color: colors.secondaryText
                    }}
                  >
                    No Offers available from your Seller currently
                  </Text>
                </View>
              )}
            </ScrollView>
          </ScrollableTabView>
        ) : null}

        <LoadingOverlay visible={isLoading} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  tabs: {
    height: 35,
    marginTop: 125,
    backgroundColor: "#fff",
    padding: 5,
    paddingTop: 0
  },
  stickyTabs: {
    height: 35,
    marginTop: 0,
    backgroundColor: "#fff",
    padding: 5,
    paddingTop: 0
  }
});
