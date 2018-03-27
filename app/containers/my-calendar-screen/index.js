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

import { API_BASE_URL, fetchCalendarItems } from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";
import TabSearchHeader from "../../components/tab-screen-header";

import { SCREENS } from "../../constants";

import { colors } from "../../theme";

import Item from "./item";

const calendarIcon = require("../../images/ic_calendar.png");
const calendarIconColor = require("../../images/ic_calendar_color.png");

class MyCalendarScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
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

  componentDidMount() {}

  fetchItems = async () => {
    this.setState({
      isFetchingItems: true,
      error: null
    });
    try {
      const res = await fetchCalendarItems();
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

  openAddEditCalendarServiceScreen = () => {
    this.props.navigator.push({
      screen: SCREENS.ADD_CALENDAR_SERVICE_SCREEN
    });
  };

  onItemPress = item => {
    this.props.navigator.push({
      screen: SCREENS.CALENDAR_SERVICE_CARD_SCREEN,
      passProps: {
        itemId: item.id
      }
    });
  };

  renderItem = ({ item, index }) => {
    return (
      <Item key={item.id} item={item} onPress={() => this.onItemPress(item)} />
    );
  };

  render() {
    const { error, isFetchingItems, items } = this.state;
    if (error) {
      return <ErrorOverlay error={error} onRetryPress={this.fetchItems} />;
    }
    return (
      <ScreenContainer style={{ padding: 0, backgroundColor: "#f7f7f7" }}>
        <View style={styles.header}>
          <TabSearchHeader
            title={I18n.t("my_calendar_screen_title")}
            icon={calendarIcon}
            navigator={this.props.navigator}
            showMailbox={false}
            showSearchInput={false}
          />
        </View>
        {(items.length > 0 || isFetchingItems) && (
          <View style={{ flex: 1 }}>
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
              onPress={this.openAddEditCalendarServiceScreen}
              text={I18n.t("my_calendar_screen_add_btn")}
              color="secondary"
              borderRadius={0}
              style={styles.addItemBtn}
            />
          </View>
        )}
        {items.length == 0 &&
          !isFetchingItems && (
            <View style={styles.emptyStateView}>
              <Image
                source={calendarIcon}
                style={styles.emptyStateImage}
                resizeMode="contain"
              />
              <Text style={styles.emptyStateMsg}>
                {I18n.t("my_calendar_screen_empty_screen_msg")}
              </Text>
              <Button
                onPress={this.openAddEditCalendarServiceScreen}
                text={I18n.t("my_calendar_screen_add_btn")}
                color="secondary"
                style={styles.emptyStateAddItemBtn}
              />
            </View>
          )}
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    ...Platform.select({
      ios: {
        zIndex: 1
      },
      android: {}
    })
  },
  addItemBtn: {
    width: "100%"
  },
  emptyStateView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16
  },
  emptyStateImage: {
    width: 115,
    height: 130
  },
  emptyStateMsg: {
    fontSize: 16,
    textAlign: "center",
    color: colors.secondaryText,
    marginTop: 30
  },
  emptyStateAddItemBtn: {
    width: 280,
    marginTop: 30
  }
});

export default MyCalendarScreen;
