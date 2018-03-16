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
import I18n from "../../i18n";

import { API_BASE_URL, fetchMyCalenderItems } from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";

import { SCREENS } from "../../constants";

import { colors } from "../../theme";

import Item from "./item";

class MyCalenderScreen extends Component {
  static navigatorStyle = {
    tabBarHidden: true
  };
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isFetchingItems: true,
      items: []
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent = event => {
    switch (event.id) {
      case "didAppear":
        this.fetchItems();
        break;
    }
  };

  componentDidMount() {
    this.props.navigator.setTitle({
      title: I18n.t("my_calender_screen_title")
    });
  }

  fetchItems = async () => {
    this.setState({
      isFetchingItems: true,
      error: null
    });
    try {
      const res = await fetchMyCalenderItems();
      this.setState({
        items: res.items
      });
    } catch (error) {
      this.setState({
        error
      });
    }
    this.setState({
      isFetchingItems: false
    });
  };

  openAddEditCalenderServiceScreen = () => {
    this.props.navigator.push({
      screen: SCREENS.ADD_EDIT_CALENDER_SERVICE_SCREEN
    });
  };

  renderItem = ({ item, index }) => {
    return <Item key={item.id} item={item} />;
  };

  render() {
    const { error, isFetchingItems, items } = this.state;
    if (error) {
      return <ErrorOverlay error={error} onRetryPress={this.fetchItems} />;
    }
    return (
      <ScreenContainer style={{ padding: 0, backgroundColor: "#f7f7f7" }}>
        <View style={{ flex: 1 }}>
          <FlatList
            contentContainerStyle={{ padding: 5 }}
            data={items}
            keyExtractor={(item, index) => item.id}
            renderItem={this.renderItem}
            onRefresh={this.fetchItems}
            refreshing={isFetchingItems}
          />
        </View>
        <Button
          onPress={this.openAddEditCalenderServiceScreen}
          text={I18n.t("my_calender_screen_add_btn")}
          color="secondary"
          borderRadius={0}
          style={styles.addItemBtn}
        />
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  addItemBtn: {
    width: "100%"
  }
});

export default MyCalenderScreen;
