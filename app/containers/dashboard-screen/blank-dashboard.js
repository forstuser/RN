import React from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import LinearGradient from "react-native-linear-gradient";

import Tour from "../../components/app-tour";

import { Text, Button } from "../../elements";
import I18n from "../../i18n";
import { colors } from "../../theme";

import { actions as uiActions } from "../../modules/ui";

const uploadFabIcon = require("../../images/ic_upload_fab.png");

const slideImages = [
  require("../../images/blank-dashboard/slide_1.png"),
  require("../../images/blank-dashboard/slide_2.png"),
  require("../../images/blank-dashboard/slide_3.png"),
  require("../../images/blank-dashboard/slide_4.png"),
  require("../../images/blank-dashboard/slide_5.png"),
  require("../../images/blank-dashboard/slide_6.png")
];
const bottomImage = require("../../images/blank-dashboard/bottom-image.png");

const Slide = ({ image }) => {
  return (
    <View style={styles.slide}>
      <Image source={image} style={styles.slideImage} resizeMode="contain" />
    </View>
  );
};
class BlankDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollPosition: 0,
      sliderIndex: 0
    };
  }

  componentDidMount() {
    if (!this.props.hasBlankDashboardTourShown) {
      setTimeout(() => this.blankDashboardTour.startTour(), 1000);
      this.props.setUiHasBlankDashboardTourShown(true);
    }

    this.autoSlider = setInterval(this.autoSlide, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.autoSlider);
  }

  autoSlide = () => {
    const screenWidth = Dimensions.get("window").width;
    let scrollPosition = this.state.scrollPosition;
    let maxScrollPosition = screenWidth * (slideImages.length - 1);
    if (scrollPosition >= maxScrollPosition) {
      return this.slider.scrollTo({
        x: 0,
        y: 0,
        animated: true
      });
    }
    if (scrollPosition == 0 || scrollPosition % screenWidth == 0) {
      const newScrollPosition = scrollPosition + screenWidth;
      this.slider.scrollTo({
        x: newScrollPosition,
        y: 0,
        animated: true
      });
    }
  };

  onSlidesScroll = event => {
    const x = event.nativeEvent.contentOffset.x;
    this.setState(() => ({
      scrollPosition: x
    }));
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <LinearGradient
            start={{ x: 0.0, y: 0.8 }}
            end={{ x: 0.0, y: 1 }}
            colors={["#20083b", "#401988"]}
            style={styles.gradientBackground}
          >
            <View style={styles.contentWrapper}>
              <View style={styles.content}>
                <View style={styles.texts}>
                  <Text weight="Bold" style={styles.oneStopFor}>
                    One Stop For
                  </Text>
                </View>
                <ScrollView
                  ref={ref => (this.slider = ref)}
                  style={styles.slider}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  pagingEnabled={true}
                  onScroll={this.onSlidesScroll}
                >
                  {slideImages.map((image, index) => <Slide image={image} />)}
                </ScrollView>
                <View style={styles.imageWrapper}>
                  <Image
                    style={styles.image}
                    source={bottomImage}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
        <View style={styles.welcome}>
          <Text weight="Bold" style={styles.welcomeTitle}>
            Welcome to BinBill
          </Text>
          <Text style={styles.welcomeDesc}>
            Start building your eHome by converting ordinary bills into smart
            bills. Live worry free!
          </Text>
          <TouchableOpacity
            ref={ref => (this.fabRef = ref)}
            style={styles.fab}
            onPress={this.props.onUploadButtonClick}
          >
            <Image style={styles.uploadFabIcon} source={uploadFabIcon} />
          </TouchableOpacity>
        </View>
        <Tour
          ref={ref => (this.blankDashboardTour = ref)}
          enabled={true}
          steps={[{ ref: this.fabRef, text: I18n.t("app_tour_tips_1") }]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  },
  wrapper: {
    position: "absolute",
    width: 1500,
    height: 1500,
    bottom: 150,
    borderRadius: 1500,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    backgroundColor: "#fff"
  },
  gradientBackground: {
    position: "absolute",
    width: 1500,
    height: 1500,
    borderRadius: 1500,
    overflow: "hidden"
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  content: {
    height: Dimensions.get("window").height - 230,
    width: Dimensions.get("window").width,
    justifyContent: "space-between"
  },
  texts: {},
  oneStopFor: {
    fontSize: 12,
    textAlign: "center",
    color: "#fff",
    paddingHorizontal: 20,
    paddingBottom: 10
  },
  slider: {
    flex: 1
  },
  slide: {
    width: Dimensions.get("window").width,
    height: "100%"
  },
  slideImage: {
    width: "100%",
    height: "100%"
  },
  imageWrapper: {
    height: 120,
    alignSelf: "center",
    width: "98%",
    maxWidth: 270
  },
  image: {
    position: "absolute",
    width: "100%",
    height: "100%",
    bottom: -20
  },
  welcome: {
    position: "absolute",
    bottom: 0,
    height: 150,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  welcomeTitle: {
    color: colors.mainBlue,
    textAlign: "center",
    fontSize: 20
  },
  welcomeDesc: {
    color: colors.secondaryText,
    textAlign: "center",
    fontSize: 18,
    marginTop: 5
  },
  fab: {
    position: "absolute",
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    zIndex: 2,
    backgroundColor: colors.tomato,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1
  },
  uploadFabIcon: {
    width: 30,
    height: 30
  }
});

const mapStateToProps = state => {
  return {
    hasBlankDashboardTourShown: state.ui.hasBlankDashboardTourShown
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUiHasBlankDashboardTourShown: newValue => {
      dispatch(uiActions.setUiHasBlankDashboardTourShown(newValue));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BlankDashboard);
