import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  Image,
  Alert,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import { Text, Button, ScreenContainer, AsyncImage } from "../../elements";
import { getProfileDetail, API_BASE_URL } from "../../api";

const noPicPlaceholderIcon = require("../../images/ic_more_no_profile_pic.png");

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: null
    };
  }

  async componentDidMount() {
    try {
      const res = await getProfileDetail();
      this.setState({
        profile: res.userProfile
      });
    } catch (e) {
      Alert.alert(e.message);
    }
  }

  onProfileItemPress = () => {
    this.props.navigator.push({
      screen: "ProfileScreen",
      passProps: { profile: this.state.profile }
    });
  };

  render() {
    const profile = this.state.profile;
    let profilePic = (
      <Image
        style={{ width: "100%", height: "100%" }}
        source={noPicPlaceholderIcon}
      />
    );
    if (profile && profile.image_name) {
      profilePic = (
        <AsyncImage
          style={{ width: "100%", height: "100%" }}
          uri={API_BASE_URL + profile.imageUrl}
        />
      );
    }
    return (
      <View style={styles.header}>
        {profile && (
          <TouchableOpacity onPress={this.onProfileItemPress}>
            <View style={styles.backgroundImg}>{profilePic}</View>
            <View style={styles.overlay} />
            <View style={styles.headerInner}>
              <View style={styles.profilePicWrapper}>{profilePic}</View>
              <View style={styles.centerText}>
                <Text style={styles.name} weight="Bold">
                  {profile.name}
                </Text>
                <Text style={styles.mobile} weight="Medium">
                  {profile.mobile_no}
                </Text>
              </View>
              <Image
                style={{ width: 12, height: 12 }}
                source={require("../../images/ic_processing_arrow.png")}
              />
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    height: 120,
    overflow: "hidden"
  },
  headerInner: {
    flexDirection: "row",
    alignItems: "center",
    height: 120,
    padding: 16,
    paddingTop: 36
  },
  profilePicWrapper: {
    width: 80,
    height: 80,
    backgroundColor: "#d8d8d8",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  centerText: {
    width: 180,
    flex: 1,
    marginLeft: 15
  },
  rightArrow: {
    alignItems: "center"
  },
  backgroundImg: {
    position: "absolute",
    width: "100%",
    height: "100%"
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.55)",
    position: "absolute",
    width: "100%",
    top: 0,
    bottom: 0
  },
  name: {
    fontSize: 18,
    color: "#ffffff"
  },
  mobile: {
    fontSize: 14,
    color: "#ffffff"
  }
});

export default Header;
