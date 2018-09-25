import React from "react";
import { Dimensions, StyleSheet, View, Image } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Text } from "../../elements";

import { colors } from "../../theme";

const IntroSlide = ({ image, title, desc }) => (
  <View collapsable={false} style={styles.container}>
    <LinearGradient
      start={{ x: 0.0, y: 0.4 }}
      end={{ x: 0.0, y: 1 }}
      colors={["#fff", "#fff"]}
      style={styles.gradientBackground}
    >
      {/* <Image
        style={styles.bg}
        source={require("../../images/onboarding/background.png")}
      /> */}
      <View collapsable={false} style={styles.content}>
        <View collapsable={false}>
          <Image style={styles.image} source={image} resizeMode="contain" />
        </View>
      </View>
      <View collapsable={false} style={styles.texts}>
        <Text style={styles.title} weight="Bold">
          {title}
        </Text>
        <Text style={styles.desc} weight="Medium">
          {desc}
        </Text>
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
  texts: {
    height: 240,
    alignItems: "center"
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    color: colors.mainText,
    paddingHorizontal: 20
  },
  desc: {
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
    color: colors.mainText,
    paddingHorizontal: 20,
    maxWidth: 370
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    flex: 1
  },
  image: {
    // position: "absolute",
    width: 292,
    height: 269
    // bottom: 75
  }
});

export default IntroSlide;
