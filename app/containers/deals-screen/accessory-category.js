import React from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { Text } from "../../elements";
import AccessoryItem from "./accessory-item";
import { colors } from "../../theme";

export default class AccessoryCategory extends React.Component {
  render() {
    const { accessoryCategory } = this.props;
    const { accessory_items } = accessoryCategory;
    return (
      <View style={{ fontSize: 16, padding: 10, paddingRight: 0 }}>
        <Text weight="Bold" style={{ fontSize: 16, marginLeft: 5 }}>
          {accessoryCategory.title}
        </Text>
        <Text
          style={{
            fontSize: 11,
            color: colors.mainBlue,
            marginVertical: 5,
            marginLeft: 5
          }}
        >
          ({accessory_items.length} accessories available)
        </Text>
        <FlatList
          data={accessory_items}
          renderItem={({ item }) => <AccessoryItem item={item} />}
          horizontal={true}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }
}
