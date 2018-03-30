import React, { Component } from "react";
import {
  View,
  FlatList,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Platform
} from "react-native";
import moment from "moment";
import { API_BASE_URL, getSearchResults } from "../api";
import ProductsList from "../components/products-list";
import { ScreenContainer, Text, Button, AsyncImage } from "../elements";
import { colors } from "../theme";
import { openBillsPopUp } from "../navigation";
import I18n from "../i18n";
const backIcon = require("../images/ic_arrow_back_black.png");
const noDocs = require("../images/ic_no_docs.png");

class SearchBox extends Component {
  static navigatorStyle = {
    navBarHidden: true,
    tabBarHidden: true
  };
  constructor(props) {
    super(props);
    this.state = {
      textInput: "",
      isFetchingResults: false,
      products: [],
      showRecentSearches: true,
      searchHasRunOnce: false
    };
  }
  componentDidMount() {}

  fetchResults = async () => {
    if (!this.state.textInput.trim()) {
      return Alert.alert("Please enter text to search");
    }
    this.textInput.blur();
    this.setState({ isFetchingResults: true });
    try {
      const res = await getSearchResults(this.state.textInput);
      this.setState({
        products: res.productDetails,
        isFetchingResults: false,
        searchHasRunOnce: true
      });
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  runSearch = value => {
    this.setState(
      {
        textInput: value
      },
      () => {
        this.fetchResults();
      }
    );
  };

  goBack = () => {
    this.props.navigator.pop();
  };

  render() {
    const {
      products,
      isFetchingResults,
      showRecentSearches,
      searchHasRunOnce
    } = this.state;
    const { recentSearches = [] } = this.props;
    return (
      <ScreenContainer style={{ padding: 0 }}>
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={this.goBack} style={{ zIndex: 2 }}>
            <Image style={styles.searchIcon} source={backIcon} />
          </TouchableOpacity>
          <TextInput
            underlineColorAndroid="transparent"
            ref={ref => (this.textInput = ref)}
            autoFocus={true}
            onFocus={() => this.setState({ showRecentSearches: true })}
            onBlur={() => this.setState({ showRecentSearches: false })}
            onSubmitEditing={this.fetchResults}
            value={this.state.textInput}
            onChangeText={text => this.setState({ textInput: text })}
            style={styles.searchTextInput}
            placeholder={I18n.t("search_screen_placeholder")}
          />
        </View>
        {showRecentSearches && (
          <View style={styles.recentSearches}>
            <View style={styles.recentSearchTitleWrapper}>
              <Text weight="Bold" style={styles.recentSearchTitle}>
                {I18n.t("search_screen_recent_searches")}
              </Text>
            </View>
            {recentSearches.map((recentSearch, index) => (
              <TouchableOpacity
                onPress={() => this.runSearch(recentSearch)}
                key={index}
                style={styles.recentSearchItem}
              >
                <Text style={styles.recentSearchText}>{recentSearch}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {searchHasRunOnce &&
          products.length > 0 && (
            <ProductsList
              onRefresh={this.fetchResults}
              isLoading={isFetchingResults}
              products={products}
              navigator={this.props.navigator}
            />
          )}

        {searchHasRunOnce &&
          products.length == 0 && (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Image source={noDocs} style={{ width: 160, height: 160 }} />
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: `Quicksand-Bold`,
                  color: "#3b3b3b",
                  marginTop: 10
                }}
              >
                No Documents Found
              </Text>
            </View>
          )}
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  searchContainer: {
    height: 56,
    backgroundColor: "#EFF1F7",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
    alignItems: "center",
    zIndex: 2,
    ...Platform.select({
      ios: { marginTop: 20 }
    })
  },
  searchIcon: {
    width: 24,
    height: 24,
    marginRight: 10
  },
  searchTextInput: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    width: "100%",
    fontSize: 16,
    paddingLeft: 50
  },
  recentSearches: {
    position: "absolute",
    backgroundColor: "#FAFAFA",
    zIndex: 2,
    width: "100%",
    borderColor: "#ececec",
    borderBottomWidth: 1,
    ...Platform.select({
      ios: { top: 70 },
      android: { top: 56 }
    })
  },
  recentSearchTitle: {
    fontSize: 12,
    color: colors.secondaryText,
    marginVertical: 12,
    marginHorizontal: 16
  },
  recentSearchItem: {
    borderColor: "#ececec",
    borderTopWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff"
  }
});

export default SearchBox;
