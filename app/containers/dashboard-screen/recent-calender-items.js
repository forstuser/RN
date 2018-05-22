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
    const { items, navigation } = this.props;
    const { listHeight } = this.state;
    return (
      <View collapsable={false} style={styles.container}>
        <View
          collapsable={false}
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
                collapsable={false}
                key={index}
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
                  navigation={navigation}
                  hideViewBillBtn={true}
                  hideDirectionsAndCallBtns={true}
                />
              </View>
            );
          })}
        </View>
        {items.length > 1 ? (
          <ViewMoreBtn
            collapsable={false}
            height={listHeight}
            onPress={this.toggleListHeight}
          />
        ) : (
          <View collapsable={false} />
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
    width: "100%"
  },
  viewBtn: {
    alignItems: "center",
    marginTop: -20,
    elevation: 3
  }
});

export default RecentCalenderItems;
