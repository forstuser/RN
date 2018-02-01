import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  FlatList,
  Alert,
  TouchableOpacity,
  Image
} from "react-native";
import { connect } from "react-redux";

import Tour from "../components/app-tour";

import I18n from "../i18n";

import { API_BASE_URL, consumerGetEhome } from "../api";
import { Text, Button, ScreenContainer } from "../elements";
import LoadingOverlay from "../components/loading-overlay";
import SearchHeader from "../components/search-header";
import CategoryItem from "../components/ehome-category-item";
import ProcessingItems from "../components/ehome-processing-items.js";
import ErrorOverlay from "../components/error-overlay";

import { SCREENS } from "../constants";

import { actions as uiActions } from "../modules/ui";

import { colors } from "../theme";
import AddExpenseModal from "../components/add-expense-modal";
const uploadFabIcon = require("../images/ic_upload_fabs.png");

class EhomeScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true,
    tabBarHidden: false
  };
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isFetchingData: true,
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
          this.setState({
            startWithPendingDocsScreen: true
          });
          break;
        case SCREENS.PRODUCT_DETAILS_SCREEN:
          this.props.navigator.push({
            screen: SCREENS.PRODUCT_DETAILS_SCREEN,
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
      error: null
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
          pendingDocs: ehomeData.unProcessedBills,
          isFetchingData: false
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
    } catch (error) {
      this.setState({
        error
      });
    }
    this.setState({
      isFetchingData: false
    });
  };

  openMainCategoryScreen = category => {
    this.props.navigator.push({
      screen: SCREENS.MAIN_CATEGORY_SCREEN,
      passProps: {
        category
      }
    });
  };

  openDocsUnderProcessingScreen = () => {
    this.props.navigator.push({
      screen: SCREENS.DOCS_UNDER_PROCESSING_SCREEN,
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

  showAddProductOptionsScreen = () => {
    this.props.navigator.showModal({
      screen: SCREENS.ADD_PRODUCT_OPTIONS_SCREEN
    });
  };

  render() {
    const { error, isFetchingData } = this.state;
    if (error) {
      return <ErrorOverlay error={error} onRetryPress={this.fetchEhomeData} />;
    }
    return (
      <ScreenContainer style={{ padding: 0, backgroundColor: "#fafafa" }}>
        <LoadingOverlay visible={isFetchingData} />
        <SearchHeader
          navigator={this.props.navigator}
          screen="ehome"
          notificationCount={this.state.notificationCount}
          recentSearches={this.state.recentSearches}
          mailboxIconRef={ref => (this.mailboxIconRef = ref)}
        />
        {false && (
          <ProcessingItems
            setRef={ref => (this.processingItemsRef = ref)}
            onPress={this.openDocsUnderProcessingScreen}
            itemsCount={this.state.pendingDocs.length}
          />
        )}
        <View style={{ flex: 1, marginTop: 15 }}>
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
        <TouchableOpacity
          style={styles.fab}
          onPress={() => this.showAddProductOptionsScreen()}
        >
          <Image style={styles.uploadFabIcon} source={uploadFabIcon} />
        </TouchableOpacity>
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    zIndex: 2,
    backgroundColor: colors.tomato,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  uploadFabIcon: {
    width: 25,
    height: 25
  }
});

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
