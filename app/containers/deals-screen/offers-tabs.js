import React from "react";
import {
  View,
  ScrollView,
  FlatList,
  Animated,
  Image,
  Dimensions,
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
  lastListScrollPosition = 0;
  listScrollPosition = new Animated.Value(0);
  topPaddingElement = new Animated.Value(0);

  state = {
    categories: [],
    selectedCategory: null,
    isLoading: false,
    error: null,
    newProducts: [],
    discountOffers: [],
    bogo: [],
    extraQuantity: [],
    generalOffers: [],
    wishList: [],
    emptyMessage: null
  };

  componentDidMount() {
    this.didFocusSubscription = this.props.navigation.addListener(
      "didFocus",
      () => {
        this.fetchCategories();
      }
    );
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

  fetchCategories = async () => {
    this.setState({
      isLoading: true,
      error: null,
      selectedCategory: null,
      discountOffers: [],
      bogo: [],
      extraQuantity: [],
      generalOffers: []
    });

    //
    const defaultSellerIdFromNotifications = this.props.navigation.getParam(
      "defaultSellerIdFromNotifications",
      null
    );
    //

    try {
      const defaultSeller = JSON.parse(
        await AsyncStorage.getItem("defaultSeller")
      );
      const result1 = await getSellerOffers();
      console.log("Seller Offer API result: ", result1);
      let resCategories = result1.result;
      const categories = resCategories.map(seller => ({
        ...seller,
        name: seller.name,
        imageUrl: `/consumer/sellers/${seller.id}/upload/1/images/0`
      }));
      this.setState({ emptyMessage: result1.message });
      let sellerIndex = 0;
      if (defaultSeller) {
        sellerIndex = categories.findIndex(
          category => category.id == defaultSeller.id
        );
      }

      //
      if (defaultSellerIdFromNotifications) {
        sellerIndex = categories.findIndex(
          category => category.id == defaultSellerIdFromNotifications
        );
      }
      //

      this.setState(
        {
          categories,
          selectedCategory:
            sellerIndex > -1 ? result1.result[sellerIndex] : result1.result[0]
        },

        () => {
          if (this.state.categories.length > 0) {
            this.fetchOffersType_0();
            this.fetchOffersType_1();
            this.fetchOffersType_2();
            this.fetchOffersType_3();
            this.fetchOffersType_4();
          }
        }
      );
    } catch (error) {
      console.log("ERROR IN SELLER OFFERS API: ", error);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  fetchOffersType_0 = async () => {
    const { selectedCategory } = this.state;
    try {
      const res = await getOffers(selectedCategory.id, 0);
      this.setState({ newProducts: res.result });
      //console.log("RESULT IN OFFER FETCH API: ", res);
    } catch (error) {
      console.log("ERROR IN OFFER FETCH API", error);
    } finally {
      console.log("done");
    }
  };

  fetchOffersType_1 = async () => {
    const { selectedCategory } = this.state;
    try {
      const res = await getOffers(selectedCategory.id, 1);
      this.setState({ discountOffers: res.result });
      //console.log("RESULT IN OFFER FETCH API: ", res);
    } catch (error) {
      console.log("ERROR IN OFFER FETCH API", error);
    } finally {
      console.log("done");
    }
  };

  fetchOffersType_2 = async () => {
    const { selectedCategory } = this.state;
    try {
      const res = await getOffers(selectedCategory.id, 2);
      this.setState({ bogo: res.result });
      //console.log("RESULT IN OFFER FETCH API: ", res);
    } catch (error) {
      console.log("ERROR IN OFFER FETCH API", error);
    } finally {
      console.log("done");
    }
  };

  fetchOffersType_3 = async () => {
    const { selectedCategory } = this.state;
    try {
      const res = await getOffers(selectedCategory.id, 3);
      this.setState({ extraQuantity: res.result });
      //console.log("RESULT IN OFFER FETCH API: ", res);
    } catch (error) {
      console.log("ERROR IN OFFER FETCH API", error);
    } finally {
      console.log("done");
    }
  };

  fetchOffersType_4 = async () => {
    const { selectedCategory } = this.state;
    try {
      const res = await getOffers(selectedCategory.id, 4);
      this.setState({ generalOffers: res.result });
      //console.log("RESULT IN OFFER FETCH API: ", res);
    } catch (error) {
      console.log("ERROR IN OFFER FETCH API", error);
    } finally {
      console.log("done");
    }
  };

  onCategorySelect = category => {
    this.setState({ isLoading: true });
    this.props.getWishList();
    this.setState(
      {
        selectedCategory: category
      },
      () => {
        this.fetchOffersType_0();
        this.fetchOffersType_1();
        this.fetchOffersType_2();
        this.fetchOffersType_3();
        this.fetchOffersType_4();
      }
    );
    this.setState({ isLoading: false });
  };

  renderNewProducts = ({ item, index }) => {
    const { selectedCategory } = this.state;
    const { wishList, getWishList } = this.props;
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
    const { selectedCategory } = this.state;
    const { wishList, getWishList } = this.props;
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
    const { selectedCategory } = this.state;
    const { wishList, getWishList } = this.props;
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
    const { selectedCategory } = this.state;
    const { wishList, getWishList } = this.props;
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
    } = this.state;
    if (error) {
      return <ErrorOverlay error={error} onRetryPress={this.fetchCategories} />;
    }

    return (
      <View style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
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
              onItemSelect={this.onCategorySelect}
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
        {isLoading == false && categories.length > 0 ? (
          <ScrollableTabView
            renderTabBar={() => (
              <DefaultTabBar
                style={{
                  height: 35,
                  marginTop: 125,
                  backgroundColor: "#fff",
                  padding: 5,
                  paddingTop: 0
                }}
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
            <View tabLabel="Discount">
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
                      marginTop: 175,
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
                    No Offers available as of now from your Seller currently
                  </Text>
                </View>
              )}
            </View>
            <View tabLabel="BOGO">
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
                      marginTop: 175,
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
                    No Offers available as of now from your Seller currently
                  </Text>
                </View>
              )}
            </View>
            <View tabLabel="Extra">
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
                      marginTop: 175,
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
                    No Offers available as of now from your Seller currently
                  </Text>
                </View>
              )}
            </View>
            <View tabLabel="New Products">
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
                      marginTop: 175,
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
                    No New Products available as of now from your Seller
                    currently
                  </Text>
                </View>
              )}
            </View>
            <View tabLabel="General">
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
                      marginTop: 175,
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
                    No Offers available as of now from your Seller currently
                  </Text>
                </View>
              )}
            </View>
          </ScrollableTabView>
        ) : null}

        <LoadingOverlay visible={isLoading} />
      </View>
    );
  }
}

// import React from "react";
// import {
//   View,
//   ScrollView,
//   FlatList,
//   Animated,
//   Image,
//   Dimensions,
//   AsyncStorage
// } from "react-native";
// import ScrollableTabView, {
//   DefaultTabBar
// } from "react-native-scrollable-tab-view";
// import AppIntroSlider from "react-native-app-intro-slider";
// import Snackbar from "../../utils/snackbar";
// import { Text } from "../../elements";
// import ErrorOverlay from "../../components/error-overlay";
// import LoadingOverlay from "../../components/loading-overlay";
// import ItemSelector from "../../components/item-selector";
// import Tag from "../../components/tag";
// import {
//   API_BASE_URL,
//   fetchOfferCategories,
//   fetchCategoryOffers,
//   getSellerOffers,
//   getOffers,
//   getSkuWishList
// } from "../../api";
// import moment from "moment";
// import I18n from "../../i18n";

// import { colors, defaultStyles } from "../../theme";
// import OfferCategory from "./offer-category";
// import OfferDetailedItem from "./offer-detailed-item";
// import OffersModal from "./offers-modal";
// import OffersFilterModal from "./offers-filter-modal";
// import Analytics from "../../analytics";
// import SkuItemOffer from "./single-sku-offer";
// import SingleNormalOffer from "./single-normal-offer";
// import SingleBogoOffer from "./single-bogo-offer";
// import SingleExtraQuantityOffer from "./single-extra-quant-offer";
// const windowWidth = Dimensions.get("window").width;
// const windowHeight = Dimensions.get("window").height;
// const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

// const ITEM_SELECTOR_HEIGHT = 120;
// // const ITEM_SELECTOR_HEIGHT_WITH_FILTERS = ITEM_SELECTOR_HEIGHT + 36;
// const MAX_HEADER_HEIGHT = 140;
// const MIN_HEADER_HEIGHT = 0;
// const HEADER_SCROLL_DISTANCE = MAX_HEADER_HEIGHT - MIN_HEADER_HEIGHT;

// export default class OffersTab extends React.Component {
//   lastListScrollPosition = 0;
//   listScrollPosition = new Animated.Value(0);
//   topPaddingElement = new Animated.Value(0);

//   state = {
//     categories: [],
//     selectedCategory: null,
//     isLoading: false,
//     error: null,
//     discountOffers: [],
//     bogo: [],
//     extraQuantity: [],
//     generalOffers: [],
//     wishList: [],
//     emptyMessage: null,
//     scrollY: new Animated.Value(0)
//   };

//   componentDidMount() {
//     this.didFocusSubscription = this.props.navigation.addListener(
//       "didFocus",
//       () => {
//         this.fetchCategories();
//       }
//     );
//   }

//   componentWillUnmount() {
//     this.didFocusSubscription.remove();
//   }

//   fetchCategories = async () => {
//     this.setState({
//       isLoading: true,
//       error: null,
//       selectedCategory: null,
//       discountOffers: [],
//       bogo: [],
//       extraQuantity: [],
//       generalOffers: []
//     });

//     //
//     const defaultSellerIdFromNotifications = this.props.navigation.getParam(
//       "defaultSellerIdFromNotifications",
//       null
//     );
//     //

//     try {
//       const defaultSeller = JSON.parse(
//         await AsyncStorage.getItem("defaultSeller")
//       );
//       const result1 = await getSellerOffers();
//       console.log("Seller Offer API result: ", result1);
//       let resCategories = result1.result;
//       const categories = resCategories.map(seller => ({
//         ...seller,
//         name: seller.name,
//         imageUrl: `/consumer/sellers/${seller.id}/upload/1/images/0`
//       }));
//       this.setState({ emptyMessage: result1.message });
//       let sellerIndex = 0;
//       if (defaultSeller) {
//         sellerIndex = categories.findIndex(
//           category => category.id == defaultSeller.id
//         );
//       }

//       //
//       if (defaultSellerIdFromNotifications) {
//         sellerIndex = categories.findIndex(
//           category => category.id == defaultSellerIdFromNotifications
//         );
//       }
//       //

//       this.setState(
//         {
//           categories,
//           selectedCategory:
//             sellerIndex > -1 ? result1.result[sellerIndex] : result1.result[0]
//         },

//         () => {
//           if (this.state.categories.length > 0) {
//             this.fetchOffersType_1();
//             this.fetchOffersType_2();
//             this.fetchOffersType_3();
//             this.fetchOffersType_4();
//           }
//         }
//       );
//     } catch (error) {
//       console.log("ERROR IN SELLER OFFERS API: ", error);
//     } finally {
//       this.setState({ isLoading: false });
//     }
//   };

//   fetchOffersType_1 = async () => {
//     const { selectedCategory } = this.state;
//     try {
//       const res = await getOffers(selectedCategory.id, 1);
//       this.setState({ discountOffers: res.result });
//       //console.log("RESULT IN OFFER FETCH API: ", res);
//     } catch (error) {
//       console.log("ERROR IN OFFER FETCH API", error);
//     } finally {
//       console.log("done");
//     }
//   };

//   fetchOffersType_2 = async () => {
//     const { selectedCategory } = this.state;
//     try {
//       const res = await getOffers(selectedCategory.id, 2);
//       this.setState({ bogo: res.result });
//       //console.log("RESULT IN OFFER FETCH API: ", res);
//     } catch (error) {
//       console.log("ERROR IN OFFER FETCH API", error);
//     } finally {
//       console.log("done");
//     }
//   };

//   fetchOffersType_3 = async () => {
//     const { selectedCategory } = this.state;
//     try {
//       const res = await getOffers(selectedCategory.id, 3);
//       this.setState({ extraQuantity: res.result });
//       //console.log("RESULT IN OFFER FETCH API: ", res);
//     } catch (error) {
//       console.log("ERROR IN OFFER FETCH API", error);
//     } finally {
//       console.log("done");
//     }
//   };

//   fetchOffersType_4 = async () => {
//     const { selectedCategory } = this.state;
//     try {
//       const res = await getOffers(selectedCategory.id, 4);
//       this.setState({ generalOffers: res.result });
//       //console.log("RESULT IN OFFER FETCH API: ", res);
//     } catch (error) {
//       console.log("ERROR IN OFFER FETCH API", error);
//     } finally {
//       console.log("done");
//     }
//   };

//   onCategorySelect = category => {
//     this.setState({ isLoading: true });
//     this.props.getWishList();
//     this.setState(
//       {
//         selectedCategory: category
//       },
//       () => {
//         this.fetchOffersType_1();
//         this.fetchOffersType_2();
//         this.fetchOffersType_3();
//         this.fetchOffersType_4();
//       }
//     );
//     this.setState({ isLoading: false });
//   };

//   renderDiscountOffers = ({ item, index }) => {
//     const { selectedCategory } = this.state;
//     const { wishList, getWishList } = this.props;
//     return (
//       <SkuItemOffer
//         key={index}
//         item={item}
//         wishList={wishList}
//         selectedCategory={selectedCategory}
//         getWishList={getWishList}
//       />
//     );
//   };

//   renderBogoOffers = ({ item, index }) => {
//     const { selectedCategory } = this.state;
//     const { wishList, getWishList } = this.props;
//     return (
//       <SingleBogoOffer
//         key={index}
//         item={item}
//         wishList={wishList}
//         selectedCategory={selectedCategory}
//         getWishList={getWishList}
//       />
//     );
//   };

//   renderExtraQuantityOffers = ({ item, index }) => {
//     const { selectedCategory } = this.state;
//     const { wishList, getWishList } = this.props;
//     return (
//       <SingleExtraQuantityOffer
//         key={index}
//         item={item}
//         wishList={wishList}
//         selectedCategory={selectedCategory}
//         getWishList={getWishList}
//       />
//     );
//   };

//   renderGeneralOffers = ({ item, index }) => {
//     return <SingleNormalOffer key={index} item={item} />;
//   };

//   render() {
//     const {
//       categories,
//       selectedCategory,
//       isLoading,
//       error,
//       discountOffers,
//       bogo,
//       extraQuantity,
//       generalOffers,
//       emptyMessage,
//       scrollY
//     } = this.state;

//     const headerHeight = scrollY.interpolate({
//       inputRange: [0, HEADER_SCROLL_DISTANCE],
//       outputRange: [MAX_HEADER_HEIGHT, MIN_HEADER_HEIGHT],
//       extrapolate: "clamp"
//     });

//     console.log("Header Height in Animation_________", headerHeight);
//     if (error) {
//       return <ErrorOverlay error={error} onRetryPress={this.fetchCategories} />;
//     }

//     return (
//       <View style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
//         {categories.length == 0 ? (
//           <View
//             style={[
//               {
//                 height: windowHeight,
//                 flex: 1,
//                 alignItems: "center",
//                 justifyContent: "center"
//               }
//             ]}
//           >
//             <Image
//               style={{ width: 150, height: 150 }}
//               source={require("../../images/empty_offers.png")}
//               resizeMode="contain"
//             />
//             <Text
//               //weight="Medium"
//               style={{
//                 padding: 20,
//                 fontSize: 16,
//                 textAlign: "center",
//                 marginTop: 5,
//                 color: colors.secondaryText
//               }}
//             >
//               {emptyMessage}
//             </Text>
//           </View>
//         ) : (
//           <View
//             style={{
//               flex: 1
//             }}
//           >
//             {isLoading == false && categories.length > 0 ? (
//               <ScrollableTabView
//                 style={{
//                   marginTop: MAX_HEADER_HEIGHT - 15
//                 }}
//                 renderTabBar={() => (
//                   <DefaultTabBar
//                     style={{
//                       height: 25,
//                       backgroundColor: "#fff",
//                       padding: 5,
//                       paddingTop: 0
//                     }}
//                     inactiveTextColor="#aaa"
//                     activeTextColor="#009ee5"
//                   />
//                 )}
//                 tabBarUnderlineStyle={{
//                   backgroundColor: colors.mainBlue,
//                   height: 2
//                 }}
//                 ref={node => {
//                   this.scrollableTabView = node;
//                 }}
//                 tabBarBackgroundColor="transparent"
//                 tabBarTextStyle={{
//                   fontSize: 13,
//                   fontFamily: `Roboto-Bold`,
//                   marginTop: 8
//                 }}
//               >
//                 <View tabLabel="Discount">
//                   {discountOffers.length > 0 ? (
//                     <FlatList
//                       contentContainerStyle={{
//                         paddingTop: 0
//                       }}
//                       style={{
//                         marginTop: 5
//                       }}
//                       scrollEventThrottle={16}
//                       onScroll={Animated.event([
//                         {
//                           nativeEvent: {
//                             contentOffset: { y: this.state.scrollY }
//                           }
//                         }
//                       ])}
//                       data={discountOffers}
//                       keyExtractor={item => item.id}
//                       renderItem={this.renderDiscountOffers}
//                     />
//                   ) : (
//                     <View
//                       style={[
//                         {
//                           flex: 1,
//                           marginTop: 175,
//                           alignItems: "center",
//                           justifyContent: "center"
//                         }
//                       ]}
//                     >
//                       <Image
//                         style={{ width: 150, height: 150 }}
//                         source={require("../../images/empty_offers.png")}
//                         resizeMode="contain"
//                       />
//                       <Text
//                         style={{
//                           padding: 20,
//                           fontSize: 16,
//                           textAlign: "center",
//                           color: colors.secondaryText
//                         }}
//                       >
//                         No Offers available as of now from your Seller currently
//                       </Text>
//                     </View>
//                   )}
//                 </View>
//                 <View tabLabel="BOGO">
//                   {bogo.length > 0 ? (
//                     <FlatList
//                       contentContainerStyle={{
//                         paddingTop: 0
//                       }}
//                       style={{
//                         marginTop: 5
//                       }}
//                       data={bogo}
//                       keyExtractor={item => item.id}
//                       renderItem={this.renderBogoOffers}
//                     />
//                   ) : (
//                     <View
//                       style={[
//                         {
//                           flex: 1,
//                           marginTop: 175,
//                           alignItems: "center",
//                           justifyContent: "center"
//                         }
//                       ]}
//                     >
//                       <Image
//                         style={{ width: 150, height: 150 }}
//                         source={require("../../images/empty_offers.png")}
//                         resizeMode="contain"
//                       />
//                       <Text
//                         style={{
//                           padding: 20,
//                           fontSize: 16,
//                           textAlign: "center",
//                           color: colors.secondaryText
//                         }}
//                       >
//                         No Offers available as of now from your Seller currently
//                       </Text>
//                     </View>
//                   )}
//                 </View>
//                 <View tabLabel="Extra">
//                   {extraQuantity.length > 0 ? (
//                     <FlatList
//                       contentContainerStyle={{
//                         paddingTop: 0
//                       }}
//                       style={{
//                         marginTop: 5
//                       }}
//                       data={extraQuantity}
//                       keyExtractor={item => item.id}
//                       renderItem={this.renderExtraQuantityOffers}
//                     />
//                   ) : (
//                     <View
//                       style={[
//                         {
//                           flex: 1,
//                           marginTop: 175,
//                           alignItems: "center",
//                           justifyContent: "center"
//                         }
//                       ]}
//                     >
//                       <Image
//                         style={{ width: 150, height: 150 }}
//                         source={require("../../images/empty_offers.png")}
//                         resizeMode="contain"
//                       />
//                       <Text
//                         style={{
//                           padding: 20,
//                           fontSize: 16,
//                           textAlign: "center",
//                           color: colors.secondaryText
//                         }}
//                       >
//                         No Offers available as of now from your Seller currently
//                       </Text>
//                     </View>
//                   )}
//                 </View>
//                 <View tabLabel="General">
//                   {generalOffers.length > 0 ? (
//                     <FlatList
//                       contentContainerStyle={{
//                         paddingTop: 0
//                       }}
//                       style={{ marginTop: 5 }}
//                       data={generalOffers}
//                       keyExtractor={item => item.id}
//                       renderItem={this.renderGeneralOffers}
//                     />
//                   ) : (
//                     <View
//                       style={[
//                         {
//                           flex: 1,
//                           marginTop: 175,
//                           alignItems: "center",
//                           justifyContent: "center"
//                         }
//                       ]}
//                     >
//                       <Image
//                         style={{ width: 150, height: 150 }}
//                         source={require("../../images/empty_offers.png")}
//                         resizeMode="contain"
//                       />
//                       <Text
//                         style={{
//                           padding: 20,
//                           fontSize: 16,
//                           textAlign: "center",
//                           color: colors.secondaryText
//                         }}
//                       >
//                         No Offers available as of now from your Seller currently
//                       </Text>
//                     </View>
//                   )}
//                 </View>
//               </ScrollableTabView>
//             ) : null}
//             <Animated.View
//               style={[
//                 {
//                   zIndex: 2,
//                   position: "absolute",
//                   top: 0,
//                   left: 0,
//                   right: 0,
//                   marginTop: headerHeight <= 15 ? 0 : -15,
//                   overflow: "hidden"
//                 },
//                 { height: headerHeight }
//               ]}
//             >
//               <ItemSelector
//                 style={{ backgroundColor: "#fff" }}
//                 selectModalTitle="Select a Category"
//                 items={categories}
//                 selectedItem={selectedCategory}
//                 onItemSelect={this.onCategorySelect}
//                 startOthersAfterCount={4}
//               />
//             </Animated.View>
//           </View>
//         )}
//         <LoadingOverlay visible={isLoading} />
//       </View>
//     );
//   }
// }
