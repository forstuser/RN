import React, { Component } from "react";
import { View, Image, TouchableOpacity } from "react-native";

import { Text, Button } from "../../elements";
import { defaultStyles } from "../../theme";

class SingleDeliveryOrder extends Component {
  render() {
    const { order, onPress } = this.props;
    let name = <Text weight="Medium">{order.user.name}</Text>;
    let id = <Text weight="Medium">{order.id}</Text>;
    let quantity = <Text weight="Medium">{order.order_details.length}</Text>;

    return (
      <TouchableOpacity onPress={onPress} style={styles.container}>
        <View style={[styles.box, styles.box1]}>
          <Text
            style={{
              marginTop: -1,
              fontSize: 40,
              textAlign: "center",
              color: "#ababab"
            }}
          >
            31
          </Text>
          <Text
            style={{
              textAlign: "center",
              marginTop: 6,
              fontSize: 20,
              color: "#ababab"
            }}
          >
            Aug
          </Text>
        </View>
        <View style={[styles.box, styles.box2]}>
          <Text style={styles.name}>User: {name}</Text>
          <Text style={styles.id}>Order Id: {id}</Text>
          <Text style={styles.quantity}>No. of Items: {quantity}</Text>
          <Button
            style={{ height: 30, width: 120, marginTop: 10 }}
            text="Status"
            onPress={() => alert("Current Status")}
            color="secondary"
            textStyle={{ fontSize: 16 }}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = {
  container: {
    ...defaultStyles.card,
    flex: 1,
    flexDirection: "row",
    borderRadius: 10,
    margin: 10
  },
  box: {
    height: 150
  },
  box1: {
    flex: 2
  },
  box2: {
    flex: 8,
    marginLeft: 10
  },
  name: {
    marginTop: 10,
    fontSize: 16
  },
  id: {
    marginTop: 5,
    fontSize: 16
  },
  quantity: {
    marginTop: 5,
    fontSize: 16
  }
};

export default SingleDeliveryOrder;
