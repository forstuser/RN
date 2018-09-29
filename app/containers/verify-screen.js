import React, { Component } from "react";
import { TextInput, Alert, Platform } from "react-native";
import SmsAndroid from "react-native-get-sms-android";
import { requestSmsReadPermission } from "../android-permissions";
import { connect } from "react-redux";

import { consumerValidate, consumerGetOtp, getProfileDetail } from "../api";
import LoadingOverlay from "../components/loading-overlay";
import { openAfterLoginScreen } from "../navigation";
import { actions as loggedInUserActions } from "../modules/logged-in-user";
import { ScreenContainer, Text, Button } from "../elements";
import { colors } from "../theme";
import I18n from "../i18n";
import moment from "moment";

import { showSnackbar } from "../utils/snackbar";
import Analytics from "../analytics";
import { SCREENS } from "../constants";

var setMsgInterval = null;
var actualMsg = null;
var otpFromMsg = null;
var startTime = null;
var otpTime = null;

class VerifyScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      title: I18n.t("verify_screen_title"),
      headerRight: (
        <Text
          onPress={params.resendOtp}
          weight="Bold"
          style={{ color: colors.pinkishOrange, marginRight: 10 }}
        >
          RESEND OTP
        </Text>
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: "",
      otp: "",
      isVerifyingOtp: false
    };
  }

  componentWillMount() {
    this.props.navigation.setParams({ resendOtp: this.onResendOtp });
    const { navigation } = this.props;
    this.setState({
      phoneNumber: navigation.getParam("phoneNumber", "")
    });
  }

  async componentDidMount() {
    if (Platform.OS == "android" && (await requestSmsReadPermission())) {
      startTime = moment()
        .toDate()
        .getTime();
      setMsgInterval = setInterval(this.getMsgFunction, 2000);
    }
  }

  componentWillUnmount() {
    clearInterval(setMsgInterval);
  }

  getMsgFunction = async () => {
    let filter = {
      box: "inbox",
      indexFrom: 0,
      maxCount: 1
    };
    SmsAndroid.list(
      JSON.stringify(filter),
      fail => {
        console.log("SMS read failed with this error: " + fail);
      },
      (count, smsList) => {
        console.log("SMS Count: ", count);
        //console.log("SMS List: ", smsList);
        var arr = JSON.parse(smsList);
        arr.forEach(function(object) {
          var lastSix = object.address.substr(object.address.length - 6);
          //console.log("Object: " + object);
          //console.log("-->" + object.date);
          //console.log("Message: " + object.body);
          if (lastSix === "BINBIL") {
            actualMsg = object.body;
            otpTime = moment()
              .toDate()
              .getTime();
            //console.log("OTP", actualMsg.substr(27, 4));
            otpFromMsg = actualMsg.substr(27, 4);
            //console.log("OTP: ", otpFromMsg);
            return;
          }
        });
      }
    );
    if (otpFromMsg !== null && otpTime >= startTime) {
      this.setState({ otp: otpFromMsg });
      this.onSubmitOtp();
    }
  };

  onResendOtp = async () => {
    this.otpInput.blur();
    try {
      this.setState({
        isVerifyingOtp: true,
        otp: ""
      });
      await consumerGetOtp(this.state.phoneNumber);

      showSnackbar({
        text: "OTP sent again successfully!!"
      });
    } catch (e) {
      showSnackbar({
        text: e.message
      });
    }
    this.setState({
      isVerifyingOtp: false
    });
  };

  onSubmitOtp = async () => {
    if (this.state.otp.length != 4) {
      return showSnackbar({
        text: I18n.t("verify_screen_invalid_otp_error")
      });
    }

    try {
      this.setState({
        isVerifyingOtp: true
      });
      const r = await consumerValidate({
        trueObject: { PhoneNo: this.state.phoneNumber },
        token: this.state.otp,
        fcmToken: this.props.fcmToken
      });
      this.props.setLoggedInUserAuthToken(r.authorization);
      Analytics.logEvent(Analytics.EVENTS.REGISTRATION_OTP);
      const r2 = await getProfileDetail();
      const user = r2.userProfile;
      this.props.setLoggedInUser({
        id: user.id,
        name: user.name,
        phone: user.mobile_no,
        location: user.location,
        imageUrl: user.imageUrl,
        isPinSet: user.hasPin
      });
      if (
        !r.isExistingUser ||
        user.name === null ||
        user.email === null ||
        user.gender === null
      ) {
        this.props.navigation.navigate(SCREENS.USER_ON_BOARDING_STACK);
      } else {
        openAfterLoginScreen();
      }
    } catch (e) {
      showSnackbar({
        text: e.message
      });
      this.setState({
        isVerifyingOtp: false
      });
    }
  };
  render() {
    console.log("Start Time: ", startTime);
    console.log("otpTime: ", otpTime);
    return (
      <ScreenContainer
        style={{
          alignItems: "center"
        }}
      >
        <Text
          weight="Bold"
          style={{ textAlign: "center", fontSize: 14, width: 300 }}
        >
          {I18n.t("verify_screen_enter_otp_msg", {
            phoneNumber: this.state.phoneNumber
          })}
        </Text>
        <TextInput
          underlineColorAndroid="transparent"
          ref={ref => (this.otpInput = ref)}
          autoFocus={true}
          maxLength={4}
          style={{
            height: 65,
            borderColor: colors.mainBlue,
            borderBottomWidth: 2,
            marginTop: 40,
            marginBottom: 10,
            width: 200,
            fontSize: 40,
            textAlign: "center"
          }}
          onChangeText={otp => this.setState({ otp })}
          value={this.state.otp}
          keyboardType="phone-pad"
        />
        <Button
          style={{ width: 300 }}
          color={this.state.otp.length == 4 ? "secondary" : "grey"}
          type="outline"
          onPress={this.onSubmitOtp}
          text={I18n.t("verify_screen_btn_text")}
        />
        <LoadingOverlay visible={this.state.isVerifyingOtp} />
      </ScreenContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    fcmToken: state.ui.fcmToken
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLoggedInUserAuthToken: token => {
      dispatch(loggedInUserActions.setLoggedInUserAuthToken(token));
    },
    setLoggedInUser: user => {
      dispatch(loggedInUserActions.setLoggedInUser(user));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VerifyScreen);
