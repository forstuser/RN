import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import { colors, defaultStyles } from "../../theme";

import ViewMoreBtn from "../../components/view-more-btn";
import { Text, Button } from "../../elements";
import Item from "../my-calendar-screen/item";

class RecentCalenderItems extends React.Component {
  state = {
    listHeight: "less"
  };

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
    const { items, navigator } = this.props;
    const { listHeight } = this.state;
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.list,
            defaultStyles.card,
            listHeight == "less" ? styles.listLessHeight : {}
          ]}
        >
          {items.map((item, index) => {
            if (listHeight == "less" && index > 0) return null;

            return (
              <View
                style={{
                  borderBottomColor: "#efefef",
                  borderBottomWidth: 1
                }}
              >
                <Item
                  key={index}
                  style={{
                    elevation: undefined,
                    shadowColor: "transparent",
                    marginBottom: 0
                  }}
                  item={item}
                  navigator={navigator}
                  hideViewBillBtn={true}
                  hideDirectionsAndCallBtns={true}
                />
              </View>
            );
          })}
        </View>
        {items.length > 1 && (
          <ViewMoreBtn height={listHeight} onPress={this.toggleListHeight} />
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
    minHeight: 50
  },
  listLessHeight: {
    maxHeight: 70
  },
  viewBtn: {
    alignItems: "center",
    marginTop: -20,
    elevation: 3
  }
});

export default RecentCalenderItems;
