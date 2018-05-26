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
import { openAfterLoginScreen } from "../../navigation";
import { updateProfile, getProfileDetail } from "../../api";

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
    name: "",
    email: "",
    phone: "",
    location: "",
    latitude: null,
    longitude: null,
    gender: null,
    isLoading: false
  };

  async componentDidMount() {
    try {
      const r = await getProfileDetail();
      const user = r.userProfile;
      this.setState({
        name: user.name,
        email: user.email,
        phone: user.mobile_no,
        gender: user.gender,
        location: user.location
      });
    } catch (e) {
      Snackbar.show({
        title: e.message,
        duration: Snackbar.LENGTH_SHORT
      });
    }
  }

  openLocationPicker = async () => {
    try {
      const place = await RNGooglePlaces.openPlacePickerModal();
      console.log("place: ", place);
      this.setState({
        location: `${place.name} ${
          place.address ? "(" + place.address + ")" : ""
        }`,
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

  openGenderScreen = () => {
    Animated.timing(this.stepsPositionX, {
      toValue: -SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  openDetailsScreen = () => {
    Animated.timing(this.stepsPositionX, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  saveDetails = async () => {
    const {
      name,
      email,
      phone,
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
        phone,
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

  render() {
    const { name, email, phone, location, gender, isLoading } = this.state;
    return (
      <ScreenContainer style={styles.container}>
        <Image style={styles.bg} source={bgImage} resizeMode="cover" />
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
          <KeyboardAwareScrollView contentContainerStyle={styles.step}>
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
              placeholder="Email Id"
              leftIconName="ios-mail-outline"
              onChangeText={email => this.setState({ email })}
            />

            <TextInput
              value={phone}
              keyboardType="numeric"
              placeholder="Mobile Number"
              leftIconName="ios-phone-portrait"
              onChangeText={phone => this.setState({ phone })}
            />

            <TextInput
              onPress={this.openLocationPicker}
              value={location}
              placeholder="Enter Your Location"
              leftIconName="ios-pin-outline"
            />

            <Button
              onPress={this.openGenderScreen}
              text="NEXT"
              color="secondary"
              style={{ width: "100%", height: 40, marginTop: 30 }}
            />
          </KeyboardAwareScrollView>
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
            <View style={styles.genders}>
              <Gender
                gender="male"
                onPress={() => this.setState({ gender: MALE })}
                isSelected={gender == MALE}
              />
              <Gender
                gender="female"
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
