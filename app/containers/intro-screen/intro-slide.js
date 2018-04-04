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
      colors={["#008bd8", "#00acee"]}
      style={styles.gradientBackground}
    >
      {/* <Image
        style={styles.bg}
        source={require("../../images/onboarding/background.png")}
      /> */}
      <View style={styles.texts}>
        <Text style={styles.title}>
          {title}
        </Text>
        {/* <Text style={styles.desc}>{desc}</Text> */}
      </View>
      <View style={styles.content}>
        <View style={styles.imageWrapper}>
          <Image style={styles.image} source={image} resizeMode="contain" />
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
    alignItems: "center",
    justifyContent: "center",
    flex: 3,
    // top: 50
  },
  texts: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    color: "#fff",
    paddingHorizontal: 20,
    marginTop: 25,
    lineHeight: 30
  },
  desc: {
    marginTop: 15,
    textAlign: "center",
    color: "#fff",
    paddingHorizontal: 20
  },
  imageWrapper: {
    width: "100%",
    padding: 40,
    alignItems: 'center',
    flex: 1,
    maxWidth: 370,
    maxHeight: 377
  },
  image: {
    position: "absolute",
    width: "100%",
    height: "100%",
    bottom: 75
  }
});

export default IntroSlide;
