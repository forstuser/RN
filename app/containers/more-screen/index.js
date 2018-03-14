import React, { Component } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import RNRestart from "react-native-restart";
import { actions as loggedInUserActions } from "../../modules/logged-in-user";
import { actions as uiActions } from "../../modules/ui";
import { Text, Button, ScreenContainer } from "../../elements";
import Body from "./body";
import Header from "./header";
import I18n from "../../i18n";
import { SCREENS } from "../../constants";
import { getProfileDetail, logout } from "../../api";
import { openLoginScreen } from "../../navigation";
import ErrorOverlay from "../../components/error-overlay";
import LoadingOverlay from "../../components/loading-overlay";
import { colors } from "../../theme";

class MoreScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  };

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isFetchingData: false,
      profile: null,
      isAppUpdateAvailable: false,
      binbillDetails: {},
      startWithProfileScreen: false
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  componentDidMount() {
    if (this.props.screenOpts) {
      const screenOpts = this.props.screenOpts;
      switch (screenOpts.startScreen) {
        case SCREENS.FAQS_SCREEN:
          this.props.navigator.push({
            screen: SCREENS.FAQS_SCREEN
          });
          break;
        case SCREENS.PROFILE_SCREEN:
          this.setState({
            startWithProfileScreen: true
          });
          break;
      }
    }
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
      error: null,
      isFetchingData: false,
      profile: null
    });
    try {
      const res = await getProfileDetail();
      console.log("Profile result: ", res);
      this.setState(
        {
          profile: res.userProfile,
          isAppUpdateAvailable: res.forceUpdate === false,
          isFetchingData: false
        },
        () => {
          if (this.state.startWithProfileScreen) {
            this.setState({ startWithProfileScreen: false });
            this.openProfileScreen();
          }
        }
      );
    } catch (error) {
      this.setState({
        error
      });
    }
    this.setState({
      isFetchingData: false
    });
  };

  openProfileScreen = () => {
    this.props.navigator.push({
      screen: SCREENS.PROFILE_SCREEN,
      passProps: { profile: this.state.profile }
    });
  };

  render() {
    const { authToken } = this.props;
    const { profile, isAppUpdateAvailable, error, isFetchingData } = this.state;
    if (error) {
      return <ErrorOverlay error={error} onRetryPress={this.fetchProfile} />;
    }
    return (
      <ScreenContainer style={{ padding: 0, backgroundColor: "#FAFAFA" }}>
        <LoadingOverlay visible={profile == null} />
        <Header
          authToken={authToken}
          onPress={this.openProfileScreen}
          profile={profile}
          navigator={this.props.navigator}
        />
        <Body
          profile={profile}
          isAppUpdateAvailable={isAppUpdateAvailable}
          logoutUser={this.props.logoutUser}
          language={this.props.language}
          setLanguage={language => {
            this.props.setLanguage(language);
            RNRestart.Restart();
          }}
          navigator={this.props.navigator}
        />
      </ScreenContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    authToken: state.loggedInUser.authToken,
    language: state.ui.language
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logoutUser: async () => {
      dispatch(loggedInUserActions.setLoggedInUserAuthToken(null));
      try {
        logout();
      } catch (e) {
        console.log(e);
      }
      openLoginScreen();
    },
    setLanguage: async language => {
      dispatch(uiActions.setLanguage(language));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MoreScreen);
