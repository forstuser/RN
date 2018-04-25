import React from "react";
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { Text, AsyncImage } from "../elements";
import { defaultStyles, colors } from "../theme";

class EasyLifeItem extends React.Component {
  render() {
    const {
      text,
      rightText,
      bottomText,
      showCheckbox = true,
      isChecked,
      imageUrl,
      onPress,
      showRemoveBtn = false,
      onRemoveBtnPress
    } = this.props;
    console.log("imageUrl: ", imageUrl);
    return (
      <View>
        <TouchableOpacity
          style={[
            styles.container,
            bottomText || imageUrl ? styles.bigContainer : {}
          ]}
          onPress={onPress}
        >
          {showCheckbox && (
            <View style={styles.checkbox}>
              {isChecked && (
                <Icon
                  name="md-checkmark"
                  color={colors.pinkishOrange}
                  size={15}
                />
              )}
            </View>
          )}
          {!showCheckbox && (
            <View
              style={[styles.selectBox, isChecked ? styles.selectedBox : {}]}
            >
              {isChecked && (
                <Icon name="md-checkmark" color={"#fff"} size={15} />
              )}
            </View>
          )}
          <View style={styles.texts}>
            <Text weight="Medium" style={styles.text} numberOfLines={1}>
              {text}
            </Text>
            {bottomText ? (
              <Text style={styles.subText}>{bottomText}</Text>
            ) : null}
          </View>
          {rightText ? <Text style={styles.subText}>{rightText}</Text> : null}
          {imageUrl ? (
            <AsyncImage source={{ uri: imageUrl }} style={styles.image} />
          ) : null}
        </TouchableOpacity>
        {showRemoveBtn && (
          <TouchableOpacity style={styles.removeBtn} onPress={onRemoveBtnPress}>
            <Icon name="md-remove" color="white" size={20} />
          </TouchableOpacity>
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
    backgroundColor: "red"
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
