import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  FlatList,
  Alert,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions
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
import OffersTab from "./offers-tab";
import AccessoriesTab from "./accessories-tab";
const offersIcon = require("../../images/buy.png");

const SCREEN_WIDTH = Dimensions.get("window").width;

class DealsScreen extends Component {
  static navigationOptions = {
    navBarHidden: true
  };

  tabIndex = new Animated.Value(0);

  constructor(props) {
    super(props);
    this.state = {};
  }

  openPage1 = () => {
    Animated.timing(this.tabIndex, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  openPage2 = () => {
    Animated.timing(this.tabIndex, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  render() {
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
            <TouchableOpacity onPress={this.openPage1} style={styles.tab}>
              <Text weight="Bold" style={styles.tabText}>
                Offers
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.openPage2} style={styles.tab}>
              <Text weight="Bold" style={styles.tabText}>
                Accessories
              </Text>
            </TouchableOpacity>
            <Animated.View
              style={[
                styles.tabUnderline,
                {
                  transform: [
                    {
                      translateX: this.tabIndex.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, SCREEN_WIDTH / 2]
                      })
                    }
                  ]
                }
              ]}
            />
          </View>
          {/* <TabSearchHeader
            title={"Offers & Accessories"}
            icon={offersIcon}
            navigation={this.props.navigation}
            showMailbox={false}
            showSearchInput={false}
          /> */}
        </View>

        <Animated.View
          style={[
            styles.pages,
            {
              transform: [
                {
                  translateX: this.tabIndex.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -SCREEN_WIDTH]
                  })
                }
              ]
            }
          ]}
        >
          <View style={styles.page}>
            <OffersTab />
          </View>
          <View style={styles.page}>
            <AccessoriesTab />
          </View>
        </Animated.View>
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
      ios: { paddingTop: 30 },
      android: { paddingTop: 10 }
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
  tabUnderline: {
    backgroundColor: "#878787",
    height: 3,
    width: "50%",
    position: "absolute",
    left: 0,
    bottom: 0
  },
  tabText: {
    fontSize: 18,
    color: "#fff"
  },
  pages: {
    flex: 1,
    width: SCREEN_WIDTH * 2,
    flexDirection: "row"
  },
  page: {
    width: SCREEN_WIDTH,
    flexDirection: "row"
  }
});

export default DealsScreen;
