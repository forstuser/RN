import React, { Component } from "react";
import { Platform, StyleSheet, View, FlatList, Alert } from "react-native";
import { API_BASE_URL, getTips } from "../api";
import { Text, Button, ScreenContainer } from "../elements";
import I18n from "../i18n";

import LoadingOverlay from "../components/loading-overlay";
import ErrorOverlay from "../components/error-overlay";

const tipsColors = ["#54ddff", "#ff9b9b", "#9baaf9", "#3eefdc", "#dbf62d"];

class TipsScreen extends Component {
  static navigatorStyle = {
    tabBarHidden: true
  };

  constructor(props) {
    super(props);
    this.state = {
      tips: [],
      isLoading: true,
      error: null
    };
  }

  async componentDidMount() {
    this.props.navigator.setTitle({
      title: I18n.t("tips_screen_title")
    });
    this.getTips();
  }

  getTips = async () => {
    this.setState({ isLoading: true, error: null });
    try {
      const res = await getTips();
      this.setState({
        tips: res.tips
      });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    if (this.state.error) {
      return (
        <ErrorOverlay error={this.state.error} onRetryPress={this.getFaqs} />
      );
    }
    return (
      <ScreenContainer style={styles.centerText}>
        <FlatList
          style={{ padding: 20, flex: 1 }}
          data={this.state.tips}
          keyExtractor={(item, index) => index}
          renderItem={({ item, index }) => (
            <View collapsable={false} 
              style={{
                backgroundColor: tipsColors[index % 4],
                marginBottom: 10,
                borderRadius: 4
              }}
            >
              <View collapsable={false}  style={styles.overlay} />
              <Text style={styles.mainText} weight="Medium">
                {item.tip}
              </Text>

              <View collapsable={false} 
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
        <LoadingOverlay visible={this.state.isLoading} />
      </ScreenContainer>
    );
  }
}
const styles = StyleSheet.create({
  centerText: {
    // fontSize: 14,
    backgroundColor: "#eff1f6",
    padding: 0,
    height: "100%"
  },
  mainText: {
    fontSize: 20,
    padding: 30,
    paddingBottom: 50,
    letterSpacing: 0.25
  },
  overlay: {
    backgroundColor: "rgba(255,255,255,0.55)",
    position: "absolute",
    width: "100%",
    top: 0,
    bottom: 10
  },
  gyan: {
    fontSize: 16,
    color: "#3b3b3b",
    position: "absolute",
    bottom: 15,
    left: 30
  },
  number: {
    fontSize: 40,
    alignItems: "center",
    color: "rgba(0,0,0,0.1)",
    position: "absolute",
    bottom: 0,
    right: 30
  }
});

export default TipsScreen;
