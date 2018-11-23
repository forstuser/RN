import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
  BackHandler,
  AsyncStorage
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import Modal from "react-native-modal";
import PinInput from "../../components/pin-input";
import { actions as loggedInUserActions } from "../../modules/logged-in-user";
import { actions as uiActions } from "../../modules/ui";
import { Text, Button, ScreenContainer } from "../../elements";
import Body from "./body";
import Header from "./header";
import Profile from "./profile";
import { DrawerActions } from "react-navigation";
import I18n from "../../i18n";
import { showSnackbar } from "../../utils/snackbar";
import { SCREENS } from "../../constants";
import NavigationService from "../../navigation";
import { getProfileDetail, deletePin, logout, updateProfile } from "../../api";
import ErrorOverlay from "../../components/error-overlay";
import LoadingOverlay from "../../components/loading-overlay";
import { colors } from "../../theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

class MoreScreen extends Component {
  static navigationOptions = {
    navBarHidden: true
  };

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isFetchingData: true,
      profile: null,
      isAppUpdateAvailable: false,
      binbillDetails: {},
      startWithProfileScreen: false,
      isRemovePinModalVisible: false,
      isProfileVisible: false,
      name: null,
      flag: false
    };
  }

  componentWillMount() {
    // BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  }
  componentDidMount() {
    // this.fetchProfile();
    this.didFocusSubscription = this.props.navigation.addListener(
      "didFocus",
      () => {
        this.fetchProfile();
      }
    );
  }

  componentWillUnmount() {
    // BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
    this.didFocusSubscription.remove();
  }

  // handleBackPress = () => {
  //   this.props.navigation.pop();
  //   this.DrawerBody.closeDrawer();
  //   return true;
  // };

  fetchProfile = async () => {
    this.setState({
      error: null
    });
    try {
      const res = await getProfileDetail();
      console.log("Profile result: ", res);
      const user = res.userProfile;
      this.props.setLoggedInUser({
        id: user.id,
        name: user.name,
        phone: user.mobile_no,
        location: user.location,
        imageUrl: user.imageUrl,
        isPinSet: user.hasPin
      });
      this.setState(
        {
          profile: res.userProfile,
          name: res.userProfile.name,
          isAppUpdateAvailable: res.forceUpdate === false,
          isFetchingData: false
        },
        () => {
          console.log(this.state.name, "api name");
        },

        () => {
          if (this.state.startWithProfileScreen) {
            this.setState({ startWithProfileScreen: false });
            this.openProfileScreen();
          }
        }
      );
    } catch (error) {
      console.log(error);
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
    //this.DrawerBody.closeDrawer();
    this.props.navigation.navigate(SCREENS.PROFILE_SCREEN, {
      profile: this.state.profile
    });
  };
  onWalletPress = () => {
    //this.DrawerBody.closeDrawer();
    this.props.navigation.navigate(SCREENS.BB_CASH_WALLET_SCREEN);
  };

  visible = item => {
    this.setState({
      isProfileVisible: item
    });
  };

  updateState = (key, value) => {
    this.setState(
      {
        [key]: value
      },
      () => {
        console.log(this.state.name, "stateName");
      }
    );
  };

  render() {
    const { authToken, isPinSet } = this.props;
    const {
      profile,
      isAppUpdateAvailable,
      error,
      isFetchingData,
      isRemovePinModalVisible,
      isProfileVisible,
      name
    } = this.state;
    // Alert.alert(this.setState.profile);
    if (error) {
      return <ErrorOverlay error={error} onRetryPress={this.fetchProfile} />;
    }
    // if (!isRemovePinModalVisible) return null;

    return (
      <ScreenContainer style={{ padding: 0, backgroundColor: "#FAFAFA" }}>
        <LoadingOverlay visible={isFetchingData} />
        <KeyboardAwareScrollView>
          <Header
            authToken={authToken}
            onPress={this.openProfileScreen}
            profile={profile}
            name={name}
            navigation={this.props.navigation}
            isProfileVisible={this.state.isProfileVisible}
            visible={this.visible}
            onUpdate={this.updateState}
            onWalletPress={this.onWalletPress}
          />
          {!isProfileVisible && (
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
              }}
              navigation={this.props.navigation}
              ref={ref => (this.DrawerBody = ref)}
            />
          )}
          {profile && isProfileVisible && <Profile profile={profile} />}
        </KeyboardAwareScrollView>
        {isRemovePinModalVisible ? (
          <View collapsable={false}>
            <Modal
              isVisible={true}
              style={{ margin: 0 }}
              onBackButtonPress={() =>
                this.setState({
                  isRemovePinModalVisible: false
                })
              }
            >
              <View collapsable={false} style={{ flex: 1 }}>
                <PinInput
                  title="Enter App PIN"
                  onSubmitPress={this.removePin}
                />
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    right: 10,
                    top: 25
                  }}
                  onPress={() =>
                    this.setState({ isRemovePinModalVisible: false })
                  }
                >
                  <Icon name="md-close" size={30} color="#fff" />
                </TouchableOpacity>
              </View>
            </Modal>
          </View>
        ) : (
          <View collapsable={false} />
        )}
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
      try {
        await AsyncStorage.removeItem("defaultSeller");
        logout();
        NavigationService.navigate(SCREENS.AUTH_STACK);
        dispatch(loggedInUserActions.loggedInUserClearAllData());
      } catch (e) {
        console.log(e);
      }
    },
    removePin: () => {
      dispatch(loggedInUserActions.setLoggedInUserIsPinSet(false));
    },
    setLanguage: language => {
      dispatch(uiActions.setLanguage(language));
    },
    setLoggedInUser: user => {
      dispatch(loggedInUserActions.setLoggedInUser(user));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MoreScreen);
