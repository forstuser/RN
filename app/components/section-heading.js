import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "../elements";

const SectionHeading = ({ text, setRef }) => (
  <View collapsable={false}  ref={setRef} style={styles.sectionHeading}>
    <View collapsable={false}  style={styles.sectionHeadingTopBorder} />
    <Text weight={"Bold"} style={styles.sectionHeadingText}>
      {text}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  sectionHeading: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 10
  },
  sectionHeadingTopBorder: {
    width: 40,
    height: 2,
    backgroundColor: "#e6e6e6"
  },
  sectionHeadingText: {
    padding: 10,
    fontSize: 12
  }
});

export default SectionHeading;
