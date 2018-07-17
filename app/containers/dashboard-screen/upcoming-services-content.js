import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  FlatList
} from "react-native";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";
import { Text, Button } from "../../elements";
import I18n from "../../i18n";
import { colors, defaultStyles } from "../../theme";
import UpcomingServiceItem from "./upcoming-service-item";

class UpcomingServicesList extends React.Component {
  constructor(props) {
    super(props);
  }

  getRemainingDays = item => {
    let date;
    switch (item.productType) {
      case 2:
      case 3:
      case 4:
      case 5:
        date = moment(item.expiryDate);
        break;
      case 6:
        date = moment(item.schedule ? item.schedule.due_date : null);
        break;
      default:
        date = moment(item.dueDate);
    }
    const diff = date.diff(
      moment()
        .utcOffset("+0000")
        .startOf("day"),
      "days"
    );
    return diff;
  };

  render() {
    const upcomingServices = this.props.upcomingServices
      .map(service => {
        return { ...service, daysRemaining: this.getRemainingDays(service) };
      })
      .sort((a, b) => a.daysRemaining - b.daysRemaining);

    if (upcomingServices.length == 0) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: "#EAF6FC"
              }}
            />

            <Image
              style={{ width: 80, height: 90, marginTop: -65 }}
              source={require("../../images/bell.png")}
              resizeMode="contain"
            />
          </View>
          <Text weight="Bold" style={{ fontSize: 16, color: "#c2c2c2" }}>
            Nothing due in upcoming period
          </Text>
        </View>
      );
    } else {
      return (
        <FlatList
          data={upcomingServices}
          renderItem={({ item }) => (
            <UpcomingServiceItem
              item={item}
              navigation={this.props.navigation}
            />
          )}
          keyExtractor={(item, index) => index}
        />
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center"
  },
  list: {
    width: "100%"
  },
  viewBtn: {
    alignItems: "center",
    marginTop: -20,
    elevation: 3
  }
});

export default UpcomingServicesList;
