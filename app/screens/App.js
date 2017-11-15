import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Button } from "react-native";
import { connect } from "react-redux";
import { actions as loggedInUserActions } from "../modules/logged-in-user";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      click: 0
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Auth Token: {this.props.authToken}</Text>
        <Button
          onPress={() => {
            this.setState({
              click: 5
            });
            this.props.onTestClick();
          }}
          title="Click to change"
        />
        <Text style={styles.welcome}>Clicks: {this.state.click}</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
