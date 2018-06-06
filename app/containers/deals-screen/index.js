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
import { Text, Button, ScreenContainer, image } from "../../elements";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";
import TabSearchHeader from "../../components/tab-screen-header";
import Analytics from "../../analytics";
import { SCREENS } from "../../constants";
import { colors, defaultStyles } from "../../theme";
import AccessoriesTab from "./accessories-tab";
const offersIcon = require("../../images/buy.png");

class DealsScreen extends Component {
  static navigationOptions = {
    navBarHidden: true
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedTabIndex: 0
    };
  }

  render() {
    const { selectedTabIndex } = this.state;

    return (
      <ScreenContainer style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerUpperHalf}>
            <View style={styles.offersIconWrapper}>
              <Image source={offersIcon} style={styles.offersIcon} />
            </View>
            <Text weight="Medium" style={styles.title}>
              Offers & Accessories
            </Text>
          </View>
          <View style={styles.headerLowerHalf}>
            <TouchableOpacity
              onPress={() => this.setState({ selectedTabIndex: 0 })}
              style={[
                styles.tab,
                selectedTabIndex == 0 ? styles.activeTab : {}
              ]}
            >
              <Text weight="Bold" style={styles.tabText}>
                Offers
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.setState({ selectedTabIndex: 1 })}
              style={[
                styles.tab,
                selectedTabIndex == 1 ? styles.activeTab : {}
              ]}
            >
              <Text weight="Bold" style={styles.tabText}>
                Accessories
              </Text>
            </TouchableOpacity>
          </View>
          {/* <TabSearchHeader
            title={"Offers & Accessories"}
            icon={offersIcon}
            navigation={this.props.navigation}
            showMailbox={false}
            showSearchInput={false}
          /> */}
        </View>

        <AccessoriesTab tabLabel="Accessories" />
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
    height: 110,
    backgroundColor: colors.pinkishOrange,
    ...Platform.select({
      ios: { paddingTop: 29 }
    })
  },
  headerUpperHalf: {
    paddingHorizontal: 16,
    flexDirection: "row",
    flex: 1
  },
  offersIconWrapper: {
    width: 24,
    height: 24,
    backgroundColor: "#fff",
    padding: 2,
    borderRadius: 2,
    marginRight: 5
  },
  offersIcon: {
    width: "100%",
    height: "100%",
    tintColor: colors.pinkishOrange
  },
  title: {
    fontSize: 18,
    color: "#fff"
  },
  headerLowerHalf: {
    height: 40,
    flexDirection: "row"
  },
  tab: {
    flex: 1,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent"
  },
  activeTab: {
    borderBottomColor: "#fff"
  },
  tabText: {
    fontSize: 18,
    color: "#fff"
  }
});

export default DealsScreen;
