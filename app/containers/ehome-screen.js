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
import Analytics from "../analytics";
import Tour from "../components/app-tour";

import I18n from "../i18n";

import { API_BASE_URL, consumerGetEhome } from "../api";
import { Text, Button, ScreenContainer } from "../elements";
import LoadingOverlay from "../components/loading-overlay";
import TabSearchHeader from "../components/tab-screen-header";
import CategoryItem from "../components/ehome-category-item";
import ErrorOverlay from "../components/error-overlay";

import { SCREENS } from "../constants";

import { actions as uiActions } from "../modules/ui";

import { colors } from "../theme";
import AddExpenseModal from "../components/add-expense-modal";

const eHomeIcon = require("../images/ic_nav_ehome_off.png");
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
        this.screenHasDisappeared = false;
        this.fetchEhomeData();
        break;
      case "didDisappear":
        this.screenHasDisappeared = true;
        break;
    }
  };

  componentDidMount() {
    Analytics.logEvent(Analytics.EVENTS.OPEN_EHOME);
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
          // if (this.state.startWithPendingDocsScreen) {
          //   this.setState({
          //     startWithPendingDocsScreen: false
          //   });
          //   this.openDocsUnderProcessingScreen();
          // }

          if (!this.props.hasEhomeTourShown && !this.screenHasDisappeared) {
            this.ehomeTour.startTour();
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
        Analytics.logEvent(Analytics.EVENTS.OPEN_EHOME_CATEGORY, {
          maincategory: item.id
        });
        this.openMainCategoryScreen(item);
      }}
    />
  );

  showAddProductOptionsScreen = () => {
    Analytics.logEvent(Analytics.EVENTS.CLICK_PLUS_ICON);
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
      <ScreenContainer style={{ padding: 0 }}>
        <TabSearchHeader
          navigator={this.props.navigator}
          title={I18n.t("ehome_screen_title")}
          icon={eHomeIcon}
          notificationCount={this.state.notificationCount}
          recentSearches={this.state.recentSearches}
          mailboxIconRef={ref => (this.mailboxIconRef = ref)}
        />
        <View style={{ flex: 1, marginVertical: 10 }}>
          <FlatList
            style={{ paddingHorizontal: 8 }}
            data={this.state.categoriesList}
            keyExtractor={(item, index) => item.id}
            renderItem={this.renderCategoryItem}
          />
        </View>
        <Tour
          ref={ref => (this.ehomeTour = ref)}
          enabled={true}
          steps={[{ ref: this.mailboxIconRef, text: I18n.t("mailbox_tip") }]}
        />
        <TouchableOpacity
          style={styles.fab}
          onPress={() => this.showAddProductOptionsScreen()}
        >
          <Image style={styles.uploadFabIcon} source={uploadFabIcon} />
        </TouchableOpacity>
        <LoadingOverlay visible={isFetchingData} />
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
