import React, { Component } from "react";
import { Platform, StyleSheet, View, Image } from "react-native";

import AppIntroSlider from "react-native-app-intro-slider";
import { openLoginScreen } from "../../navigation";
import I18n from "../../i18n";

import { Text } from "../../elements";
import { colors } from "../../theme";

import IntroSlide from "./intro-slide";

const slides = [
  {
    key: "slide1",
    title: I18n.t("app_intro_1_title"),
    desc: I18n.t("app_intro_1_desc"),
    image: require("../../images/onboarding/onboarding_apple_1.png")
  },
  {
    key: "slide2",
    title: I18n.t("app_intro_2_title"),
    desc: I18n.t("app_intro_2_desc"),
    image: require("../../images/onboarding/onboarding_apple_2.png")
  },
  {
    key: "slide3",
    title: I18n.t("app_intro_3_title"),
    desc: I18n.t("app_intro_3_desc"),
    image: require("../../images/onboarding/onboarding_apple_3.png")
  },
  {
    key: "slide4",
    title: I18n.t("app_intro_4_title"),
    desc: I18n.t("app_intro_4_desc"),
    image: require("../../images/onboarding/onboarding_apple_4.png")
  }
];

class Intro extends Component {
  renderNextButton = () => {
    return (
      <View style={styles.nextBtn}>
        <Text weight="Bold" style={styles.nextBtnText}>
          {I18n.t("app_intro_next")}
        </Text>
        {/*<Image
          style={styles.nextBtnArrow}
          source={require("../../images/ic_arrow_forward.png")}
        />*/}
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
      <View style={styles.nextBtn}>
        <Text weight="Bold" style={styles.nextBtnText}>
          {I18n.t("app_intro_register")}
        </Text>
      </View>
    );
  };
  render() {
    return (
      <AppIntroSlider
        renderSkipButton={this.renderSkipButton}
        renderDoneButton={this.renderDoneButton}
        renderNextButton={this.renderNextButton}
        dotColor="rgba(255, 255, 255, 0.3)"
        activeDotColor="#fff"
        onDone={openLoginScreen}
        onSkip={openLoginScreen}
        slides={slides}
        renderItem={IntroSlide}
        showSkipButton
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
    color: "#fff"
  },
  nextBtnArrow: {
    height: 25,
    width: 40
  }
});
export default Intro;
