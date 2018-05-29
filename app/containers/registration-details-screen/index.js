import React from "react";
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RNGooglePlaces from "react-native-google-places";
import Icon from "react-native-vector-icons/Ionicons";
import Snackbar from "react-native-snackbar";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";
import { openAfterLoginScreen } from "../../navigation";
import {
  consumerGetOtp,
  updatePhoneNumber,
  updateProfile,
  getProfileDetail
} from "../../api";

import {
  Text,
  Image,
  Button,
  ScreenContainer,
  TextInput
} from "../../elements";

import binbillImage from "../../images/binbill_logo.png";
import bgImage from "../../images/background1.png";
import { colors } from "../../theme";

import Gender from "./gender";
import { SCREENS } from "../../constants";

const SCREEN_WIDTH = Dimensions.get("window").width;
const MALE = 1;
const FEMALE = 2;

export default class RegistrationDetails extends React.Component {
  static navigationOptions = {
    header: null
  };

  stepsPositionX = new Animated.Value(0);

  state = {
    error: null,
    name: "",
    email: "",
    isEmailEditable: true,
    phone: "",
    verifiedPhoneNumber: "",
    isPhoneEditable: true,
    location: "",
    latitude: null,
    longitude: null,
    gender: null,
    isLoading: false,
    otp: "",
    showOtpInput: false
  };

  componentDidMount() {
    this.fetchUserDetails();
  }

  fetchUserDetails = async () => {
    try {
      this.setState({ isLoading: true, error: null });
      const r = await getProfileDetail();
      const user = r.userProfile;

      this.setState({
        isLoading: false,
        name: user.name || "",
        email: user.email || "",
        isEmailEditable: user.email ? false : true,
        phone: user.mobile_no || "",
        isPhoneEditable: user.mobile_no ? false : true,
        gender: user.gender,
        location: user.location
      });
    } catch (error) {
      this.setState({ error });
    }
  };

  openLocationPicker = async () => {
    try {
      const place = await RNGooglePlaces.openPlacePickerModal();
      console.log("place: ", place);
      this.setState({
        location:
          (place.types.includes("other") ? "" : place.name + ", ") +
          place.address,
        latitude: place.latitude,
        longitude: place.longitude
      });
    } catch (e) {
      console.log("e: ", e);
      Snackbar.show({
        title: e.message,
        duration: Snackbar.LENGTH_SHORT
      });
    }
  };

  openGenderView = () => {
    Animated.timing(this.stepsPositionX, {
      toValue: -SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  onNextPress = async () => {
    const {
      phone,
      verifiedPhoneNumber,
      isPhoneEditable,
      otp,
      showOtpInput
    } = this.state;
    console.log("this.state: ", this.state);
    if (isPhoneEditable && phone.length > 0 && phone != verifiedPhoneNumber) {
      if (phone.length != 10) {
        return Snackbar.show({
          title: "Please enter 10 digit mobile number",
          duration: Snackbar.LENGTH_SHORT
        });
      } else if (!showOtpInput) {
        return Snackbar.show({
          title: "Please click on verify",
          duration: Snackbar.LENGTH_SHORT
        });
      } else if (otp.length != 4) {
        return Snackbar.show({
          title: "Please enter 4 digit OTP",
          duration: Snackbar.LENGTH_SHORT
        });
      } else {
        try {
          this.setState({
            isLoading: true
          });
          await updatePhoneNumber({ phone, otp });
          this.setState({
            isLoading: false,
            showOtpInput: false,
            otp: "",
            verifiedPhoneNumber: phone
          });
          this.openGenderView();
        } catch (e) {
          this.setState({
            isLoading: false
          });
          return Snackbar.show({
            title: e.message,
            duration: Snackbar.LENGTH_SHORT
          });
        }
      }
    } else {
      this.openGenderView();
    }
  };

  openDetailsScreen = () => {
    Animated.timing(this.stepsPositionX, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  askForOtp = async () => {
    try {
      this.setState({
        isLoading: true
      });
      await consumerGetOtp(this.state.phone);
      this.setState({
        isLoading: false,
        showOtpInput: true,
        otp: ""
      });
      Snackbar.show({
        title: "Please enter the OTP you just received on " + this.state.phone,
        duration: Snackbar.LENGTH_LONG
      });
    } catch (e) {
      this.setState({
        isGettingOtp: false
      });
      Snackbar.show({
        title: e.message,
        duration: Snackbar.LENGTH_SHORT
      });
    }
  };

  saveDetails = async () => {
    const {
      name,
      email,
      location,
      gender,
      latitude,
      longitude,
      isLoading
    } = this.state;
    this.setState({ isLoading: true });
    try {
      const res = await updateProfile({
        name,
        email,
        location,
        latitude,
        longitude,
        gender
      });
      openAfterLoginScreen();
    } catch (e) {
      console.log("e: ", e);
      Snackbar.show({
        title: e.message,
        duration: Snackbar.LENGTH_SHORT
      });
    }
  };

  onPhoneInputChange = phone => {
    this.setState({ phone });
    if (phone.length != 10) {
      this.setState({ showOtpInput: false });
    }
  };

  render() {
    const {
      name,
      email,
      isEmailEditable,
      phone,
      verifiedPhoneNumber,
      isPhoneEditable,
      location,
      gender,
      isLoading,
      otp,
      showOtpInput,
      error
    } = this.state;
    if (error)
      return (
        <ErrorOverlay error={error} onRetryPress={this.fetchUserDetails} />
      );
    return (
      <ScreenContainer style={styles.container}>
        <Image style={styles.bg} source={bgImage} resizeMode="cover" />
        <KeyboardAwareScrollView>
          <Animated.View
            style={[
              styles.steps,
              {
                transform: [
                  {
                    translateX: this.stepsPositionX
                  }
                ]
              }
            ]}
          >
            <View style={styles.step}>
              <Image
                style={styles.logo}
                source={binbillImage}
                resizeMode="contain"
              />
              <Text weight="Bold" style={styles.welcome}>
                Welcome
              </Text>
              <Text style={styles.title}>Help us Manage your Home better!</Text>

              <TextInput
                value={name}
                placeholder="Full Name"
                leftIconName="ios-person-outline"
                onChangeText={name => this.setState({ name })}
              />

              <TextInput
                value={email}
                editable={isEmailEditable}
                keyboardType="email-address"
                placeholder="Email Id"
                leftIconName="ios-mail-outline"
                onChangeText={email => this.setState({ email })}
              />

              <TextInput
                value={phone}
                editable={isPhoneEditable}
                keyboardType="numeric"
                placeholder="Mobile Number"
                leftIconName="ios-phone-portrait"
                onChangeText={this.onPhoneInputChange}
                rightComponent={
                  isPhoneEditable &&
                  phone.length == 10 &&
                  phone != verifiedPhoneNumber ? (
                    <TouchableOpacity onPress={this.askForOtp}>
                      <Text
                        weight="Bold"
                        style={{ color: colors.mainBlue, fontSize: 12 }}
                      >
                        VERIFY
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View />
                  )
                }
              />

              {showOtpInput ? (
                <TextInput
                  value={otp}
                  keyboardType="numeric"
                  placeholder="Enter OTP"
                  leftIconName="md-lock"
                  onChangeText={otp => this.setState({ otp })}
                />
              ) : (
                <View />
              )}

              {/* <TextInput
              onPress={this.openLocationPicker}
              value={location}
              placeholder="Enter Your Location"
              leftIconName="ios-pin-outline"
              multiline={true}
              inputStyle={location ? { height: 70 } : {}}
            /> */}

              <Button
                onPress={this.onNextPress}
                text="NEXT"
                color="secondary"
                style={{ width: "100%", height: 40, marginTop: 30 }}
              />
            </View>
            <View style={styles.page}>
              <View style={styles.gendersHeader}>
                <TouchableOpacity
                  onPress={this.openDetailsScreen}
                  style={{ padding: 10 }}
                >
                  <Icon name="md-arrow-back" size={20} color="black" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={this.saveDetails}
                  style={{ padding: 10 }}
                >
                  <Text
                    weight="Bold"
                    style={{ fontSize: 12, color: colors.pinkishOrange }}
                  >
                    SKIP
                  </Text>
                </TouchableOpacity>
              </View>
              <Text weight="Bold" style={{ margin: 20, textAlign: "center" }}>
                To help us to give you the best exeperience
              </Text>
              <View style={styles.genders}>
                <Gender
                  gender="Male"
                  onPress={() => this.setState({ gender: MALE })}
                  isSelected={gender == MALE}
                />
                <Gender
                  gender="Female"
                  onPress={() => this.setState({ gender: FEMALE })}
                  isSelected={gender == FEMALE}
                />
              </View>
              <Button
                onPress={this.saveDetails}
                text="DONE"
                color="secondary"
                style={{
                  width: 250,
                  height: 40,
                  marginTop: 20,
                  alignSelf: "center"
                }}
              />
            </View>
          </Animated.View>
        </KeyboardAwareScrollView>
        <LoadingOverlay visible={isLoading} />
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0
  },
  bg: {
    position: "absolute",
    width: "100%",
    height: "100%"
  },
  steps: {
    flex: 1,
    flexDirection: "row",
    width: SCREEN_WIDTH * 2
  },
  step: {
    width: SCREEN_WIDTH,
    flex: 1,
    padding: 16,
    alignItems: "center"
  },
  logo: {
    marginTop: 40,
    marginBottom: 20,
    width: 95,
    height: 95
  },
  welcome: {
    fontSize: 18,
    color: colors.pinkishOrange
  },
  title: {
    color: "#5b5b5b",
    marginBottom: 30
  },
  gendersHeader: {
    flexDirection: "row",
    width: SCREEN_WIDTH,
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#c2c2c2",
    alignItems: "center"
  },
  genders: {
    flexDirection: "row",
    width: SCREEN_WIDTH,
    justifyContent: "center"
  }
});
