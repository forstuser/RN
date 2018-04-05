import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  Alert,
  TouchableOpacity
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import Modal from "react-native-modal";
import Analytics from "../../analytics";
import PinInput from "../../components/pin-input";
import { actions as loggedInUserActions } from "../../modules/logged-in-user";
import { actions as uiActions } from "../../modules/ui";
import { Text, Button, ScreenContainer } from "../../elements";
import Body from "./body";
import Header from "./header";
import I18n from "../../i18n";
import { showSnackbar } from "../snackbar";
import { SCREENS } from "../../constants";
import { getProfileDetail, deletePin, logout } from "../../api";
import { openLoginScreen, openAppScreen } from "../../navigation";
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
      startWithProfileScreen: false,
      isRemovePinModalVisible: false
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
        Analytics.logEvent(Analytics.EVENTS.CLICK_MORE);
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

  removePin = async pin => {
    this.setState({
      isFetchingData: true,
      isRemovePinModalVisible: false
    });
    try {
      await deletePin({ pin });
      this.props.removePin();
      showSnackbar({
        text: "Pin Removed",
        isOnTabsScreen: true
      });
    } catch (e) {
      showSnackbar({
        text: e.message,
        isOnTabsScreen: true
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
    const { authToken, isPinSet } = this.props;
    const {
      profile,
      isAppUpdateAvailable,
      error,
      isFetchingData,
      isRemovePinModalVisible
    } = this.state;
    if (error) {
      return <ErrorOverlay error={error} onRetryPress={this.fetchProfile} />;
    }
    return (
      <ScreenContainer style={{ padding: 0, backgroundColor: "#FAFAFA" }}>
        <LoadingOverlay visible={isFetchingData} />
        <Header
          authToken={authToken}
          onPress={this.openProfileScreen}
          profile={profile}
          navigator={this.props.navigator}
        />
        <Body
          profile={profile}
          isPinSet={isPinSet}
          removePin={() => this.setState({ isRemovePinModalVisible: true })}
          isAppUpdateAvailable={isAppUpdateAvailable}
          logoutUser={this.props.logoutUser}
          language={this.props.language}
          setLanguage={language => {
            this.props.setLanguage(language);
            I18n.locale = language.code;
            openAppScreen();
          }}
          navigator={this.props.navigator}
        />
        <Modal
          isVisible={isRemovePinModalVisible}
          style={{ margin: 0 }}
          onBackButtonPress={() =>
            this.setState({
              isRemovePinModalVisible: false
            })
          }
        >
          <View style={{ flex: 1 }}>
            <PinInput title="Enter App PIN" onSubmitPress={this.removePin} />
            <TouchableOpacity
              style={{
                position: "absolute",
                right: 10,
                top: 25
              }}
              onPress={() => this.setState({ isRemovePinModalVisible: false })}
            >
              <Icon name="md-close" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        </Modal>
      </ScreenContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    authToken: state.loggedInUser.authToken,
    isPinSet: state.loggedInUser.isPinSet,
    language: state.ui.language
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logoutUser: async () => {
      dispatch(loggedInUserActions.loggedInUserClearAllData());
      try {
        logout();
      } catch (e) {
        console.log(e);
      }
      openLoginScreen();
    },
    removePin: () => {
      dispatch(loggedInUserActions.setLoggedInUserIsPinSet(false));
    },
    setLanguage: language => {
      dispatch(uiActions.setLanguage(language));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MoreScreen);
