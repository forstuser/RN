import React, { Component } from "react";
import { Platform, StyleSheet, View, Button } from "react-native";

import AppIntroSlider from "react-native-app-intro-slider";
import IntroSlide from "../components/intro-slide";
import { openLoginScreen } from "../navigation";
import I18n from "../i18n";

const slides = [
  {
    key: "slide1",
    text: I18n.t("app_intro_1"),
    image: require("../images/on_boarding_1.png")
  },
  {
    key: "slide2",
    text: I18n.t("app_intro_2"),
    image: require("../images/on_boarding_2.png")
  },
  {
    key: "slide3",
    text: I18n.t("app_intro_3"),
    image: require("../images/on_boarding_3.png")
  }
];

class Intro extends Component {
  render() {
    return (
      <AppIntroSlider
        dotColor="rgba(0, 158, 229, 0.3)"
        activeDotColor="#009ee5"
        onDone={openLoginScreen}
        slides={slides}
        renderItem={IntroSlide}
        bottomButton
      />
    );
  }
}

export default Intro;
