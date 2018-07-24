import React from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
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
      <LinearGradient
        style={styles.container}
        start={{ x: 0.0, y: 0.1 }}
        end={{ x: 0.9, y: 0.9 }}
        colors={[colors.aquaBlue, colors.mainBlue]}
      >
        <Text weight="Bold" style={{ fontSize: 18, color: "#fff", flex: 1 }}>
          {moment(activeMonth.start_date.substr(0, 10)).format("MMMM YYYY")}
        </Text>
        <View collapsable={false}  style={styles.arrows}>
          <TouchableWithoutFeedback
            onPress={() =>
              onPaymentDetailIndexChange(activePaymentDetailIndex + 1)
            }
          >
            <View collapsable={false} 
              style={[
                styles.arrow,
                !isPreviousMonthAvailable && styles.disabledArrow
              ]}
            >
              <Icon name="ios-arrow-back" size={23} color={colors.mainBlue} />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() =>
              onPaymentDetailIndexChange(activePaymentDetailIndex - 1)
            }
          >
            <View collapsable={false} 
              style={[
                styles.arrow,
                !isNextMonthAvailable && styles.disabledArrow
              ]}
            >
              <Icon
                name="ios-arrow-forward"
                size={23}
                color={colors.mainBlue}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 3,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 13
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

export default Month;
