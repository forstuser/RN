import React from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import { Text, Button } from "../../../elements";
import { colors, defaultStyles } from "../../../theme";

class Month extends React.Component {
  render() {
    const { date, isPresent = true } = this.props;

    return (
      <View style={styles.container}>
        <Text weight="Medium" style={styles.date}>
          {date}
        </Text>
        <View style={styles.presentAbsentContainer}>
          <Text weight="Medium" style={[styles.presentAbsent, styles.absent]}>
            Absent
          </Text>
          <Text weight="Medium" style={[styles.presentAbsent, styles.present]}>
            Present
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    borderRadius: 3,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 13,
    ...defaultStyles.card
  },
  date: {
    flex: 1
  },
  presentAbsentContainer: {
    flexDirection: "row",
    backgroundColor: "#efefef",
    borderColor: "#999",
    borderWidth: 1,
    borderRadius: 2
  },
  presentAbsent: {
    fontSize: 9,
    padding: 8
  },
  present: {},
  absent: {}
});

export default Month;
