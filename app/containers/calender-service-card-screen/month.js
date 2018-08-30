import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";
import { Text, Button } from "../../elements";
import { colors } from "../../theme";

class Month extends React.Component {
  render() {
    const {
      paymentDetails,
      activePaymentDetailIndex,
      onPaymentDetailIndexChange
    } = this.props;
    const activeMonth = paymentDetails[activePaymentDetailIndex];
    const isNextMonthAvailable = activePaymentDetailIndex > 0;
    const isPreviousMonthAvailable =
      activePaymentDetailIndex < paymentDetails.length - 1;

    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() =>
            onPaymentDetailIndexChange(activePaymentDetailIndex + 1)
          }
          disabled={!isPreviousMonthAvailable}
          style={styles.arrow}
        >
          <Icon
            name="ios-arrow-back"
            size={30}
            color={isPreviousMonthAvailable ? "#fff" : colors.lighterText}
          />
        </TouchableOpacity>

        <Text
          weight="Bold"
          style={{
            fontSize: 18,
            color: "#fff",
            flex: 1,
            textAlign: "center"
          }}
        >
          {moment(activeMonth.start_date.substr(0, 10)).format("MMMM YYYY")}
        </Text>

        <TouchableOpacity
          onPress={() =>
            onPaymentDetailIndexChange(activePaymentDetailIndex - 1)
          }
          disabled={!isNextMonthAvailable}
          style={styles.arrow}
        >
          <Icon
            name="ios-arrow-forward"
            size={30}
            color={isNextMonthAvailable ? "#fff" : colors.lighterText}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 3,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 0,
    paddingVertical: 5,
    backgroundColor: colors.mainBlue
  },
  arrows: {
    flexDirection: "row"
  },
  arrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    margin: 5
  },
  disabledArrow: {
    backgroundColor: colors.lighterText
  }
});

export default Month;
