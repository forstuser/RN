import React from "react";
import { Dimensions, StyleSheet, View, Image } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Text } from "../../elements";

import { colors } from "../../theme";

const IntroSlide = ({ image, title, desc }) => (
  <View style={styles.container}>
    <LinearGradient
      start={{ x: 0.0, y: 0.4 }}
      end={{ x: 0.0, y: 1 }}
      colors={["#badcf2", "#68a0d3"]}
      style={styles.gradientBackground}
    >
      <Image
        style={styles.bg}
        source={require("../../images/onboarding/background.png")}
      />
      <View style={styles.content}>
        <View style={styles.imageWrapper}>
          <Image style={styles.image} source={image} resizeMode="contain" />
        </View>
        <View style={styles.texts}>
          <Text weight="Bold" style={styles.title}>
            {title}
          </Text>
          <Text style={styles.desc}>{desc}</Text>
        </View>
      </View>
    </LinearGradient>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  },
  gradientBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    overflow: "hidden"
  },
  bg: {
    position: "absolute",
    width: "100%",
    height: "100%"
  },
  content: {
    height: Dimensions.get("window").height - 100,
    width: Dimensions.get("window").width,
    justifyContent: "flex-end"
  },
  texts: {},
  title: {
    fontSize: 18,
    textAlign: "center",
    color: "#fff",
    paddingHorizontal: 20,
    marginTop: 25
  },
  desc: {
    marginTop: 15,
    textAlign: "center",
    color: "#fff",
    paddingHorizontal: 20
  },
  imageWrapper: {
    alignSelf: "center",
    width: "98%",
    flex: 1,
    maxWidth: 370,
    maxHeight: 377
  },
  image: {
    position: "absolute",
    width: "100%",
    height: "100%",
    bottom: -15
  }
});

export default IntroSlide;
