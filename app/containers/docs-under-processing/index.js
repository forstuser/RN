import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Alert
} from "react-native";
import moment from "moment";
import { Text, Button, ScreenContainer, AsyncImage } from "../../elements";
import { API_BASE_URL } from "../../api";
import I18n from "../../i18n";
import { colors } from "../../theme";
import { openBillsPopUp } from "../../navigation";
import { isImageFileType } from "../../utils";

import EmptyPendingDocsPlaceholder from "./empty-pending-docs-placeholder";

const fileIcon = require("../../images/ic_file.png");
class DocsUnderProcessingScreen extends Component {
  static navigatorStyle = {
    tabBarHidden: true
  };

  constructor(props) {
    super(props);
    this.state = {
      pendingDocs: []
    };
  }
  async componentDidMount() {
    this.props.navigator.setTitle({
      title: I18n.t("docs_under_processing_screen_title")
    });
    this.setState({
      pendingDocs: this.props.pendingDocs
    });
  }

  onItemCopyDelete = async (itemIndex, copyIndex) => {
    let items = [...this.state.pendingDocs];
    let item = { ...items[itemIndex] };
    let copies = [...item.copies];
    copies.splice(copyIndex, 1);
    item.copies = copies;

    if (copies.length == 0) {
      //if all copies are deleted, remove the item
      items.splice(itemIndex, 1);
      this.props.navigator.dismissModal({
        animationType: "none"
      });
    } else {
      items[itemIndex] = item;
    }

    this.setState({
      pendingDocs: items
    });
  };

  openBillsScreen = (item, itemIndex) => {
    openBillsPopUp({
      date: item.uploadedDate,
      id: item.docId,
      copies: item.copies,
      onCopyDelete: copyIndex => this.onItemCopyDelete(itemIndex, copyIndex)
    });
  };

  renderItem = ({ item, index }) => {
    let ImageItem = null;
    if (isImageFileType(item.copies[0].file_type)) {
      ImageItem = (
        <AsyncImage
          style={styles.image}
          uri={API_BASE_URL + item.copies[0].copyUrl}
        />
      );
    } else {
      ImageItem = <Image style={styles.fileIcon} source={fileIcon} />;
    }
    return (
      <TouchableOpacity
        onPress={() => this.openBillsScreen(item, index)}
        style={styles.item}
      >
        <View style={styles.imageContainer}>{ImageItem}</View>
        <View style={styles.details}>
          <Text weight="Medium" style={styles.uploadTime}>
            Uploaded {moment(item.uploadedDate).fromNow()}
          </Text>
          <Text style={styles.docId}>ID: {item.docId}</Text>
          <View style={styles.count}>
            <Image
              style={styles.countIcon}
              source={require("../../images/ic_filter_none_black.png")}
            />
            <Text weight="Medium" style={styles.countText}>
              {item.copies.length}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    if (this.state.pendingDocs.length == 0) {
      return <EmptyPendingDocsPlaceholder />;
    } else {
      return (
        <ScreenContainer style={{ padding: 0 }}>
          <FlatList
            style={styles.list}
            data={this.state.pendingDocs}
            keyExtractor={(item, index) => item.docId}
            renderItem={this.renderItem}
          />
        </ScreenContainer>
      );
    }
  }
}

const styles = StyleSheet.create({
  list: {
    padding: 8
  },
  item: {
    padding: 16,
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 4,
    elevation: 2,
    margin: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    height: 100,
    alignItems: "center"
  },
  imageContainer: {
    backgroundColor: "#ececec",
    width: 80,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14
  },
  image: {
    height: "100%",
    width: "100%"
  },
  fileIcon: {
    width: 50,
    height: 50
  },
  details: {
    flex: 1
  },
  uploadTime: {},
  docId: {
    fontSize: 12,
    marginVertical: 5
  },
  count: {
    height: 24,
    width: 24,
    alignItems: "center",
    justifyContent: "center"
  },
  countIcon: {
    position: "absolute",
    height: "100%",
    width: "100%"
  },
  countText: {
    fontSize: 12,
    textAlign: "center",
    paddingBottom: 5,
    paddingLeft: 4
  }
});

export default DocsUnderProcessingScreen;
