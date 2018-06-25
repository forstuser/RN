import React from "react";
import { View, TouchableWithoutFeedback, Image } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Text } from "../elements";
import { colors } from "../theme";

import curve from "../images/tab_curve.png";

export default class CustomTabBar extends React.Component {
  // We will use this function in array's map
  renderTabBarButton = (route, idx) => {
    const {
      activeTintColor,
      inactiveTintColor,
      navigation,
      getLabelText,
      renderIcon
    } = this.props;

    const label = getLabelText({ route });

    const focused = navigation.state.index == idx;
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          if (!focused) {
            navigation.navigate(route.routeName);
          }
        }}
        key={route.routeName}
      >
        <View
          style={{
            height: "100%",
            alignItems: "center",
            flex: 1,
            overflow: "hidden"
          }}
        >
          {focused ? (
            <Image
              resizeMode="stretch"
              source={curve}
              style={{
                position: "absolute",
                width: "100%",
                height: 35,
                top: 0,
                left: 0,
                transform: [{ rotate: "180deg" }]
              }}
            />
          ) : (
            <View />
          )}
          <LinearGradient
            start={{ x: 0.0, y: 0 }}
            end={{ x: 0.0, y: 1 }}
            colors={
              focused
                ? [colors.aquaBlue, colors.mainBlue]
                : ["transparent", "transparent"]
            }
            style={{
              width: focused ? 24 : 28,
              height: focused ? 24 : 28,
              padding: focused ? 3 : 0,
              marginBottom: focused ? 12 : 0,
              marginTop: focused ? 0 : 8,
              borderRadius: 2
            }}
          >
            {renderIcon({
              route,
              tintColor: focused ? colors.mainBlue : null,
              isFocused: true
            })}
          </LinearGradient>
          <Text
            weight={focused ? "Bold" : "Regular"}
            style={{ fontSize: 11, color: "#fff", marginTop: 2 }}
          >
            {label}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };
  render() {
    console.log("tabbar props: ", this.props);
    const { navigation } = this.props;
    const tabBarButtons = navigation.state.routes.map(this.renderTabBarButton);
    return (
      <LinearGradient
        start={{ x: 0.0, y: 0 }}
        end={{ x: 0.0, y: 1 }}
        colors={[colors.aquaBlue, colors.mainBlue]}
        style={{
          height: 60,
          flexDirection: "row"
        }}
      >
        {tabBarButtons}
      </LinearGradient>
    );
  }
}
