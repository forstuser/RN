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
import { Text, Button, ScreenContainer } from "../../elements";
import { getProfileDetail, API_BASE_URL } from "../../api";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: null
    };
  }

  async componentDidMount() {
    try {
      const profileDetails = await getProfileDetail();
      this.setState({
        profile: profileDetails
      });
    } catch (e) {
      Alert.alert(e.message);
    }
  }

  onProfileItemPress = () => {
    this.props.navigator.push({
      screen: "ProfileScreen"
    });
  };

  render() {
    const profile = this.state.profile;
    return (
      <TouchableOpacity style={styles.header} onPress={this.onProfileItemPress}>
        {profile && (
          <View>
            <Image
              style={styles.backgroundImg}
              source={{
                uri: API_BASE_URL + profile.userProfile.imageUrl
              }}
            />

            <View style={styles.overlay} />

            <View style={styles.headerInner}>
              <Image
                style={{ width: 80, height: 80, marginRight: 20 }}
                source={require("../../images/dashboard_main.png")}
              />
              <View style={styles.centerText}>
                <Text style={styles.name} weight="Bold">
                  {profile.userProfile.name}
                </Text>
                <Text style={styles.mobile} weight="Medium">
                  {profile.userProfile.mobile_no}
                </Text>
              </View>
              <Image
                style={{ width: 12, height: 12 }}
                source={require("../../images/ic_processing_arrow.png")}
              />
            </View>
          </View>
        )}
      </TouchableOpacity>
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
    padding: 16
  },

  centerText: {
    width: 180,
    flex: 1
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
