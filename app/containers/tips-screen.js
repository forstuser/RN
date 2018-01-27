import React, { Component } from "react";
import { Platform, StyleSheet, View, FlatList, Alert } from "react-native";
import { API_BASE_URL, getTips } from "../api";
import { Text, Button, ScreenContainer } from "../elements";
import I18n from "../i18n";

const tipsColors = ["#54ddff", "#ff9b9b", "#9baaf9", "#3eefdc", "#dbf62d"];

class TipsScreen extends Component {
  static navigatorStyle = {
    tabBarHidden: true
  };

  constructor(props) {
    super(props);
    this.state = {
      tips: [
        {
          tip: I18n.t("tips_screen_tip_1")
        },
        {
          tip: I18n.t("tips_screen_tip_2")
        },
        {
          tip: I18n.t("tips_screen_tip_3")
        },
        {
          tip: I18n.t("tips_screen_tip_4")
        },
        {
          tip: I18n.t("tips_screen_tip_5")
        },
        {
          tip: I18n.t("tips_screen_tip_6")
        },
        {
          tip: I18n.t("tips_screen_tip_7")
        },
        {
          tip: I18n.t("tips_screen_tip_8")
        },
        {
          tip: I18n.t("tips_screen_tip_9")
        },
        {
          tip: I18n.t("tips_screen_tip_10")
        },
        {
          tip: I18n.t("tips_screen_tip_11")
        },
        {
          tip: I18n.t("tips_screen_tip_12")
        },
        {
          tip: I18n.t("tips_screen_tip_13")
        },
        {
          tip: I18n.t("tips_screen_tip_14")
        },
        {
          tip: I18n.t("tips_screen_tip_15")
        },
        {
          tip: I18n.t("tips_screen_tip_16")
        }
      ]
    };
  }

  async componentDidMount() {
    this.props.navigator.setTitle({
      title: I18n.t("tips_screen_title")
    });
    try {
      const tips = await getTips();
      this.setState({
        tips: res.tips
      });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <ScreenContainer style={styles.centerText}>
        <FlatList
          style={{ padding: 20, flex: 1 }}
          data={this.state.tips}
          keyExtractor={(item, index) => index}
          renderItem={({ item, index }) => (
            <View
              style={{
                backgroundColor:
                  tipsColors[Math.floor(Math.random() * tipsColors.length)],
                borderBottomColor:
                  tipsColors[Math.floor(Math.random() * tipsColors.length)],
                borderBottomWidth: 8,
                opacity: 20,
                marginBottom: 10,
                borderRadius: 4
              }}
            >
              <View style={styles.overlay} />
              <Text style={styles.mainText} weight="Medium">
                {item.tip}
              </Text>

              <View
                style={{
                  marginTop: 35,
                  marginBottom: 20,
                  flex: 1,
                  flexDirection: "row"
                }}
              >
                <Text style={styles.gyan}>BinBill Gyan</Text>
                <Text style={styles.number} weight="Bold">
                  #{index + 1}
                </Text>
              </View>
            </View>
          )}
        />
      </ScreenContainer>
    );
  }
}
const styles = StyleSheet.create({
  centerText: {
    fontSize: 14,
    backgroundColor: "#eff1f6",
    padding: 0,
    height: "100%"
  },
  mainText: {
    fontSize: 20,
    padding: 30,
    letterSpacing: 0.25
  },
  gyan: {
    fontSize: 16,
    color: "#3b3b3b",
    width: 220,
    marginLeft: 20,
    marginTop: 30
  },
  overlay: {
    backgroundColor: "rgba(255,255,255,0.55)",
    position: "absolute",
    width: "100%",
    top: 0,
    bottom: 0
  },
  number: {
    fontSize: 40,
    alignItems: "center",
    color: "rgba(0,0,0,0.1)"
  }
});

export default TipsScreen;
