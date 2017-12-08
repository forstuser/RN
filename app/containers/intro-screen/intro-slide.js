import React from "react";
import { Dimensions, StyleSheet, View, Image } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Text } from "../../elements";

import { colors } from "../../theme";

const IntroSlide = ({ image, title, desc }) => (
  <View style={styles.container}>
    <View style={styles.wrapper}>
      <LinearGradient
        start={{ x: 0.0, y: 0.8 }}
        end={{ x: 0.0, y: 1 }}
        colors={["#01c8ff", "#0ae2f1"]}
        style={styles.gradientBackground}
      >
        <View style={styles.contentWrapper}>
          <View style={styles.content}>
            <View style={styles.texts}>
              <Text weight="Bold" style={styles.title}>
                {title}
              </Text>
              <Text style={styles.desc}>{desc}</Text>
            </View>
            <View style={styles.imageWrapper}>
              <Image style={styles.image} source={image} resizeMode="contain" />
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
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
  wrapper: {
    position: "absolute",
    width: 1500,
    height: 1500,
    bottom: 100,
    borderRadius: 1500,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    backgroundColor: "#fff"
  },
  gradientBackground: {
    position: "absolute",
    width: 1500,
    height: 1500,
    borderRadius: 1500,
    overflow: "hidden"
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
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
    paddingHorizontal: 20
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
