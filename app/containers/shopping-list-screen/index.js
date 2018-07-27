import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import ScrollableTabView, {
  ScrollableTabBar
} from "react-native-scrollable-tab-view";

import { Text, Image } from "../../elements";
import DrawerScreenContainer from "../../components/drawer-screen-container";

import { getSkuReferenceData, getSkuItems } from "../../api";

import BlankShoppingList from "./blank-shopping-list";
import SearchBar from "./search-bar";
import TabContent from "./tab-content";

import { colors } from "../../theme";

class ShoppingListScreen extends React.Component {
  state = {
    measurementTypes: {},
    mainCategories: [],
    activeMainCategoryId: null,
    skuData: {}
  };

  componentDidMount() {
    this.loadReferenceData();
  }

  updateStateMainCategory = (index, data) => {
    const mainCategories = [...this.state.mainCategories];
    mainCategories[index] = { ...mainCategories[index], ...data };
    this.setState(() => ({ mainCategories }));
  };

  loadReferenceData = async () => {
    try {
      const res = await getSkuReferenceData();
      let measurementTypes = {};
      res.result.measurement_types.forEach(measurementType => {
        measurementTypes[measurementType.id] = measurementType;
      });
      this.setState({
        mainCategories: res.result.main_categories,
        measurementTypes
      });
    } catch (e) {
      console.log(e);
    }
  };

  updateStateSkuData = (categoryId, data) => {
    const skuData = [...this.state.skuData];
    if (!skuData[categoryId]) {
      skuData[categoryId] = data;
    } else {
      skuData[categoryId] = { ...skuData[categoryId], ...data };
    }

    this.setState(() => ({ skuData }));
  };

  loadSkuItems = async ({ categoryId }) => {
    this.updateStateSkuData(categoryId, { isLoading: true, error: null });
    try {
      const res = await getSkuItems({ categoryId });
      this.updateStateSkuData(categoryId, {
        isLoading: false,
        items: res.result
      });
    } catch (error) {
      console.log(error);
      this.updateStateSkuData(categoryId, { isLoading: false, error });
    }
  };

  onTabChange = ({ i }) => {
    this.setState({ activeMainCategoryId: this.state.mainCategories[i].id });
  };

  render() {
    const { navigation } = this.props;
    const { measurementTypes, mainCategories, skuData } = this.state;

    return (
      <DrawerScreenContainer
        title="Create Shopping List"
        navigation={navigation}
        headerRight={
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <TouchableOpacity style={{ paddingHorizontal: 5 }}>
              <Icon
                style={{ marginTop: 1 }}
                name="ios-barcode-outline"
                size={30}
                color="#fff"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{ paddingHorizontal: 5, marginHorizontal: 5 }}
            >
              <Image
                tintColor="#fff"
                style={{ width: 20, height: 20 }}
                source={require("../../images/blank_shopping_list.png")}
              />
            </TouchableOpacity>
          </View>
        }
      >
        {/* <BlankShoppingList navigation={navigation} /> */}
        <View style={{ flex: 1 }}>
          <SearchBar />
          <ScrollableTabView
            locked={true}
            onChangeTab={this.onTabChange}
            renderTabBar={() => (
              <ScrollableTabBar
                style={{ height: 30 }}
                tabStyle={{ height: 30 }}
              />
            )}
            tabBarUnderlineStyle={{
              height: 0
            }}
            tabBarBackgroundColor={colors.lightBlue}
            tabBarActiveTextColor={colors.mainBlue}
            tabBarTextStyle={{
              fontSize: 10,
              fontFamily: `Quicksand-Regular`,
              padding: 0
            }}
          >
            {mainCategories.map((mainCategory, index) => (
              <TabContent
                key={mainCategory.id}
                tabLabel={mainCategory.title}
                measurementTypes={measurementTypes}
                mainCategory={mainCategory}
                updateMainCategoryInParent={data =>
                  this.updateStateMainCategory(index, data)
                }
                loadSkuItems={this.loadSkuItems}
                skuData={skuData}
              />
            ))}
          </ScrollableTabView>
        </View>
      </DrawerScreenContainer>
    );
  }
}

export default ShoppingListScreen;
