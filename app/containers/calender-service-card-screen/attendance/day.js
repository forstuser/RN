import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import moment from "moment";
import I18n from "../../../i18n";
import { Text, Button } from "../../../elements";
import { colors, defaultStyles } from "../../../theme";

class Month extends React.Component {
  render() {
    const { date, isPresent = true, toggleAttendance } = this.props;

    return (
      <View style={styles.container}>
        <Text weight="Medium" style={styles.date}>
          {moment(date).format("D MMMM YYYY")}
        </Text>
        <TouchableOpacity
          onPress={toggleAttendance}
          style={styles.presentAbsentContainer}
        >
          <Text
            weight="Medium"
            style={[styles.presentAbsent, !isPresent ? styles.absent : {}]}
          >
            {I18n.t("calendar_service_screen_absent")}
          </Text>
          <Text
            weight="Medium"
            style={[styles.presentAbsent, isPresent ? styles.present : {}]}
          >
            {I18n.t("calendar_service_screen_present")}
          </Text>
        </TouchableOpacity>
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
  present: {
    backgroundColor: colors.success,
    color: "#fff"
  },
  absent: {
    backgroundColor: colors.danger,
    color: "#fff"
  }
});

export default Month;
