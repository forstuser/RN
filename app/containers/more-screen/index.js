import React, { Component } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { actions as loggedInUserActions } from "../../modules/logged-in-user";
import { Text, Button, ScreenContainer } from "../../elements";
import Body from "./body";
import Header from "./header";

import { getProfileDetail } from "../../api";
import { openLoginScreen } from "../../navigation";

class MoreScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  };
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      binbillDetails: {}
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent = event => {
    switch (event.id) {
      case "didAppear":
        this.fetchProfile();
        break;
    }
  };

  fetchProfile = async () => {
    this.setState({
      profile: null
    });
    try {
      const res = await getProfileDetail();
      this.setState({
        profile: res.userProfile
      });
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  render() {
    const profile = this.state.profile;
    return (
      <View>
        <Header profile={profile} navigator={this.props.navigator} />
        <Body
          logoutUser={this.props.logoutUser}
          navigator={this.props.navigator}
        />
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
    logoutUser: () => {
      dispatch(loggedInUserActions.setLoggedInUserAuthToken(null));
      openLoginScreen();
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MoreScreen);
