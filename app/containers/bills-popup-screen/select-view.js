import React, { Component } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Alert,
  NativeModules,
  Image,
  TouchableWithoutFeedback
} from "react-native";
import GridView from "react-native-super-grid";
import Icon from "react-native-vector-icons/Ionicons";
import RNFetchBlob from "react-native-fetch-blob";
import moment from "moment";
import ScrollableTabView from "react-native-scrollable-tab-view";
import { connect } from "react-redux";

import { Text, Button, ScreenContainer, AsyncImage } from "../../elements";
import { API_BASE_URL } from "../../api";
import { colors } from "../../theme";

const fileIcon = require("../../images/ic_file.png");

import { isImageFileType, getMimeTypeByExtension } from "../../utils";

class SelectView extends Component {
  static navigatorStyle = {
    navBarHidden: true,
    tabBarHidden: true,
    statusBarTextColorScheme: "light"
  };
  constructor(props) {
    super(props);
    this.state = {
      selectedCopies: []
    };
  }

  componentDidMount() {}

  closeThisScreen = () => {
    this.props.navigator.dismissModal();
  };

  toggleCopySelect = copy => {
    let selectedCopies = [...this.state.selectedCopies];
    const idx = selectedCopies.findIndex(
      selectedCopy => selectedCopy.copyId == copy.copyId
    );
    if (idx > -1) {
      selectedCopies.splice(idx, 1);
    } else {
      selectedCopies.push(copy);
    }
    this.setState({
      selectedCopies
    });
  };

  render() {
    const { selectedCopies } = this.state;
    const { copies, passSelectedCopies } = this.props;
    return (
      <View style={styles.container}>
        <GridView
          itemDimension={150}
          items={copies}
          style={styles.grid}
          renderItem={item => {
            const itemIndex = selectedCopies.findIndex(
              selectedCopy => selectedCopy.copyId == item.copyId
            );
            return (
              <TouchableWithoutFeedback
                onPress={() => this.toggleCopySelect(item)}
                style={styles.item}
              >
                <View
                  style={[
                    styles.itemInner,
                    { borderColor: itemIndex > -1 ? colors.mainBlue : "#999" }
                  ]}
                >
                  {isImageFileType(item.file_type || item.fileType) && (
                    <AsyncImage
                      style={styles.itemImage}
                      uri={API_BASE_URL + item.copyUrl}
                    />
                  )}
                  {!isImageFileType(item.file_type || item.fileType) && (
                    <View style={styles.file}>
                      <Image style={styles.fileIcon} source={fileIcon} />
                    </View>
                  )}

                  <View style={styles.checkboxWrapper}>
                    <Icon
                      style={styles.checkbox}
                      name="ios-checkmark-circle"
                      size={30}
                      color={itemIndex > -1 ? colors.mainBlue : "#999"}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            );
          }}
        />
        <Button
          text="Share"
          onPress={() => passSelectedCopies(selectedCopies)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  grid: { marginBottom: 10 },
  item: {
    height: 130
  },
  itemInner: {
    borderWidth: 2,
    width: "100%",
    height: 130
  },
  itemImage: {
    width: "100%",
    height: "100%"
  },
  file: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  fileIcon: {
    width: 80,
    height: 80
  },
  fileName: {
    color: "#fff"
  },
  checkboxWrapper: {
    position: "absolute",
    top: 5,
    right: 7
  },
  checkbox: {
    backgroundColor: "transparent"
  }
});

export default SelectView;
