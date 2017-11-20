import React, { Component } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { actions as loggedInUserActions } from "../modules/logged-in-user";
import { consumerGetDashboard } from "../api";
import { Text, Button, ScreenContainer } from "../elements";
import BlankDashboard from "../components/blank-dashboard";
import SearchHeader from "../components/search-header";

class MoreScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  };
  constructor(props) {
    super(props);
    this.state = {
      showDashboard: true
    };
  }
  async componentDidMount() {
    const dashboardData = await consumerGetDashboard();
  }
  render() {
    const { showDashboard } = this.state;
    return (
      <View style={{ flex: 1 }}>
        {showDashboard && <SearchHeader />}
        <ScreenContainer>
          {!showDashboard && <BlankDashboard />}
        </ScreenContainer>
      </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(MoreScreen);
