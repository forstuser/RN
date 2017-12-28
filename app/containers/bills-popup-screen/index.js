import React, { Component } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Alert,
  NativeModules,
  TouchableOpacity
} from "react-native";

import RNFetchBlob from "react-native-fetch-blob";
import moment from "moment";
import ScrollableTabView from "react-native-scrollable-tab-view";
import { connect } from "react-redux";

import Icon from "react-native-vector-icons/Ionicons";

import { Text, Button, ScreenContainer, AsyncImage } from "../../elements";
import { API_BASE_URL } from "../../api";
import { colors } from "../../theme";
import BillCopyItem from "./bill-copy-item";
import SelectView from "./select-view";
import LoadingOverlay from "../../components/loading-overlay";

class BillsPopUpScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true,
    tabBarHidden: true,
    statusBarTextColorScheme: "light"
  };
  constructor(props) {
    super(props);
    this.state = {
      isSelectViewVisible: false,
      isDownloadingFiles: false
    };
  }
  componentDidMount() {}

  openShare = () => {
    // send http request in a new thread (using native code)
    RNFetchBlob.config({
      fileCache: true,
      appendExt: this.props.copies[0].file_type
    })
      .fetch("GET", API_BASE_URL + this.props.copies[0].copyUrl, {
        Authorization: this.props.authToken
      })
      .then(res => {
        // the temp file path
        console.log("The file saved to ", res.path());
        NativeModules.RNMultipleFilesShare.shareFiles(["file://" + res.path()]);
      })
      .catch((errorMessage, statusCode) => {
        // error handling
      });
  };

  shareCopies = selectedCopies => {
    if (selectedCopies.length == 0) {
      return Alert.alert("Select some files to share!");
    }

    this.setState({
      isDownloadingFiles: true
    });
    Promise.all(
      selectedCopies.map(selectedCopy => {
        return RNFetchBlob.config({
          fileCache: true,
          appendExt: selectedCopy.file_type
        })
          .fetch("GET", API_BASE_URL + selectedCopy.copyUrl, {
            Authorization: this.props.authToken
          })
          .then(res => {
            console.log("The file saved to ", res.path());
            return "file://" + res.path();
          });
      })
    )
      .then(files => {
        this.setState({
          isDownloadingFiles: false
        });
        console.log("files: ", files);
        NativeModules.RNMultipleFilesShare.shareFiles(files);
      })
      .catch(e => {
        this.setState({
          isDownloadingFiles: false
        });
        Alert.alert("Some error occurred!");
      });
  };

  onShareBtnClick = () => {
    if (this.props.copies.length == 1) {
      this.shareCopies([this.props.copies[0]]);
    } else {
      this.setState({
        isSelectViewVisible: true
      });
    }
  };

  closeThisScreen = () => {
    this.props.navigator.dismissModal();
  };

  render() {
    const { isSelectViewVisible, isDownloadingFiles } = this.state;
    const { date, id, copies, type = "Product" } = this.props;
    return (
      <ScreenContainer style={styles.container}>
        <View style={styles.header}>
          <View style={styles.dateAndId}>
            <Text onPress={this.openShare} weight="Medium" style={styles.date}>
              {moment(date).format("DD MMM, YYYY")}
            </Text>
            <Text style={styles.id}>{!isNaN(id) && "ID: " + id}</Text>
            <View style={styles.type}>
              <Text style={styles.typeText}>{type}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={this.closeThisScreen}
            weight="Bold"
            style={styles.crossIcon}
          >
            <Icon name="ios-close" size={50} color="#fff" />
          </TouchableOpacity>
        </View>
        {(!copies || copies.length == 0) && (
          <View style={styles.noCopiesMsgWrapper}>
            <Text weight="Bold" style={styles.noCopiesMsg}>
              Data not avialable
            </Text>
          </View>
        )}
        {!isSelectViewVisible &&
          copies &&
          copies.length > 0 && (
            <ScrollableTabView
              tabBarUnderlineStyle={{
                backgroundColor: colors.mainBlue,
                height: 1,
                marginBottom: -1
              }}
              tabBarPosition="bottom"
              renderTabBar={null}
            >
              {copies.map((copy, index) => (
                <BillCopyItem
                  key={copy.copyId}
                  billId={id}
                  copy={copy}
                  index={index}
                  total={copies.length}
                  onShareBtnClick={this.onShareBtnClick}
                  authToken={this.props.authToken}
                />
              ))}
            </ScrollableTabView>
          )}

        {copies &&
          isSelectViewVisible && (
            <SelectView copies={copies} passSelectedCopies={this.shareCopies} />
          )}
        <LoadingOverlay
          visible={isDownloadingFiles}
          text="Downloading.. please wait..."
        />
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: { backgroundColor: "rgba(0,0,0,1)" },
  header: {
    flexDirection: "row",
    marginBottom: 20
  },
  dateAndId: {
    flex: 1
  },
  date: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 5
  },
  id: {
    color: "#fff"
  },
  type: {
    backgroundColor: colors.mainBlue,
    alignSelf: "flex-start",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 2,
    marginTop: 5
  },
  typeText: {
    color: "#fff",
    fontSize: 12
  },
  noCopiesMsgWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

const mapStateToProps = state => {
  return {
    authToken: state.loggedInUser.authToken
  };
};

export default connect(mapStateToProps)(BillsPopUpScreen);
