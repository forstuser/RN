import React, { Component } from "react";
import {
  View,
  FlatList,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput
} from "react-native";
import moment from "moment";
import { API_BASE_URL, getSearchResults } from "../api";
import ProductsList from "../components/products-list";
import { ScreenContainer, Text, Button, AsyncImage } from "../elements";
import { colors } from "../theme";
import { openBillsPopUp } from "../navigation";

const backIcon = require("../images/ic_arrow_back_black.png");

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
            ref={ref => (this.textInput = ref)}
            autoFocus={true}
            onFocus={() => this.setState({ showRecentSearches: true })}
            onBlur={() => this.setState({ showRecentSearches: false })}
            onSubmitEditing={this.fetchResults}
            value={this.state.textInput}
            onChangeText={text => this.setState({ textInput: text })}
            style={styles.searchTextInput}
            placeholder="Search..."
          />
        </View>
        {showRecentSearches && (
          <View style={styles.recentSearches}>
            <View style={styles.recentSearchTitleWrapper}>
              <Text weight="Bold" style={styles.recentSearchTitle}>
                RECENT SEARCHES
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
        {searchHasRunOnce && (
          <ProductsList
            onRefresh={this.fetchResults}
            isLoading={isFetchingResults}
            products={products}
            navigator={this.props.navigator}
          />
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
    marginTop: 20,
    paddingLeft: 15,
    alignItems: "center",
    zIndex: 2
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
    top: 70,
    borderColor: "#ececec",
    borderBottomWidth: 1
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
