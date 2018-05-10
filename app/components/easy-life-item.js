import React from "react";
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { Text, AsyncImage } from "../elements";
import { defaultStyles, colors } from "../theme";

class EasyLifeItem extends React.Component {
  render() {
    const {
      text,
      secondaryText,
      showCheckbox = true,
      checkBoxStyle = "box", //or 'circle'
      isChecked,
      imageUrl,
      onPress,
      showRemoveBtn = false,
      onRemoveBtnPress
    } = this.props;

    return (
      <View>
        <TouchableOpacity
          style={[styles.container, imageUrl ? styles.bigContainer : {}]}
          onPress={onPress}
        >
          {showCheckbox ? (
            <View
              style={[
                checkBoxStyle == "box" ? styles.checkbox : styles.selectBox,
                checkBoxStyle != "box" && isChecked
                  ? { backgroundColor: colors.success }
                  : {}
              ]}
            >
              {isChecked ? (
                <Icon
                  name="md-checkmark"
                  color={
                    checkBoxStyle == "box" ? colors.pinkishOrange : "white"
                  }
                  size={15}
                />
              ) : (
                <View />
              )}
            </View>
          ) : (
            <View />
          )}
          <View style={styles.texts}>
            <Text weight="Medium" style={styles.text} numberOfLines={1}>
              {text}
            </Text>
            {secondaryText && imageUrl ? (
              <Text style={styles.subText}>{secondaryText}</Text>
            ) : null}
          </View>
          {secondaryText && !imageUrl ? (
            <Text style={styles.subText}>{secondaryText}</Text>
          ) : null}
          {imageUrl ? (
            <AsyncImage source={{ uri: imageUrl }} style={styles.image} />
          ) : null}
        </TouchableOpacity>
        {showRemoveBtn ? (
          <TouchableOpacity style={styles.removeBtn} onPress={onRemoveBtnPress}>
            <Icon name="md-remove" color="white" size={20} />
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 5,
    height: 45,
    flexDirection: "row",
    ...defaultStyles.card,
    borderRadius: 5,
    alignItems: "center",
    paddingLeft: 14
  },
  bigContainer: {
    height: 70
  },
  removeBtn: {
    height: 27,
    width: 27,
    position: "absolute",
    top: 0,
    alignItems: "center",
    justifyContent: "center",
    right: 0,
    elevation: 2,
    borderRadius: 15,
    backgroundColor: colors.pinkishOrange
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.pinkishOrange,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center"
  },
  selectBox: {
    width: 26,
    height: 26,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 15
  },
  selectedBox: {
    backgroundColor: colors.success
  },
  texts: {
    flex: 1,
    marginHorizontal: 10
  },
  text: {},
  subText: {
    fontSize: 10,
    color: colors.secondaryText,
    marginRight: 10
  },
  image: {
    width: 80,
    height: 70,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5
  }
});

export default EasyLifeItem;
