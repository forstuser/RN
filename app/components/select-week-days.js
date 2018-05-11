import React from "React";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import { Text } from "../elements";
import { colors } from "../theme";

const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const SelectWeekDays = ({ selectedDays = [], onDayPress, itemSize = 34 }) => {
  return (
    <View collapsable={false}  style={styles.container}>
      {[1, 2, 3, 4, 5, 6, 7].map(day => (
        <TouchableOpacity
          key={day}
          style={[
            styles.weekDay,
            { width: itemSize, height: itemSize },
            selectedDays.indexOf(day) > -1 ? styles.selectedWeekDay : {}
          ]}
          onPress={() => onDayPress(day)}
        >
          <Text weight="Bold" style={styles.weekDayText}>
            {weekDays[day - 1]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row"
  },
  weekDay: {
    backgroundColor: colors.secondaryText,
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    borderRadius: 17
  },
  selectedWeekDay: {
    backgroundColor: colors.success
  },
  weekDayText: {
    fontSize: 10,
    color: "#fff"
  }
});

export default SelectWeekDays;
