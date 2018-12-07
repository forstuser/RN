import React from "react";
import { createStackNavigator } from "react-navigation";

import { SCREENS } from "../constants";

import UserOnBoardingScreen from "../containers/user-on-boarding-screen";
import BasicDetailsScreenOnBoarding from "../containers/user-on-boarding-screen/basic-details-screen";
import SelectGenderScreen from "../containers/user-on-boarding-screen/select-gender-screen";
import SelectCitiesScreenOnBoarding from "../containers/user-on-boarding-screen/select-cities-screen";
import VerifyMobileScreenOnBoarding from "../containers/user-on-boarding-screen/otp-screen";
import ShareLocationOnBoardingScreen from "../containers/user-on-boarding-screen/share-location-screen";

export default createStackNavigator({
  [SCREENS.USER_ON_BOARDING_SCREEN]: UserOnBoardingScreen,
  [SCREENS.BASIC_DETAILS_SCREEN_ONBOARDING]: BasicDetailsScreenOnBoarding,
  [SCREENS.SELECT_GENDER_SCREEN_ONBOARDING]: SelectGenderScreen,
  [SCREENS.SELECT_CITIES_SCREEN_ONBOARDING]: SelectCitiesScreenOnBoarding,
  [SCREENS.VERIFY_MOBILE_NUMBER_SCREEN_ONBOARDING]: VerifyMobileScreenOnBoarding,
  [SCREENS.SHARE_LOCATION_ONBOARDING_SCREEN]: ShareLocationOnBoardingScreen
});
