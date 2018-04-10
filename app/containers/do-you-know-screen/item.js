import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Platform,
  Alert,
  ToastAndroid
} from "react-native";
import RNFetchBlob from "react-native-fetch-blob";
import ViewShot, { captureRef } from "react-native-view-shot";
import Share from "react-native-share";

import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/EvilIcons";

import Analytics from "../../analytics";
import { requestStoragePermission } from "../../android-permissions";
import { API_BASE_URL } from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";
import I18n from "../../i18n";
import { colors } from "../../theme";

const roadblockIcon = require("../../images/ic_roadblock.png");
const binbillLogo = require("../../images/binbill_logo_long.png");
const playStoreBadge = require("../../images/playstore_badge.png");
const appStoreBadge = require("../../images/appstore_badge.png");

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default class Item extends React.Component {
  onSharePress = async () => {
    Analytics.logEvent(Analytics.EVENTS.CLICK_ON_SHARE_DYK)
    const { item } = this.props;
    if (Platform.OS == "ios") {
      try {
        await Share.open({
          message: `Powered by BinBill - ${item.short_url}`
        });
      } catch (e) {
        console.log("e: ", e);
      }
    } else {
      if (await requestStoragePermission()) {
        const filePath = RNFetchBlob.fs.dirs.DCIMDir + `/fact.jpg`;

        captureRef(this.viewToShare, {
          format: "jpg",
          quality: 0.8
        })
          .then(uri => {
            console.log("Image saved to", uri);
            return RNFetchBlob.fs.cp(uri, filePath);
          })
          .then(() => {
            console.log("Image saved to", filePath + "/fact.jpg");
            return Share.open({
              url: `file://${filePath}`,
              message: `Powered by BinBill - ${item.short_url}`
            });
          })
          .catch(error => console.error("Oops, snapshot failed", error));
      }
    }
  };
  render() {
    console.log("Screen height", SCREEN_HEIGHT)
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
          <View
            ref={ref => (this.viewToShare = ref)}
            style={styles.shareView}
            collapsable={false}
          >
            <Image
              style={styles.image}
              source={{ uri: API_BASE_URL + imageUrl }}
            />
            <View style={styles.content}>
              <View style={styles.shareAndLike} />
              <Text weight="Medium" style={styles.title}>
                {title}
              </Text>
              <Text style={styles.description}>{description}</Text>
            </View>
            <View style={styles.badges}>
              <View style={styles.binbillLogoWrapper}>
                <Image
                  resizeMode="contain"
                  style={styles.binbillLogo}
                  source={binbillLogo}
                />
              </View>
              <Image
                resizeMode="contain"
                style={styles.storeBadge}
                source={appStoreBadge}
              />
              <Image
                resizeMode="contain"
                style={styles.storeBadge}
                source={playStoreBadge}
              />
            </View>
          </View>
          <View style={styles.innerContainer}>
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
              <View style={styles.shareAndLike}>
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
              </View>
              <Text weight="Medium" style={styles.title}>
                {title}
              </Text>
              <Text style={styles.description}>{description}</Text>
              <View style={styles.tags}>
                <Text weight="Bold"
                  style={{ height: 15, marginRight: 5, color: colors.mainBlue, fontSize: 10 }}
                >Tags: {tags.map(tag => tag.title).join(', ')}</Text>
              </View>
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
    borderRadius: 5,
    margin: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1
  },
  shareView: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 5,
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
    borderColor: "#eee",
    borderWidth: 1
  },
  badges: {
    flexDirection: "row",
    borderColor: "#eee",
    borderTopWidth: 1,
    alignItems: "center",
    height: 40,
    paddingLeft: 10,
    paddingRight: 7
  },
  binbillLogoWrapper: {
    flex: 1
  },
  binbillLogo: {
    height: 20,
    width: 70
  },
  storeBadge: {
    height: 20,
    width: 70,
    marginLeft: 5
  },
  innerContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 5
  },
  image: {
    flex: SCREEN_HEIGHT > 620 ? 2 : 2,
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
    paddingBottom: 10,
    marginTop: -38
  },
  shareAndLike: {
    height: 40,
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  shareButton: {
    marginRight: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
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
    fontSize: SCREEN_HEIGHT > 620 ? 17 : 14,
    color: colors.mainText
  },
  description: {
    fontSize: SCREEN_HEIGHT > 620 ? 14 : 12,
    // marginTop: 1,
    flex: 1
  },
  tags: {
    // paddingTop: 10,
    flexDirection: "row"
  },
  endMsg: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 16
  },
  roadBlockIcon: {
    width: 95,
    height: 65
  },
  endMsgText: {
    fontSize: 12,
    color: colors.lighterText,
    marginVertical: 10,
    textAlign: "center"
  }
});
