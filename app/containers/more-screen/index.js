import React, { Component } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { actions as loggedInUserActions } from "../../modules/logged-in-user";
import { Text, Button, ScreenContainer } from "../../elements";
import Body from "./body";
import Header from "./header";

import { openLoginScreen } from "../../navigation";

class MoreScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  };
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    console.log(this.props.authToken);
  }
  render() {
    return (
      <View>
        <Header navigator={this.props.navigator} />
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
