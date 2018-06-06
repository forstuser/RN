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
import ScrollableTabView, {
  DefaultTabBar
} from "react-native-scrollable-tab-view";
import I18n from "../../i18n";
import { API_BASE_URL, getAccessoriesCategory } from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";
import TabSearchHeader from "../../components/tab-screen-header";
import Analytics from "../../analytics";
import { SCREENS } from "../../constants";
import { colors, defaultStyles } from "../../theme";
import ItemSelector from "../../components/item-selector";
const offersIcon = require("../../images/buy.png");

class DealsScreen extends Component {
  static navigationOptions = {
    navBarHidden: true
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
  }
  componentDidMount() {
    this.fetchAccessoriesData();
  }

  fetchAccessoriesData = async () => {
    this.setState({
      isLoading: true,
      error: null
    });
    try {
      const res = await getAccessoriesCategory();
      console.log("res", res);
      // this.setState(
      //   {
      //     serviceTypes: res.items,
      //     visibleServiceTypeIds: res.default_ids
      //   },
      //   () => {
      //     this.setVisibleOptions();
      //   }
      // );
    } catch (error) {
      this.setState({
        error
      });
    }
    this.setState({
      isLoading: false
    });
  };

  render() {
    return (
      <ScreenContainer style={styles.container}>
        <View collapsable={false} style={styles.header}>
          <TabSearchHeader
            title={"Offers & Accessories"}
            icon={offersIcon}
            navigation={this.props.navigation}
            showMailbox={false}
            showSearchInput={false}
          />
        </View>
        <ItemSelector />
        <ScrollableTabView
          tabBarBackgroundColor={colors.pinkishOrange}
          tabBarActiveTextColor="#fff"
          tabBarInactiveTextColor="#fff"
          initialPage={0}
          renderTabBar={() => <DefaultTabBar />}
        >
          <View tabLabel="Offers" />
          <Text tabLabel="Accessories">favorite</Text>
        </ScrollableTabView>
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0
    // backgroundColor: colors.pinkishOrange
  },
  header: {
    paddingBottom: 0,
    width: "100%",
    ...Platform.select({
      ios: {
        zIndex: 1
      },
      android: {}
    })
  },
  tabContainer: {
    flexDirection: "row",
    flex: 1
  },
  tab: {
    flex: 1,
    height: 40,
    backgroundColor: colors.pinkishOrange
  }
});

export default DealsScreen;
