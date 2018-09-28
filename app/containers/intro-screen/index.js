import React, { Component } from "react";
import { Platform, StyleSheet, View, Image, Dimensions } from "react-native";

import AppIntroSlider from "react-native-app-intro-slider";
import I18n from "../../i18n";

import { Text, Button } from "../../elements";
import { colors } from "../../theme";

import IntroSlide from "./intro-slide";
import { SCREENS } from "../../constants";

const slides = [
  {
    key: "slide1",
    header: I18n.t("app_intro_1_header"),
    title: I18n.t("app_intro_1_title"),
    desc: I18n.t("app_intro_1_desc"),
    image: require("../../images/onboarding/onboarding1.png")
  },
  {
    key: "slide2",
    header: I18n.t("app_intro_2_header"),
    title: I18n.t("app_intro_2_title"),
    desc: I18n.t("app_intro_2_desc"),
    image: require("../../images/onboarding/onboarding2.png")
  },
  {
    key: "slide3",
    header: I18n.t("app_intro_3_header"),
    title: I18n.t("app_intro_3_title"),
    desc: I18n.t("app_intro_3_desc"),
    image: require("../../images/onboarding/onboarding3.png")
  },
  {
    key: "slide4",
    header: I18n.t("app_intro_4_header"),
    title: I18n.t("app_intro_4_title"),
    desc: I18n.t("app_intro_4_desc"),
    image: require("../../images/onboarding/onboarding4.png")
  },
  {
    key: "slide5",
    header: I18n.t("app_intro_5_header"),
    title: I18n.t("app_intro_5_title"),
    desc: I18n.t("app_intro_5_desc"),
    image: require("../../images/onboarding/onboarding5.png")
  }
];

class Intro extends Component {
  openLoginScreen = () => {
    this.props.navigation.navigate(SCREENS.AUTH_STACK);
  };

  renderNextButton = () => {
    return (
      <View collapsable={false} style={styles.nextBtn}>
        <Text weight="Bold" style={styles.nextBtnText}>
          {I18n.t("app_intro_next")}
        </Text>
        {/* <Button
          onPress={this.renderNextButton}
          text={I18n.t("app_intro_next")}
          weight="Bold"
          color="secondary"
          borderRadius={0}
          style={styles.doneBtn}
        /> */}
      </View>
    );
  };

  renderSkipButton = () => {
    return (
      <View collapsable={false} style={styles.nextBtn}>
        <Text weight="Bold" style={styles.nextBtnText}>
          {I18n.t("app_intro_skip")}
        </Text>
      </View>
    );
  };

  renderDoneButton = () => {
    return (
      <View collapsable={false} style={styles.doneBtnContainer}>
        <Button
          onPress={this.openLoginScreen}
          text={I18n.t("app_intro_start")}
          weight="Bold"
          color="secondary"
          // borderRadius={0}
          style={styles.doneBtn}
        />
      </View>
    );
  };

  render() {
    return (
      <AppIntroSlider
        // renderSkipButton={this.renderSkipButton}
        renderDoneButton={this.renderDoneButton}
        renderNextButton={this.renderNextButton}
        dotColor="#fdd4c0"
        activeDotColor={colors.pinkishOrange}
        onDone={this.openLoginScreen}
        onSkip={this.openLoginScreen}
        slides={slides}
        renderItem={IntroSlide}
        // bottomButton={true}
        // buttonStyle={styles.doneBtn}
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
    width: 320,
    borderRadius: 50,
    backgroundColor: colors.pinkishOrange
  }
});
export default Intro;
