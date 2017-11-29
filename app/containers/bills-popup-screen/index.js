import React, { Component } from "react";
import { StyleSheet, View, FlatList, Alert } from "react-native";
import moment from "moment";
import ScrollableTabView from "react-native-scrollable-tab-view";
import { Text, Button, ScreenContainer, AsyncImage } from "../../elements";
import { API_BASE_URL } from "../../api";
import { colors } from "../../theme";
import BillCopyItem from "./bill-copy-item";

class BillsPopUpScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true,
    tabBarHidden: true,
    statusBarTextColorScheme: "light"
  };
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  closeThisScreen = () => {
    this.props.navigator.dismissModal();
  };
  render() {
    const { date, id, copies } = this.props;
    return (
      <ScreenContainer style={styles.container}>
        <View style={styles.header}>
          <View style={styles.dateAndId}>
            <Text weight="Medium" style={styles.date}>
              {moment(date).format("DD MMM, YYYY")}
            </Text>
            <Text style={styles.id}>ID: {id}</Text>
          </View>
          <Text
            onPress={this.closeThisScreen}
            weight="Bold"
            style={styles.crossIcon}
          >
            X
          </Text>
        </View>
        <ScrollableTabView
          tabBarUnderlineStyle={{
            backgroundColor: colors.mainBlue,
            height: 2,
            marginBottom: -1
          }}
          tabBarPosition="bottom"
          renderTabBar={null}
        >
          {copies.map((copy, index) => (
            <BillCopyItem
              key={copy.copyId}
              copy={copy}
              index={index}
              total={copies.length}
            />
          ))}
        </ScrollableTabView>
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: { backgroundColor: "rgba(0,0,0,1)" },
  header: {
    flexDirection: "row",
    marginBottom: 20
  },
  dateAndId: {
    flex: 1
  },
  date: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 5
  },
  id: {
    color: "#fff"
  },
  crossIcon: {
    color: "#999",
    fontSize: 24
  }
});

export default BillsPopUpScreen;
