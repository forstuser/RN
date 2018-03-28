import React, { Component } from "react";
import {
  View,
  TextInput,
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  NativeModules
} from "react-native";
import { connect } from "react-redux";
import Hyperlink from "react-native-hyperlink";
import FBSDK from "react-native-fbsdk";
const { LoginManager, AccessToken } = FBSDK;
import Icon from "react-native-vector-icons/Ionicons";
import { SCREENS } from "../constants";
import { colors } from "../theme";
import { consumerGetOtp, consumerValidate, getProfileDetail } from "../api";
import LoadingOverlay from "../components/loading-overlay";
import { ScreenContainer, Text, Button } from "../elements";
import I18n from "../i18n";
import { actions as loggedInUserActions } from "../modules/logged-in-user";
import { actions as uiActions } from "../modules/ui";
import Analytics from "../analytics";
import { openAfterLoginScreen } from "../navigation";
import LanguageOptions from "../components/language-options";

const binbillLogo = require("../images/binbill_logo.png");
const truecallerLogo = require("../images/truecaller_logo.png");
const facebookLogo = require("../images/facebook_logo.png");

class LoginScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  };
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: "",
      isGettingOtp: false
    };
  }
  componentDidMount() {
    this.props.navigator.setTitle({
      title: I18n.t("login_screen_title")
    });
  }

  onSubmitPhoneNumber = async () => {
    if (this.state.phoneNumber.length != 10) {
      return Alert.alert(I18n.t("login_screen_invalid_number_error"));
    }
    try {
      this.setState({
        isGettingOtp: true
      });
      await consumerGetOtp(this.state.phoneNumber);
      this.setState({
        isGettingOtp: false
      });
      this.props.navigator.push({
        screen: SCREENS.VERIFY_SCREEN,
        passProps: {
          phoneNumber: this.state.phoneNumber
        }
      });
    } catch (e) {
      this.setState({
        isGettingOtp: false
      });
      Alert.alert(e.message);
    }
  };

  openTermsScreen = () => {
    this.props.navigator.push({
      screen: SCREENS.TERMS_SCREEN
    });
  };

  setAuthTokenAndOpenApp = async authToken => {
    try {
      this.props.setLoggedInUserAuthToken(authToken);
      Analytics.logEvent(Analytics.EVENTS.REGISTRATION_OTP);
      const r2 = await getProfileDetail();
      const user = r2.userProfile;
      this.props.setLoggedInUser({
        id: user.id,
        name: user.name,
        phone: user.mobile_no,
        imageName: user.image_name
      });
      openAfterLoginScreen();
    } catch (e) {
      this.setState({
        isGettingOtp: false
      });
      Alert.alert("Some error occurred");
    }
  };

  loginWithTrueCaller = async () => {
    try {
      this.setState({
        isGettingOtp: true
      });
      const result = await NativeModules.RNTrueCaller.getProfileDetails();
      console.log("TrueCaller login result: ", result);
      this.setState({
        isGettingOtp: false
      });
    } catch (e) {
      this.setState({
        isGettingOtp: false
      });
      console.log("Some error occurred: ", e);
    }
  };

  loginWithFacebook = async () => {
    try {
      const result = await LoginManager.logInWithReadPermissions([
        "public_profile",
        "email"
      ]);
      console.log("FB login result: ", result);
      if (!result.isCancelled) {
        if (result.grantedPermissions.indexOf("email") == -1) {
          setTimeout(() => {
            Alert.alert("Email address is required");
          }, 200);
          return;
        }

        this.setState({
          isGettingOtp: true
        });

        const data = await AccessToken.getCurrentAccessToken();

        const r = await consumerValidate({
          trueSecret: data.accessToken.toString(),
          fcmToken: this.props.fcmToken,
          bbLoginType: 3
        });
        this.setAuthTokenAndOpenApp(r.authorization);
      }
    } catch (e) {
      this.setState({
        isGettingOtp: false
      });
      Alert.alert("Some error occurred");
    }
  };
  render() {
    return (
      <ScreenContainer style={styles.container}>
        <LoadingOverlay visible={this.state.isGettingOtp} />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.content}>
            <Image
              style={styles.logo}
              source={binbillLogo}
              resizeMode="contain"
            />
            <TouchableOpacity
              onPress={() => {
                this.languageOptions.show();
              }}
              style={{
                marginTop: 15,
                flexDirection: "row",
                alignItems: "flex-end"
              }}
            >
              <Text
                weight="Medium"
                style={{
                  fontSize: 12,
                  marginRight: 10,
                  color: colors.secondaryText
                }}
              >
                {this.props.language.name}
              </Text>
              <Icon
                name="ios-arrow-down"
                size={15}
                color={colors.secondaryText}
              />
            </TouchableOpacity>
            <TextInput
              underlineColorAndroid="transparent"
              placeholder={I18n.t("login_screen_input_placeholder")}
              maxLength={10}
              style={styles.phoneInput}
              onChangeText={phoneNumber => this.setState({ phoneNumber })}
              value={this.state.phoneNumber}
              keyboardType="phone-pad"
            />
            <Button
              color="secondary"
              type="outline"
              onPress={this.onSubmitPhoneNumber}
              text={I18n.t("login_screen_btn_text")}
              style={{ width: 275 }}
            />
            <View style={styles.or}>
              <View style={styles.orLine} />
              <Text weight="Medium" style={styles.orText}>
                {I18n.t("login_screen_or_text")}
              </Text>
              <View style={styles.orLine} />
            </View>
            {/*<TouchableOpacity
              onPress={this.loginWithTrueCaller}
              style={[styles.btn, styles.btnTruecaller]}
            >
              <Image
                style={styles.btnImage}
                source={truecallerLogo}
                resizeMode="contain"
              />
            </TouchableOpacity>*/}
            <TouchableOpacity
              onPress={this.loginWithFacebook}
              style={[styles.btn, styles.btnFacebook]}
            >
              <Image
                style={styles.btnImage}
                source={facebookLogo}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Text weight="Medium" style={styles.noOtpRequired}>
              {I18n.t("login_screen_no_otp_required_text")}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <View>
          <Hyperlink
            linkDefault={true}
            linkStyle={{ color: colors.pinkishOrange, fontSize: 14 }}
            linkText={url => {
              if (url === "https://www.binbill.com/term") {
                return "Terms & Conditions";
              } else if (url === "https://www.binbill.com/privacy") {
                return "Privacy Policy";
              } else {
                return url;
              }
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: colors.secondaryText,
                textAlign: "center"
              }}
            >
              {`By signing up you agree to our \nhttps://www.binbill.com/term and https://www.binbill.com/privacy`}
            </Text>
          </Hyperlink>
        </View>
        <LanguageOptions
          ref={o => (this.languageOptions = o)}
          onLanguageChange={language => {
            this.props.setLanguage(language);
            I18n.locale = language.code;
            this.forceUpdate();
          }}
        />
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 30
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  logo: {
    width: 80,
    height: 80
  },
  phoneInput: {
    marginTop: 30,
    borderColor: colors.mainBlue,
    borderBottomWidth: 1,
    marginBottom: 16,
    textAlign: "center",
    fontSize: 25,
    width: 275,
    paddingBottom: 10
  },
  btn: {
    width: 275,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center"
  },
  btnTruecaller: {
    backgroundColor: "#0186fe",
    marginBottom: 20
  },
  btnFacebook: {
    backgroundColor: "#3b5998"
  },
  btnImage: {
    width: 135,
    height: 25
  },
  or: {
    width: 300,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginVertical: 30
  },
  orLine: {
    backgroundColor: "#eee",
    height: 1,
    width: 60
  },
  orText: {
    fontSize: 12,
    marginHorizontal: 10,
    color: colors.secondaryText
  },
  noOtpRequired: {
    marginTop: 20,
    fontSize: 12,
    marginHorizontal: 10,
    color: colors.secondaryText
  }
});

const mapStateToProps = state => {
  return {
    fcmToken: state.loggedInUser.fcmToken,
    language: state.ui.language
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLoggedInUserAuthToken: token => {
      dispatch(loggedInUserActions.setLoggedInUserAuthToken(token));
    },
    setLoggedInUser: user => {
      dispatch(loggedInUserActions.setLoggedInUser(user));
    },
    setLanguage: async language => {
      dispatch(uiActions.setLanguage(language));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
