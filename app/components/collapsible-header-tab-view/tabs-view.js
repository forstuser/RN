import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
  Animated
} from "react-native";

class TabsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}
  componentWillReceiveProps(newProps) {
    if (newProps.activeTabIndex != this.props.activeTabIndex) {
      this.disableOnScrollEvent = true;
      this.scrollView.scrollTo({
        x: Dimensions.get("window").width * newProps.activeTabIndex,
        y: 0,
        animated: true
      });
      this.setState({
        disabledSwipe: false
      });
      setTimeout(() => {
        this.disableOnScrollEvent = false;
      }, 500);
    }
  }

  onScroll = event => {
    const scrollX = Math.floor(event.nativeEvent.contentOffset.x);
    const tabWidth = Math.floor(Dimensions.get("window").width);
    const newIndex = Math.floor(scrollX / tabWidth);

    console.log(
      "on scroll -> scrollX: " +
        scrollX +
        "tabWidth: " +
        tabWidth +
        "newIndex: " +
        newIndex
    );
    if (!this.disableOnScrollEvent) {
      this.props.onTabChange(newIndex);
    }
  };

  scrollOtherSlides = () => {
    const { tabs, tabScrollPosition, activeTabIndex } = this.props;

    for (let i = 0; i < tabs.length; i++) {
      if (i != activeTabIndex) {
        this["slide_" + i].getNode().scrollTo({
          x: 0,
          y: tabScrollPosition,
          animated: false
        });
      }
    }
  };

  render() {
    const {
      tabs,
      scrollableTabIndexes = [0],
      style = {},
      tabStyle = {},
      isScrollable = false,
      onTabScroll,
      tabContentContainerStyle,
      activeTabIndex,
      onTabChange
    } = this.props;

    return (
      <ScrollView
        scrollEventThrottle={1}
        ref={ref => (this.scrollView = ref)}
        onScroll={this.onScroll}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        horizontal={true}           showsHorizontalScrollIndicator={false}
        style={[styles.container, style]}
        contentContainerStyle={styles.contentContainer}
      >
        {tabs.map((tab, index) => (
          <Animated.ScrollView
            ref={slide => {
              this["slide_" + index] = slide;
            }}
            scrollEventThrottle={1}
            onScroll={onTabScroll}
            contentContainerStyle={[
              styles.tabContentContainer,
              tabContentContainerStyle
            ]}
            key={index}
            style={styles.tab}
          >
            {tab}
          </Animated.ScrollView>
        ))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  contentContainer: {},
  tab: { width: Dimensions.get("window").width },
  nonScrollableTab: { paddingTop: 100 },
  tabContentContainer: { minHeight: Dimensions.get("window").height }
});

export default TabsView;
