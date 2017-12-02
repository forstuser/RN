import React, { Component } from "react";
import { Platform, StyleSheet, View, FlatList, Alert } from "react-native";
import { API_BASE_URL, consumerGetEhome } from "../api";
import { Text, Button, ScreenContainer } from "../elements";
import LoadingOverlay from "../components/loading-overlay";
import SearchHeader from "../components/search-header";
import CategoryItem from "../components/ehome-category-item";
import ProcessingItems from "../components/ehome-processing-items.js";

class EhomeScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true,
    tabBarHidden: false
  };
  constructor(props) {
    super(props);
    this.state = {
      isGettingEhomeData: false,
      categoriesList: [],
      pendingDocs: [],
      notificationCount: 0
    };
  }
  async componentDidMount() {
    this.setState({
      isGettingEhomeData: true
    });
    try {
      const ehomeData = await consumerGetEhome();
      const categoriesList = ehomeData.categoryList.map(item => {
        return {
          imageUrl: API_BASE_URL + "/" + item.categoryImageUrl + "1",
          id: item.id,
          name: item.name,
          itemsCount: item.productCounts,
          lastUpdatedTime: item.cLastUpdate,
          subCategories: item.subCategories
        };
      });
      this.setState({
        notificationCount: ehomeData.notificationCount,
        recentSearches: ehomeData.recentSearches,
        categoriesList: categoriesList,
        pendingDocs: ehomeData.unProcessedBills
      });
    } catch (e) {}
    this.setState({
      isGettingEhomeData: false
    });
  }

  openMainCategoryScreen = category => {
    this.props.navigator.push({
      screen: "MainCategoryScreen",
      passProps: {
        category
      }
    });
  };

  openDocsUnderProcessingScreen = () => {
    this.props.navigator.push({
      screen: "DocsUnderProcessingScreen",
      passProps: {
        pendingDocs: this.state.pendingDocs
      }
    });
  };

  renderCategoryItem = ({ item }) => (
    <CategoryItem
      {...item}
      onPress={() => {
        this.openMainCategoryScreen(item);
      }}
    />
  );
  render() {
    return (
      <ScreenContainer style={{ padding: 0, backgroundColor: "#fafafa" }}>
        <SearchHeader
          navigator={this.props.navigator}
          screen="ehome"
          notificationCount={this.state.notificationCount}
          recentSearches={this.state.recentSearches}
        />
        <ProcessingItems
          onPress={this.openDocsUnderProcessingScreen}
          itemsCount={this.state.pendingDocs.length}
        />
        <View style={{ flex: 1 }}>
          <FlatList
            style={{ paddingHorizontal: 16 }}
            data={this.state.categoriesList}
            keyExtractor={(item, index) => item.id}
            renderItem={this.renderCategoryItem}
          />
        </View>
        <LoadingOverlay visible={this.state.isGettingEhomeData} />
      </ScreenContainer>
    );
  }
}

export default EhomeScreen;
