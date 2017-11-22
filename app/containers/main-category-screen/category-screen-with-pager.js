import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  FlatList,
  Image,
  Alert,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { getCategoryProducts } from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";

import { TabViewAnimated, TabBar, SceneMap } from "react-native-tab-view";

import ProductList from "../../components/product-list";
import { colors } from "../../theme";

const initialLayout = {
  height: 0,
  width: Dimensions.get("window").width
};

class CategoryWithPager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      pageNo: 1,
      cType: 1,
      index: 0,
      routes: [
        // { key: "first", title: "First" },
        // { key: "second", title: "Second" }
      ]
    };
  }
  async componentDidMount() {
    this.loadProducts();
  }

  loadProducts = async () => {
    try {
      const res = await getCategoryProducts({
        categoryId: this.props.category.id,
        pageNo: this.state.pageNo,
        cType: this.state.cType
      });

      if (this.props.category.id > 2) {
        const categories = res.filterData.categories;
        let tabRoutes = categories.map(category => {
          return {
            key: String(category.cType),
            title: category.name
          };
        });

        this.setState(
          {
            loaded: true,
            routes: tabRoutes
          },
          () => {
            this.forceUpdate();
          }
        );
      }
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  _handleIndexChange = index => this.setState({ index });

  renderTabLabel = ({ route, index }) => {
    return (
      <Text
        weight="Bold"
        style={{
          paddingVertical: 7,
          paddingHorizontal: 14,
          fontSize: 14,
          color:
            index == this.state.index ? colors.mainBlue : colors.secondaryText
        }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {route.title}
      </Text>
    );
  };

  _renderHeader = props => (
    <TabBar
      {...props}
      style={{ backgroundColor: "#fff" }}
      scrollEnabled={true}
      renderLabel={this.renderTabLabel}
      tabStyle={{
        width: 200
      }}
      indicatorStyle={{
        backgroundColor: colors.mainBlue
      }}
    />
  );

  _renderScene = ({ route }) => {
    return null;
  };

  render() {
    return (
      <ScreenContainer style={{ padding: 0, backgroundColor: "#fafafa" }}>
        {this.state.loaded && (
          <TabViewAnimated
            style={styles.container}
            navigationState={this.state}
            renderScene={this._renderScene}
            renderHeader={this._renderHeader}
            onIndexChange={this._handleIndexChange}
            initialLayout={initialLayout}
          />
        )}
      </ScreenContainer>
    );
  }
}

export default CategoryWithPager;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    color: "#fff",
    fontSize: 24,
    textAlign: "center"
  },
  subTitle: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 30
  }
});
