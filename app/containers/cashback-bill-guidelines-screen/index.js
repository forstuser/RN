import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { connect } from "react-redux";

import { Text, Button, Image } from "../../elements";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";

import { API_BASE_URL, getSellerDetails } from "../../api";

import ScrollableTabView, {
  DefaultTabBar
} from "react-native-scrollable-tab-view";
import { colors } from "../../theme";

import CashbackBillTab from "./bill";
import ShoppingListTab from "./shopping-list";
import { SCREENS } from "../../constants";

class CashbackBillGuidelines extends React.Component {
  static navigationOptions = {
    title: "Cashback Guide"
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };
  }

  componentDidMount() {}

  render() {
    const { isLoading } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {
          <ScrollableTabView
            renderTabBar={() => <DefaultTabBar style={{ height: 35 }} />}
            tabBarUnderlineStyle={{
              backgroundColor: colors.mainBlue,
              height: 2
            }}
            ref={node => {
              this.scrollableTabView = node;
            }}
            tabBarBackgroundColor="transparent"
            tabBarTextStyle={{
              fontSize: 14,
              fontFamily: `Roboto-Bold`,
              color: colors.mainBlue,
              marginTop: 8
            }}
          >
            <View tabLabel="Bill">
              <CashbackBillTab
                navigation={this.props.navigation}
                isLoading={isLoading}
              />
            </View>
            <View tabLabel="Shopping List Guide">
              <ShoppingListTab
                navigation={this.props.navigation}
                isLoading={isLoading}
              />
            </View>
          </ScrollableTabView>
        }
        <LoadingOverlay visible={isLoading} />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.loggedInUser
  };
};

export default connect(mapStateToProps)(CashbackBillGuidelines);
