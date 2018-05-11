import React, { Component } from "react";
import { Platform, StyleSheet, View, Image, Dimensions } from "react-native";

import AppIntroSlider from "react-native-app-intro-slider";
import { openLoginScreen } from "../../navigation";
import I18n from "../../i18n";

import { Text, Button } from "../../elements";
import { colors } from "../../theme";

import IntroSlide from "./intro-slide";

const slides = [
  {
    key: "slide1",
    title: I18n.t("app_intro_1_title"),
    desc: I18n.t("app_intro_1_desc"),
    image: require("../../images/onboarding/onboarding1.png")
  },
  {
    key: "slide2",
    title: I18n.t("app_intro_2_title"),
    desc: I18n.t("app_intro_2_desc"),
    image: require("../../images/onboarding/onboarding2.png")
  },
  {
    key: "slide3",
    title: I18n.t("app_intro_5_title"),
    desc: I18n.t("app_intro_5_desc"),
    image: require("../../images/onboarding/onboarding5.png")
  },
  {
    key: "slide4",
    title: I18n.t("app_intro_3_title"),
    desc: I18n.t("app_intro_3_desc"),
    image: require("../../images/onboarding/onboarding3.png")
  },
  {
    key: "slide5",
    title: I18n.t("app_intro_4_title"),
    desc: I18n.t("app_intro_4_desc"),
    image: require("../../images/onboarding/onboarding4.png")
  }
];

class Intro extends Component {
  renderNextButton = () => {
    return (
      <View style={styles.nextBtn}>
        <Text weight="Bold" style={styles.nextBtnText}>
          {I18n.t("app_intro_next")}
        </Text>
        {/* <Image
          style={styles.nextBtnArrow}
          source={require("../../images/ic_arrow_forward.png")}
        /> */}
      </View>
    );
  };

  renderSkipButton = () => {
    return (
      <View style={styles.nextBtn}>
        <Text weight="Bold" style={styles.nextBtnText}>
          {I18n.t("app_intro_skip")}
        </Text>
      </View>
    );
  };

  renderDoneButton = () => {
    return (
      <View style={styles.doneBtnContainer}>
        <Button
          onPress={openLoginScreen}
          text={I18n.t("app_intro_register")}
          weight="Bold"
          style={styles.doneBtn}
        />
      </View>
    );
  };

  render() {
    return (
      <AppIntroSlider
        renderSkipButton={this.renderSkipButton}
        renderDoneButton={this.renderDoneButton}
        renderNextButton={this.renderNextButton}
        dotColor="#cef0ff"
        activeDotColor="#00b2ff"
        onDone={openLoginScreen}
        onSkip={openLoginScreen}
        slides={slides}
        renderItem={IntroSlide}
      />
    );
  }
}

const styles = StyleSheet.create({
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    paddingBottom: 8
  },
  nextBtnText: {
    fontSize: 16,
    color: colors.mainText
  },
  nextBtnArrow: {
    height: 25,
    width: 40
  },
  doneBtnContainer: {
    width: Dimensions.get("window").width - 32,
    alignItems: "center"
  },
  doneBtn: {
    width: 250
  }
});
export default Intro;
