import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  FlatList,
  Alert,
  TouchableOpacity,
  Image
} from "react-native";
import I18n from "../../i18n";
import { API_BASE_URL } from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";
import Analytics from "../../analytics";
import { SCREENS } from "../../constants";
import { colors, defaultStyles } from "../../theme";
import AddNewBtn from "../../components/add-new-btn";
import CloathesImageUploader from "../../components/easy-life-items/cloathes-image-uploader";
const whatToWear = require("../../images/whatToWear.png");

class WhatToListScreen extends Component {
  static navigatorStyle = {
    tabBarHidden: true
  };
  componentDidMount() {
    this.props.navigator.setTitle({
      title: "What To Wear Today"
    });
  }
  showCloathesImageUploader = () => {
    this.cloathesImageUploader.showActionSheet();
  };

  render() {
    return (
      <ScreenContainer>
        <View style={styles.container}>
          <Image style={styles.whatToWearImage} source={whatToWear} />
          <Text weight="Medium" style={styles.whatToWearText}>
            Select Cloathes that you like
          </Text>
        </View>
        <AddNewBtn
          text={"Add New Cloathing Item"}
          onPress={this.showCloathesImageUploader}
        />
        <CloathesImageUploader
          ref={ref => (this.cloathesImageUploader = ref)}
          navigator={navigator}
        />
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  whatToWearImage: {
    height: 70,
    width: 70,
    alignItems: "center",
    alignSelf: "center"
  },
  whatToWearText: {
    fontSize: 14,
    color: "#9b9b9b"
  }
});

export default WhatToListScreen;
