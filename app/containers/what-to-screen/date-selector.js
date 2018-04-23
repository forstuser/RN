import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";
import { Text, Button } from "../../elements";
import { colors } from "../../theme";

const DateSelector = ({
  date,
  onLeftArrowPress,
  onRightArrowPress,
  isPreviousDateAvailable,
  isNextDateAvailable
}) => {
  return (
    <LinearGradient
      style={styles.container}
      start={{ x: 0.0, y: 0.1 }}
      end={{ x: 0.9, y: 0.9 }}
      colors={[colors.aquaBlue, colors.mainBlue]}
    >
      <TouchableOpacity
      // onPress={() =>
      //   onPaymentDetailIndexChange(activePaymentDetailIndex + 1)
      // }
      >
        <View
          style={[
            styles.arrow
            //     !isPreviousMonthAvailable && styles.disabledArrow
          ]}
        >
          <Icon name="ios-arrow-back" size={23} color={colors.mainBlue} />
        </View>
      </TouchableOpacity>
      <Text
        weight="Bold"
        style={{ textAlign: "center", fontSize: 18, color: "#fff", flex: 1 }}
      >
        {moment(date).format("DD MMMM, YYYY")}
      </Text>
      <View style={styles.arrows}>
        <TouchableOpacity
        // onPress={() =>
        //   onPaymentDetailIndexChange(activePaymentDetailIndex - 1)
        // }
        >
          <View
            style={[
              styles.arrow
              //     !isNextMonthAvailable && styles.disabledArrow
            ]}
          >
            <Icon name="ios-arrow-forward" size={23} color={colors.mainBlue} />
          </View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 3,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 8
  },
  arrows: {
    flexDirection: "row"
  },
  arrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#fff",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    margin: 5
  },
  disabledArrow: {
    backgroundColor: colors.lighterText
  }
});

export default DateSelector;
