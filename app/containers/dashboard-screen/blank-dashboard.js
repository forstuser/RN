import React from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  WebView
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
const bottomImage = require("../../images/blank-dashboard/bottom-image.png");

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
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <LinearGradient
            start={{ x: 0.0, y: 0.8 }}
            end={{ x: 0.0, y: 1 }}
            colors={["#01c8ff", "#0ae2f1"]}
            style={styles.gradientBackground}
          >
            <View style={styles.contentWrapper}>
              <View style={styles.content}>
                <View style={styles.texts}>
                  <Text weight="Bold" style={styles.topText}>
                    BinBill - your eHome
                  </Text>
                </View>
                <View
                  style={[
                    styles.webViewContainer,
                    {
                      height:
                        (Dimensions.get("window").width - 16) * (9.2 / 16) + 80
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
                    style={[
                      styles.webView,
                      {
                        width: Dimensions.get("window").width - 16,
                        height:
                          (Dimensions.get("window").width - 16) * (9.2 / 16)
                      }
                    ]}
                  >
                    <WebView
                      ref={ref => {
                        this.videoPlayer = ref;
                      }}
                      javaScriptEnabled={true}
                      domStorageEnabled={true}
                      source={{
                        html:
                          '<html><meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" /><iframe src="https://www.youtube.com/embed/U_Y6tu_jmt0?modestbranding=1&playsinline=1&showinfo=0&rel=0" frameborder="0" style="overflow:hidden;overflow-x:hidden;overflow-y:hidden;height:100%;width:100%;position:absolute;top:0px;left:0px;right:0px;bottom:0px" height="100%" width="100%"></iframe></html>'
                      }}
                      onShouldStartLoadWithRequest={
                        this.onShouldStartLoadWithRequest
                      } //for iOS
                      onNavigationStateChange={
                        this.onShouldStartLoadWithRequest
                      } //for Android
                    />
                  </View>
                </View>
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
            Start adding your Products, Bills, Expenses and Documents
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
  wrapper: {
    position: "absolute",
    width: 1500,
    height: 1500,
    bottom: gradientBottomMargin,
    borderRadius: 1500,
    elevation: 2,
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
    height: windowHeight - gradientBottomMargin - 75,
    width: Dimensions.get("window").width,
    justifyContent: "space-between"
  },
  texts: {
    flex: 1,
    justifyContent: "flex-end"
  },
  topText: {
    fontSize: 18,
    textAlign: "center",
    color: "#fff",
    paddingHorizontal: 20,
    paddingBottom: 10
  },
  webViewContainer: {
    width: "100%",
    marginTop: -30,
    marginBottom: -40
  },
  cornerImage: {
    position: "absolute",
    width: 100,
    height: 100
  },
  cornerImageTopRight: {
    top: 0,
    right: -5
  },
  cornerImageBottomLeft: {
    bottom: 0,
    left: 0
  },
  webView: {
    marginVertical: 40,
    alignSelf: "center",
    borderColor: "#fff",
    borderWidth: 5,
    borderRadius: 3
  },
  imageWrapper: {
    minHeight: 100,
    maxHeight: 120,
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
    height: gradientBottomMargin,
    width: "100%",
    alignItems: "center",
    padding: 20
  },
  welcomeTitle: {
    marginTop: 10,
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
