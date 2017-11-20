import React, { Component } from "react";
import { Platform, StyleSheet, View, FlatList } from "react-native";
import { connect } from "react-redux";
import { actions as loggedInUserActions } from "../modules/logged-in-user";
import { API_BASE_URL, consumerGetEhome } from "../api";
import { Text, Button, ScreenContainer } from "../elements";
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
      categoriesList: []
    };
  }
  async componentDidMount() {
    try {
      const ehomeData = await consumerGetEhome();
      const categoriesList = ehomeData.categoryList.map(item => {
        return {
          imageUrl: API_BASE_URL + "/" + item.cImageURL + "1",
          type: item.cType,
          name: item.cName,
          itemsCount: item.productCounts,
          lastUpdatedTime: item.cLastUpdate
        };
      });
      this.setState({
        categoriesList: categoriesList
      });
    } catch (e) {}
  }

  renderCategoryItem = ({ item }) => <CategoryItem {...item} />;
  render() {
    return (
      <ScreenContainer style={{ padding: 0, backgroundColor: "#fafafa" }}>
        <SearchHeader screen="ehome" />
        <ProcessingItems />
        <View style={{ flex: 1 }}>
          <FlatList
            style={{ paddingHorizontal: 16 }}
            data={this.state.categoriesList}
            keyExtractor={(item, index) => item.type}
            renderItem={this.renderCategoryItem}
          />
        </View>
      </ScreenContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    authToken: state.loggedInUser.authToken
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTestClick: () => {
      dispatch(loggedInUserActions.setLoggedInUserAuthToken(null));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EhomeScreen);
