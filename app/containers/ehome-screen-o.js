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
  static navigationOptions = {
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
  }

  componentDidMount() {
    Analytics.logEvent(Analytics.EVENTS.OPEN_EHOME);
    this.fetchEhomeData();

    this.didFocusSubscription = this.props.navigation.addListener(
      "didFocus",
      () => {
        this.screenHasDisappeared = false;
        this.fetchEhomeData();
      }
    );

    this.willBlurSubscription = this.props.navigation.addListener(
      "willBlur",
      () => {
        this.screenHasDisappeared = true;
      }
    );
  }

  componentWillUnmount() {
    this.didFocusSubscription.remove();
    this.willBlurSubscription.remove();
  }

  fetchEhomeData = async () => {
    this.setState({
      error: null
    });
    try {
      const ehomeData = await consumerGetEhome();
      const categoriesList = ehomeData.categoryList.map(item => {
        return {
          imageUrl: API_BASE_URL + item.categoryImageUrl,
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

          if (
            !this.props.hasEhomeTourShown &&
            !this.screenHasDisappeared &&
            this.ehomeTour
          ) {
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
    this.props.navigation.navigate(SCREENS.MAIN_CATEGORY_SCREEN, {
      category
    });
  };

  openDocsUnderProcessingScreen = () => {
    this.props.navigation.navigate(SCREENS.DOCS_UNDER_PROCESSING_SCREEN, {
      pendingDocs: this.state.pendingDocs
    });
  };

  renderCategoryItem = ({ item }) => (
    <CategoryItem
      {...item}
      onPress={() => {
        // Analytics.logEvent(Analytics.EVENTS.OPEN_EHOME_CATEGORY, {
        //   main_category: item.id
        // });
        this.openMainCategoryScreen(item);
      }}
    />
  );

  showAddProductOptionsScreen = () => {
    Analytics.logEvent(Analytics.EVENTS.CLICK_PLUS_ICON);
    //use push here so that we can use 'replace' later
    this.props.navigation.push(SCREENS.ADD_PRODUCT_SCREEN);
  };

  render() {
    const { error, isFetchingData } = this.state;
    if (error) {
      return <ErrorOverlay error={error} onRetryPress={this.fetchEhomeData} />;
    }
    return (
      <ScreenContainer style={{ padding: 0 }}>
        <TabSearchHeader
          navigation={this.props.navigation}
          title={I18n.t("ehome_screen_title")}
          icon={eHomeIcon}
          notificationCount={this.state.notificationCount}
          recentSearches={this.state.recentSearches}
          mailboxIconRef={ref => (this.mailboxIconRef = ref)}
        />
        <View collapsable={false} style={{ flex: 1, marginVertical: 10 }}>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EhomeScreen);
