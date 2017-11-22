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
    navBarHidden: true
  };
  constructor(props) {
    super(props);
    this.state = {
      isGettingEhomeData: false,
      categoriesList: []
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
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
        categoriesList: categoriesList
      });
    } catch (e) {}
    this.setState({
      isGettingEhomeData: false
    });
  }

  onNavigatorEvent = event => {
    switch (event.id) {
      case "didAppear":
        this.props.navigator.toggleTabs({
          to: "shown", // required, 'hidden' = hide tab bar, 'shown' = show tab bar
          animated: true // does the toggle have transition animation or does it happen immediately (optional)
        });
        break;
    }
  };

  openMainCategoryScreen = category => {
    this.props.navigator.push({
      screen: "MainCategoryScreen",
      passProps: {
        category
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
        <SearchHeader screen="ehome" />
        <ProcessingItems />
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
