import React from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  WebView,
  Platform
} from "react-native";
import { connect } from "react-redux";
import LinearGradient from "react-native-linear-gradient";

import Tour from "../../components/app-tour";

import { Text, Button } from "../../elements";
import I18n from "../../i18n";
import { colors } from "../../theme";

import { actions as uiActions } from "../../modules/ui";

const uploadFabIcon = require("../../images/ic_upload_fabs.png");

const cornerImageTopRight = require("../../images/blank-dashboard/corner-image_top_right.png");
const cornerImageBottomLeft = require("../../images/blank-dashboard/corner-image_bottom-left.png");
const image = require("../../images/blank-dashboard/image.png");

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
  }

  onShouldStartLoadWithRequest = navigator => {
    if (navigator.url.indexOf("embed") !== -1) {
      return true;
    } else {
      this.videoPlayer.stopLoading(); //Some reference to your WebView to make it stop loading that URL
      return false;
    }
  };

  render() {
    return (
      <View collapsable={false} style={styles.container}>
        <LinearGradient
          start={{ x: 0.0, y: 0.8 }}
          end={{ x: 0.0, y: 1 }}
          colors={["#01c8ff", "#0ae2f1"]}
          style={styles.gradientBackground}
        >
          <View
            collapsable={false}
            style={[
              styles.webViewContainer,
              {
                height: (Dimensions.get("window").width - 16) * (9.2 / 16) + 80
              }
            ]}
          >
            <Image
              style={[styles.cornerImage, styles.cornerImageTopRight]}
              source={cornerImageTopRight}
              resizeMode="contain"
            />
            <Image
              style={[styles.cornerImage, styles.cornerImageBottomLeft]}
              source={cornerImageBottomLeft}
              resizeMode="contain"
            />
            <View
              collapsable={false}
              style={[
                styles.webView,
                {
                  width: Dimensions.get("window").width - 16,
                  height: (Dimensions.get("window").width - 16) * (9.2 / 16)
                }
              ]}
            >
              <WebView
                ref={ref => {
                  this.videoPlayer = ref;
                }}
                scalesPageToFit={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                source={{
                  uri:
                    "https://www.youtube.com/embed/fexOvhPe5EM&t?modestbranding=1&playsinline=1&showinfo=0&rel=0"
                }}
                onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest} //for iOS
                onNavigationStateChange={this.onShouldStartLoadWithRequest} //for Android
              />
            </View>
          </View>
          <View collapsable={false} style={styles.welcome}>
            <Image style={styles.image} source={image} resizeMode="contain" />
            <Text weight="Bold" style={styles.welcomeTitle}>
              {I18n.t("blank_dashboard_headline")}
            </Text>
            <Text style={styles.welcomeDesc}>
              {I18n.t("blank_dashboard_text")}
            </Text>
          </View>
        </LinearGradient>
        <TouchableOpacity
          ref={ref => (this.fabRef = ref)}
          style={styles.fab}
          onPress={this.props.onUploadButtonClick}
        >
          <Image style={styles.uploadFabIcon} source={uploadFabIcon} />
        </TouchableOpacity>
        <View collapsable={false} style={styles.dummiesForTooltips}>
          <View collapsable={false} style={styles.dummyForTooltip} />
          <View
            collapsable={false}
            ref={ref => (this.ehomeTabItemRef = ref)}
            style={styles.dummyForTooltip}
          />
          <View
            collapsable={false}
            ref={ref => (this.attendanceTabItemRef = ref)}
            style={styles.dummyForTooltip}
          />
          <View
            collapsable={false}
            ref={ref => (this.doYouKnowTabItemRef = ref)}
            style={styles.dummyForTooltip}
          />
          <View collapsable={false} style={styles.dummyForTooltip} />
        </View>
        <Tour
          ref={ref => (this.blankDashboardTour = ref)}
          enabled={true}
          steps={[
            { ref: this.fabRef, text: I18n.t("plus_btn_tip") },
            { ref: this.ehomeTabItemRef, text: I18n.t("ehome_tip") },
            { ref: this.attendanceTabItemRef, text: I18n.t("attendance_tip") },
            { ref: this.doYouKnowTabItemRef, text: I18n.t("do_you_know_tip") }
          ]}
        />
      </View>
    );
  }
}

const windowHeight = Dimensions.get("window").height;
const gradientBottomMargin = windowHeight / 3.2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  },
  gradientBackground: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between"
  },
  webViewContainer: {
    width: "100%",
    maxHeight: "40%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10
  },
  cornerImage: {
    position: "absolute",
    width: 100,
    height: 100
  },
  cornerImageTopRight: {
    top: 0,
    right: -15
  },
  cornerImageBottomLeft: {
    bottom: -20,
    left: 0
  },
  webView: {
    alignSelf: "center",
    borderColor: "#fff",
    borderWidth: 5,
    borderRadius: 3
  },
  welcome: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "60%",
    padding: 20
  },
  image: {
    position: "absolute",
    width: "100%",
    height: "100%"
  },
  welcomeTitle: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18
  },
  welcomeDesc: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    marginTop: 5,
    maxWidth: 200
  },
  fab: {
    position: "absolute",
    bottom: 12,
    right: 10,
    width: 56,
    height: 56,
    zIndex: 2,
    backgroundColor: colors.tomato,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1
  },
  uploadFabIcon: {
    width: 30,
    height: 30
  },
  dummiesForTooltips: {
    position: "absolute",
    width: "100%",
    bottom: -68,
    height: 68,
    flexDirection: "row",
    backgroundColor: "transparent"
  },
  dummyForTooltip: {
    flex: 1,
    height: "100%",
    opacity: 1
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
