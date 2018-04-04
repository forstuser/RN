import React, { Component } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Alert,
  NativeModules,
  TouchableOpacity,
  Platform
} from "react-native";

import RNFetchBlob from "react-native-fetch-blob";
import moment from "moment";
import ScrollableTabView from "react-native-scrollable-tab-view";
import { connect } from "react-redux";
import I18n from "../../i18n";
import { showSnackbar } from "../snackbar";

import Icon from "react-native-vector-icons/Ionicons";

import { Text, Button, ScreenContainer, AsyncImage } from "../../elements";
import { API_BASE_URL, deleteBill } from "../../api";
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
      copies: [],
      isSelectViewVisible: false,
      isDownloadingFiles: false
    };
  }
  componentDidMount() {
    this.setState({
      copies: this.props.copies
    });
  }

  shareCopies = selectedCopies => {
    if (selectedCopies.length == 0) {
      return showSnackbar({
        text: "Select some files to share!"
      })
    }


    this.setState({
      isDownloadingFiles: true
    });
    Promise.all(
      selectedCopies.map((selectedCopy, index) => {
        return RNFetchBlob.config({
          ...Platform.select({
            ios: {
              fileCache: true,
              appendExt: selectedCopy.file_type
            },
            android: {
              path: RNFetchBlob.fs.dirs.DCIMDir + `/${selectedCopy.copyName}`
            }
          })
        })
          .fetch("GET", API_BASE_URL + selectedCopy.copyUrl, {
            Authorization: this.props.authToken
          })
          .then(res => {
            console.log("The file saved to ", res.path());
            return res.path();
          });
      })
    )
      .then(files => {
        this.setState({
          isDownloadingFiles: false
        });
        NativeModules.RNMultipleFilesShare.shareFiles(files);
      })
      .catch(e => {
        this.setState({
          isDownloadingFiles: false
        });
        showSnackbar({
          text: "Some error occurred!"
        })
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

  onItemCopyDelete = async (itemIndex, copyIndex) => {
    let items = [...this.state.pendingDocs];
    let item = { ...items[itemIndex] };
    let copies = [...item.copies];

    try {
      await deleteBill(item.docId, copies[copyIndex].copyId);
      copies.splice(copyIndex, 1);
      item.copies = copies;

      if (copies.length == 0) {
        //if all copies are deleted, remove the item
        items.splice(itemIndex, 1);
        this.props.navigator.dismissAllModals();
      } else {
        items[itemIndex] = item;
      }

      this.setState({
        pendingDocs: items
      });
    } catch (e) {
      showSnackbar({
        text: e.message
      })
    }
  };

  deleteCopy = async index => {
    let copies = [...this.state.copies];
    try {
      await deleteBill(this.props.id, copies[index].copyId);
      copies.splice(index, 1);

      this.props.onCopyDelete(index);

      this.setState({
        copies
      });
    } catch (e) {
      showSnackbar({
        text: e.message
      })
    }
  };

  render() {
    const { isSelectViewVisible, isDownloadingFiles, copies } = this.state;
    const { date, id, type = null, onCopyDelete } = this.props;
    return (
      <ScreenContainer style={styles.container}>
        <View style={styles.header}>
          <View style={styles.dateAndId}>
            {date && (
              <Text weight="Medium" style={styles.date}>
                {moment(date).isValid() && moment(date).format("DD MMM, YYYY")}
              </Text>
            )}
            <Text style={styles.id}>{!isNaN(id) && "ID: " + id}</Text>
            {type && (
              <View style={styles.type}>
                <Text style={styles.typeText}>{type}</Text>
              </View>
            )}
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
            <Text weight="Bold" style={styles.noCopiesMsg} />
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
                  onDeleteBtnClick={
                    onCopyDelete ? () => this.deleteCopy(index) : undefined
                  }
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
