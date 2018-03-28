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
import { Text, Button } from "../elements";
import I18n from "../i18n";
import { colors, defaultStyles } from "../theme";
import UpcomingServiceItem from "./upcoming-service-item";

class UpcomingServicesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listHeight: "less"
    };
  }

  toggleListHeight = () => {
    if (this.state.listHeight == "less") {
      this.setState({
        listHeight: "auto"
      });
    } else {
      this.setState({
        listHeight: "less"
      });
    }
  };
  render() {
    const upcomingServices = this.props.upcomingServices;
    const listHeight = this.state.listHeight;
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.list,
            defaultStyles.card,
            listHeight == "less" ? styles.listLessHeight : {}
          ]}
        >
          {upcomingServices.map((item, index) => (
            <UpcomingServiceItem
              key={index}
              item={item}
              navigator={this.props.navigator}
            />
          ))}
        </View>
        {upcomingServices.length > 2 && (
          <TouchableOpacity
            style={styles.viewBtn}
            onPress={this.toggleListHeight}
          >
            <View
              style={{
                backgroundColor: colors.pinkishOrange,
                height: 36,
                width: 36,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 18
              }}
            >
              <Icon
                name={listHeight == "less" ? "ios-arrow-down" : "ios-arrow-up"}
                size={28}
                color="#fff"
              />
            </View>
            <Text style={{ color: colors.pinkishOrange, fontSize: 12 }}>
              {listHeight == "less"
                ? I18n.t("component_items_view_more")
                : I18n.t("component_items_view_less")}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center"
  },
  list: {
    width: "100%",
    minHeight: 50,
    overflow: "hidden",
    backgroundColor: "#fff"
  },
  listLessHeight: {
    maxHeight: 131
  },
  viewBtn: {
    alignItems: "center",
    marginTop: -20,
    elevation: 3
  }
});

export default UpcomingServicesList;
