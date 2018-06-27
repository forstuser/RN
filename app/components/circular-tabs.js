import React from "react";
import {
  Animated,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from "react-native";

import { Text, Image } from "../elements";
import { colors } from "../theme";

import curve from "../images/tab_curve.png";

const TAB_WIDTH = 120;
const CONTENT_WIDTH = Dimensions.get("window").width - 20;

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
                  numberOfLines={1}
                >
                  {tab.title}
                </Text>
                <View style={styles.tabImageContainer}>
                  <Image
                    resizeMode="contain"
                    style={styles.tabImage}
                    source={tab.imageSource}
                    tintColor={
                      activeTabIndex == index
                        ? colors.mainBlue
                        : colors.secondaryText
                    }
                  />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <Animated.View
          style={[
            styles.tabContentContainer,
            { width: tabs.length * CONTENT_WIDTH },
            {
              transform: [
                {
                  translateX: this.state.curvePosition.interpolate({
                    inputRange: [0, 4],
                    outputRange: [0, -4 * CONTENT_WIDTH]
                  })
                }
              ]
            }
          ]}
        >
          {tabs.map((tab, index) => (
            <View key={index} style={styles.tabContent}>
              {tab.content}
            </View>
          ))}
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden"
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
    elevation: 2,
    justifyContent: "center",
    alignItems: "center"
  },
  tabImage: {
    width: 30,
    height: 30
  },
  tabContentContainer: {
    flex: 1,
    flexDirection: "row"
  },
  tabContent: {
    width: CONTENT_WIDTH
  }
});
