import React, { Component } from "react";
import { Platform, StyleSheet, View, FlatList, Alert } from "react-native";
import { connect } from "react-redux";

import Tour from "../components/app-tour";

import I18n from "../i18n";

import { API_BASE_URL, consumerGetEhome } from "../api";
import { Text, Button, ScreenContainer } from "../elements";
import LoadingOverlay from "../components/loading-overlay";
import SearchHeader from "../components/search-header";
import CategoryItem from "../components/ehome-category-item";
import ProcessingItems from "../components/ehome-processing-items.js";
import { SCREENS } from "../constants";

import { actions as uiActions } from "../modules/ui";

class EhomeScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true,
    tabBarHidden: false
  };
  constructor(props) {
    super(props);
    this.state = {
      isFetchingData: false,
      categoriesList: [],
      pendingDocs: [],
      notificationCount: 0,
      startWithPendingDocsScreen: false
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent = event => {
    switch (event.id) {
      case "didAppear":
        this.fetchEhomeData();
        break;
    }
  };

  componentDidMount() {
    if (this.props.screenOpts) {
      const screenOpts = this.props.screenOpts;
      switch (screenOpts.startScreen) {
        case SCREENS.DOCS_UNDER_PROCESSING_SCREEN:
          this.openDocsUnderProcessingScreen();
          break;
        case SCREENS.PRODUCT_SCREEN:
          this.props.navigator.push({
            screen: "ProductDetailsScreen",
            passProps: {
              productId: screenOpts.productId
            }
          });
          break;
      }
    }
  }

  fetchEhomeData = async () => {
    this.setState({
      isFetchingData: true
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
      this.setState(
        {
          notificationCount: ehomeData.notificationCount,
          recentSearches: ehomeData.recentSearches,
          categoriesList: categoriesList,
          pendingDocs: ehomeData.unProcessedBills
        },
        () => {
          if (this.state.startWithPendingDocsScreen) {
            this.setState({
              startWithPendingDocsScreen: false
            });
            this.openDocsUnderProcessingScreen();
          }

          if (!this.props.hasEhomeTourShown) {
            setTimeout(() => this.ehomeTour.startTour(), 1000);
            this.props.setUiHasEhomeTourShown(true);
          }
        }
      );
    } catch (e) {
      Alert.alert(e.message);
    }
    this.setState({
      isFetchingData: false
    });
  };

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
        <LoadingOverlay visible={this.state.isFetchingData} />
        <SearchHeader
          navigator={this.props.navigator}
          screen="ehome"
          notificationCount={this.state.notificationCount}
          recentSearches={this.state.recentSearches}
          mailboxIconRef={ref => (this.mailboxIconRef = ref)}
        />
        <ProcessingItems
          setRef={ref => (this.processingItemsRef = ref)}
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
        <LoadingOverlay visible={this.state.isFetchingData} />
        <Tour
          ref={ref => (this.ehomeTour = ref)}
          enabled={true}
          steps={[
            { ref: this.mailboxIconRef, text: I18n.t("app_tour_tips_5") },
            { ref: this.processingItemsRef, text: I18n.t("app_tour_tips_4") }
          ]}
        />
      </ScreenContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    hasEhomeTourShown: state.ui.hasEhomeTourShown
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUiHasEhomeTourShown: newValue => {
      dispatch(uiActions.setUiHasEhomeTourShown(newValue));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EhomeScreen);
