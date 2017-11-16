import React, { Component } from "react";
import { Platform, StyleSheet, View, Button } from "react-native";

import AppIntroSlider from "react-native-app-intro-slider";
import IntroSlide from "../components/intro-slide";
import { openLoginScreen } from "../navigation";

const slides = [
  {
    key: "slide1",
    text:
      "No more hassle over bills, just click and upload, we will manage them for you",
    image: require("../images/on_boarding_1.png")
  },
  {
    key: "slide2",
    text:
      "Access your bills 24x7, enjoy delightful after sales communication and track your expenses",
    image: require("../images/on_boarding_2.png")
  },
  {
    key: "slide3",
    text:
      "We not only securely store your bills, but also help you build your e-home, adding value to the bills.",
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
