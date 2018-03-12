import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Platform,
  Alert
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/EvilIcons";

import { API_BASE_URL } from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";
import I18n from "../../i18n";
import { colors } from "../../theme";

const roadblockIcon = require("../../images/ic_roadblock.png");

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default class Item extends React.Component {
  onSharePress = () => {
    Alert.alert("WIP");
  };
  render() {
    const { item, onLikePress } = this.props;
    if (item) {
      const {
        id,
        title,
        imageUrl,
        description,
        tags,
        totalLikes,
        isLikedByUser,
        isTogglingLike
      } = item;
      return (
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={{ uri: API_BASE_URL + imageUrl }}
          />
          <View style={styles.likes}>
            <Icon name="heart" size={12} color="red" />
            <Text weight="Medium" style={styles.likesCount}>
              {totalLikes}
            </Text>
          </View>
          <View style={styles.content}>
            <View style={styles.likeButtonContainer}>
              {isTogglingLike && <ActivityIndicator size="small" />}
              {!isTogglingLike && (
                <TouchableOpacity
                  onPress={onLikePress}
                  style={styles.likeButton}
                >
                  <Icon
                    name={isLikedByUser ? "heart" : "heart-o"}
                    size={20}
                    color="red"
                  />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              onPress={this.onSharePress}
              style={styles.shareButton}
            >
              <Icon2
                name={Platform.OS == "ios" ? "share-apple" : "share-google"}
                size={30}
                color={colors.mainBlue}
              />
            </TouchableOpacity>

            <Text weight="Medium" style={styles.title}>
              {title}
            </Text>
            <Text style={styles.description}>{description}</Text>
            <View style={styles.tags}>
              {tags.map(tag => (
                <Button
                  key={tag.title}
                  text={tag.title.toUpperCase()}
                  color="secondary"
                  style={{ height: 30, marginRight: 5 }}
                  gradientStyle={{ paddingHorizontal: 10 }}
                  textStyle={{ fontSize: 10 }}
                />
              ))}
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.endMsg}>
            <Image style={styles.roadBlockIcon} source={roadblockIcon} />
            <Text weight="Medium" style={styles.endMsgText}>
              {I18n.t("do_you_know_screen_end_msg")}
            </Text>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 5,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1
  },
  image: {
    flex: SCREEN_WIDTH > 320 ? 3 : 2,
    borderRadius: 5,
    overflow: "hidden"
  },
  likes: {
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    backgroundColor: "#fff",
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1
  },
  likesCount: {
    fontSize: 12,
    marginLeft: 6
  },
  content: {
    flex: 3,
    padding: 16,
    marginTop: 2
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    position: "absolute",
    top: -22,
    right: 60,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1
  },
  likeButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    position: "absolute",
    top: -22,
    right: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1
  },
  likeButton: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: SCREEN_WIDTH > 320 ? 18 : 14,
    color: colors.mainText
  },
  description: {
    fontSize: SCREEN_WIDTH > 320 ? 14 : 12,
    marginTop: 10,
    flex: 1
  },
  tags: {
    paddingVertical: 15,
    flexDirection: "row"
  },
  share: {
    flexDirection: "row",
    alignItems: "center"
  }
});
