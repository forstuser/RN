import React, { Component } from "react";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  Platform,
  Animated
} from "react-native";
import AppLink from "react-native-app-link";
import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";
import { ScreenContainer, Text, Button } from "../../elements";
import I18n from "../../i18n";
import { colors, defaultStyles } from "../../theme";
import { actions as uiActions } from "../../modules/ui";

const image = require("../../images/like.png");

class RateUsScreen extends Component {
  state = {
    isModalVisible: false
  };

  constructor() {
    super();
    // this.springValue = new Animated.Value(0.3);
  }

  // componentDidMount() {
  //   this.springValue.setValue(0.3);
  //   Animated.spring(this.springValue, {
  //     toValue: 1,
  //     friction: 5,
  //     useNativeDriver: true
  //   }).start();
  // }

  show = () => {
    this.setState({
      isModalVisible: true
    });
  };

  openAppStore = async () => {
    setTimeout(async () => {
      try {
        await AppLink.openInStore("id1328873045", "com.bin.binbillcustomer");
        this.props.setRateUsDialogTimestamp(new Date(2100, 0).toISOString());
      } catch (e) {
        console.log(e);
      }
    }, 400);

    this.setState({
      isModalVisible: false
    });
  };

  hide = () => {
    this.props.setRateUsDialogTimestamp(new Date().toISOString());
    this.setState({
      isModalVisible: false
    });
  };

  render() {
    return (
      <View collapsable={false} >
        {this.state.isModalVisible && (
          <View collapsable={false} >
            <Modal
              isVisible={true}
              useNativeDriver={true}
              animationIn="bounceIn"
            >
              <Animated.View style={[styles.popup]}>
                <View style={styles.container}>
                  <View style={styles.topContainer}>
                  </View>
                  <View style={styles.bottomContainer}>
                    <Text weight="Bold" style={styles.title}>
                      {"Loved Your Home Manager?"}
                    </Text>
                    <Text weight="Bold" style={styles.desc}>
                      Rate us at {
                        Platform.OS == "ios" ? "App" : "Play"
                      } Store and help us spread the good work!
                    </Text>
                    <View style={{
                      flex: 1,
                      marginHorizontal: 50,
                      flexDirection: 'row',
                      justifyContent: 'space-between'
                    }}>
                      <Button
                        borderRadius={2}
                        onPress={this.hide}
                        style={styles.btn}
                        color="grey"
                        textStyle={{ fontSize: 12 }}
                        text="MAYBE LATER"
                      />
                      <Button
                        borderRadius={2}
                        onPress={this.openAppStore}
                        style={styles.btn}
                        text="RATE NOW"
                        color="secondary"
                        textStyle={{ fontSize: 12 }}
                      />
                    </View>
                  </View>
                  <View style={styles.buttonContainer}>
                    <Image source={image} style={styles.image} />
                  </View>
                </View>
              </Animated.View>
            </Modal>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  topContainer: {
    flex: 1,
    width: 310,
    // height: 380,
    backgroundColor: colors.pinkishOrange,
  },
  bottomContainer: {
    flex: 3,
    backgroundColor: 'white'

  },
  buttonContainer: {
    position: 'absolute',
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 180,
    left: 110,
    borderRadius: 45,
    ...defaultStyles.card
  },
  popup: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    width: 280,
    height: 300,
    backgroundColor: "#fff",
  },
  closeIcon: {
    position: "absolute",
    right: 10,
    top: 5
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain'
  },
  title: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 50,
    color: colors.mainBlue
  },
  desc: {
    textAlign: "center",
    alignSelf: 'center',
    width: 220,
    fontSize: 14,
    marginTop: 10,
    color: colors.secondaryText
  },
  btn: {
    width: 100,
    height: 40,
    borderRadius: 10,
    marginTop: 20,
  }
});

export default RateUsScreen;
