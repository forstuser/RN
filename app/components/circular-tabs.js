import React from "react";
import {
  Animated,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView
} from "react-native";

import { Text, Image } from "../elements";
import { colors } from "../theme";

import curve from "../images/tab_curve.png";

const TAB_WIDTH = 120;

export default class CircularTabs extends React.Component {
  state = {
    activeTabIndex: 0,
    curvePosition: new Animated.Value(0)
  };

  goToTab = index => {
    this.setState({ activeTabIndex: index });
    Animated.timing(this.state.curvePosition, {
      toValue: index,
      duration: 200,
      useNativeDriver: true
    }).start();
  };

  render() {
    const { tabs } = this.props;
    const { activeTabIndex } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.tabsContainer}>
          <View style={styles.tabsColorStrip} />

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Animated.Image
              resizeMode="stretch"
              source={curve}
              style={{
                position: "absolute",
                width: TAB_WIDTH,
                height: 35,
                top: 32,
                left: 0,
                transform: [
                  {
                    translateX: this.state.curvePosition.interpolate({
                      inputRange: [0, 4],
                      outputRange: [0, 4 * TAB_WIDTH]
                    })
                  }
                ]
              }}
            />
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={tab.text}
                style={styles.tab}
                onPress={() => this.goToTab(index)}
              >
                <Text
                  weight={activeTabIndex == index ? "Bold" : "Regular"}
                  style={styles.tabTitle}
                  numberOfLines={2}
                >
                  {tab.title}
                </Text>
                <View style={styles.tabImageContainer}>
                  <Image
                    resizeMode="contain"
                    style={styles.tabImage}
                    source={tab.imageSource}
                    tintColor={
                      activeTabIndex == index ? colors.mainBlue : undefined
                    }
                  />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={styles.tabContent}>{tabs[activeTabIndex].content}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabsContainer: {
    height: 92
  },
  tabsColorStrip: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 67,
    backgroundColor: colors.mainBlue
  },
  tab: {
    width: TAB_WIDTH,
    alignItems: "center",
    justifyContent: "center"
  },
  tabTitle: {
    fontSize: 11,
    color: "#fff",
    marginTop: 8,
    textAlign: "center",
    height: 30
  },
  tabImageContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#EDEDED",
    borderColor: "#fff",
    borderWidth: 2,
    padding: 5,
    elevation: 2
  },
  tabImage: {
    width: "100%",
    height: "100%"
  },
  tabContent: {
    flex: 1
  }
});
