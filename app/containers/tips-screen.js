import React, { Component } from "react";
import { Platform, StyleSheet, View, FlatList, Alert } from "react-native";
import { API_BASE_URL, consumerGetEhome } from "../api";
import { Text, Button, ScreenContainer } from "../elements";
import I18n from "../i18n";

class TipsScreen extends Component {
  static navigatorStyle = {
    tabBarHidden: true
  };

  componentDidMount() {
    this.props.navigator.setTitle({
      title: I18n.t("tips_screen_title")
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      tips: [
        {
          data: I18n.t("tips_screen_tip_1"),
          color: "#2ab9fe",
          border: "#54ddff"
        },
        {
          data: I18n.t("tips_screen_tip_2"),
          color: "#ff6262",
          border: "#ff9b9b"
        },
        {
          data: I18n.t("tips_screen_tip_3"),
          color: "#6271f0",
          border: "#9baaf9"
        },
        {
          data: I18n.t("tips_screen_tip_4"),
          color: "#1ddbb7",
          border: "#3eefdc"
        },
        {
          data: I18n.t("tips_screen_tip_5"),
          color: "#b4e914",
          border: "#dbf62d"
        },
        {
          data: I18n.t("tips_screen_tip_6"),
          color: "#1ddbb7",
          border: "#3eefdc"
        },
        {
          data: I18n.t("tips_screen_tip_7"),
          color: "#1ddbb7",
          border: "#3eefdc"
        },
        {
          data: I18n.t("tips_screen_tip_8"),
          color: "#1ddbb7",
          border: "#3eefdc"
        },
        {
          data: I18n.t("tips_screen_tip_9"),
          color: "#1ddbb7",
          border: "#3eefdc"
        },
        {
          data: I18n.t("tips_screen_tip_10"),
          color: "#1ddbb7",
          border: "#3eefdc"
        },
        {
          data: I18n.t("tips_screen_tip_11"),
          color: "#1ddbb7",
          border: "#3eefdc"
        },
        {
          data: I18n.t("tips_screen_tip_12"),
          color: "#1ddbb7",
          border: "#3eefdc"
        },
        {
          data: I18n.t("tips_screen_tip_13"),
          color: "#1ddbb7",
          border: "#3eefdc"
        },
        {
          data: I18n.t("tips_screen_tip_14"),
          color: "#1ddbb7",
          border: "#3eefdc"
        },
        {
          data: I18n.t("tips_screen_tip_15"),
          color: "#1ddbb7",
          border: "#3eefdc"
        },
        {
          data: I18n.t("tips_screen_tip_16"),
          color: "#1ddbb7",
          border: "#3eefdc"
        }
      ]
    };
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
                backgroundColor: item.border,
                borderBottomColor: item.color,
                borderBottomWidth: 8,
                opacity: 20,
                marginBottom: 10,
                borderRadius: 4
              }}
            >
              <View style={styles.overlay} />
              <Text style={styles.mainText} weight="Medium">
                {item.data}
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
