import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import TabsHeader from "./tabs-header";
import TabsView from "./tabs-view";

class CollipsibleHeaderWithTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabIndex: 0,
      headerHeight: 368,
      collapsedHeaderHeight: 50,
      scroll: new Animated.Value(0)
    };
  }

  onTabChange = index => {
    this.setState({ activeTabIndex: index });
  };

  render() {
    const {
      style = {},
      headerView,
      tabsHeaderProps,
      tabsViewProps
    } = this.props;

    const {
      activeTabIndex,
      headerHeight,
      collapsedHeaderHeight,
      scroll
    } = this.state;

    const scrollableHeight = headerHeight - collapsedHeaderHeight;

    const translateY = scroll.interpolate({
      inputRange: [0, scrollableHeight],
      outputRange: [0, -scrollableHeight],
      extrapolate: "clamp"
    });

    const paddingTop = scroll.interpolate({
      inputRange: [0, scrollableHeight],
      outputRange: [scrollableHeight, 0],
      extrapolate: "clamp"
    });

    return (
      <View style={[styles.container, style]}>
        <TabsView
          onTabScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scroll } } }],
            { useNativeDriver: true }
          )}
          tabScrollPosition={scroll}
          tabContentContainerStyle={{ paddingTop: headerHeight }}
          activeTabIndex={activeTabIndex}
          onTabChange={this.onTabChange}
          {...tabsViewProps}
        />
        <Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
          <View style={{ flex: 1 }}>{headerView}</View>
          <View
            style={{
              height: 50
            }}
          >
            <TabsHeader
              activeTabIndex={activeTabIndex}
              onTabChange={this.onTabChange}
              {...tabsHeaderProps}
            />
          </View>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 368,
    backgroundColor: "#fff"
  }
});

export default CollipsibleHeaderWithTabs;
export { TabsHeader, TabsView };
