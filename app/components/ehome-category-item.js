import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import moment from "moment";
import { Text, Button, Image } from "../elements";
import I18n from "../i18n";
import { colors } from "../theme";

const EhomeCategoryItem = ({
  imageUrl,
  name,
  itemsCount = 0,
  lastUpdatedTime,
  onPress
}) => (
  <TouchableOpacity onPress={onPress} style={styles.container}>
    <View style={styles.imageAndName}>
      <Image
        style={styles.image}
        source={{
          uri: imageUrl
        }}
      />
      <Text weight="Medium" style={styles.categoryName}>
        {name}
      </Text>
    </View>
    <View style={styles.countAndTime}>
      <Text weight="Medium" style={styles.itemsCount}>
        {I18n.t("ehome_screen_items_category_item_count", {
          count: itemsCount
        })}
      </Text>
      {lastUpdatedTime && (
        <Text style={styles.lastUpdateTime}>
          {I18n.t("ehome_screen_items_category_item_last_updated", {
            date: moment(lastUpdatedTime)
              .format("DD MMM, YYYY")
              .toUpperCase()
          })}
        </Text>
      )}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    paddingTop: 14,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    marginBottom: 5,
    margin: 5,
    borderRadius: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 2
  },
  imageAndName: {
    flexDirection: "row",
    alignItems: "center",
    height: 60
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 16
  },
  categoryName: {
    fontSize: 22,
    color: colors.mainText,
    flex: 1
  },
  countAndTime: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#f1f1f1",
    borderTopWidth: 2,
    marginTop: 12,
    paddingVertical: 6
  },
  itemsCount: {
    color: colors.mainText,
    fontSize: 16
  },
  lastUpdateTime: {
    flex: 1,
    color: colors.mainText,
    textAlign: "right",
    fontSize: 12
    // color: colors.lighterText
  }
});
export default EhomeCategoryItem;
