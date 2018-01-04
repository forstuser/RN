import React, { Component } from "react";
import {
  View,
  FlatList,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Image
} from "react-native";
import moment from "moment";
import { API_BASE_URL, getMailboxData } from "../../api";
import LoadingOverlay from "../../components/loading-overlay";
import { ScreenContainer, Text, Button, AsyncImage } from "../../elements";
import { colors } from "../../theme";
import { openBillsPopUp } from "../../navigation";
import I18n from "../../i18n";

import { MAIN_CATEGORY_IDS } from "../../constants";

import EmptyMailboxPlaceholder from "./empty-mailbox-placeholder";

class MailBox extends Component {
  static navigatorStyle = {
    tabBarHidden: true
  };
  constructor(props) {
    super(props);
    this.state = {
      pageNo: 1,
      notifications: [],
      isFetchingNotifications: true
    };
  }
  componentDidMount() {
    this.props.navigator.setTitle({
      title: I18n.t("mailbox_screen_title")
    });
    this.fetchNotifications();
  }

  fetchNotificationsFirstPage = () => {
    this.setState(
      {
        pageNo: 1,
        notifications: []
      },
      () => {
        this.fetchNotifications();
      }
    );
  };

  fetchNotifications = async () => {
    const pageNo = this.state.pageNo;
    let newState = { isFetchingNotifications: true };
    if (this.state.pageNo == 1) {
      newState.notifications = [];
    }
    this.setState(newState);
    try {
      const res = await getMailboxData(this.state.pageNo);
      this.setState({
        pageNo: pageNo + 1,
        notifications: [...this.state.notifications, ...res.notifications],
        isFetchingNotifications: false
      });
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  renderNotificationItem = ({ item }) => {
    let date = "";
    let titleColor = colors.mainText;
    let amount = null;

    switch (item.productType) {
      case 1:
        date = item.createdAt;
        titleColor = colors.mainBlue;
        amount = "₹ " + item.totalAmount;
        break;
      case 2:
        date = item.createdAt;
        titleColor = "#f06767";
        amount = null;
        break;
      default:
        date = item.expiryDate;
    }
    return (
      <TouchableOpacity
        onPress={() => {
          switch (item.productType) {
            case 1:
              if (
                item.masterCategoryId == MAIN_CATEGORY_IDS.AUTOMOBILE ||
                item.masterCategoryId == MAIN_CATEGORY_IDS.ELECTRONICS
              ) {
                this.props.navigator.push({
                  screen: "ProductDetailsScreen",
                  passProps: {
                    productId: item.productId
                  }
                });
              } else {
                openBillsPopUp({
                  id: item.productName,
                  date: item.purchaseDate,
                  copies: item.copies
                });
              }
              break;
            case 3:
              this.props.navigator.push({
                screen: "ProductDetailsScreen",
                passProps: {
                  productId: item.productId
                }
              });
              break;
            case 4:
              openBillsPopUp({
                id: item.productName,
                date: item.purchaseDate,
                copies: item.copies
              });
              break;
            default:
              openBillsPopUp({
                id: item.id,
                date: item.createdAt,
                copies: item.copies
              });
          }
        }}
        style={styles.item}
      >
        <View style={styles.imageAndDetails}>
          <View style={styles.imageWrapper}>
            {item.copies.length > 0 && (
              <AsyncImage
                style={styles.image}
                fileStyle={{ width: 50, height: 50 }}
                fileType={item.copies[0].file_type}
                uri={API_BASE_URL + "/" + item.copies[0].copyUrl}
              />
            )}
            {item.copies.length == 0 && (
              <AsyncImage
                style={styles.image}
                fileStyle={{ width: 50, height: 50 }}
                fileType="pdf"
              />
            )}
          </View>
          <View style={styles.titleAndDetails}>
            <Text weight="Medium" style={{ color: titleColor }}>
              {item.title}
            </Text>
            <View style={styles.dateAndCounts}>
              <Text style={styles.date}>
                {moment(date).format("DD MMM, YYYY")}
              </Text>
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
            {amount && <Text weight="Medium">{amount}</Text>}
          </View>
        </View>
        <Text weight="Medium" style={styles.desc}>
          {item.description}
        </Text>
      </TouchableOpacity>
    );
  };

  render() {
    const { notifications, isFetchingNotifications } = this.state;
    if (!isFetchingNotifications && notifications.length == 0) {
      return <EmptyMailboxPlaceholder />;
    } else {
      return (
        <ScreenContainer style={{ padding: 0 }}>
          <FlatList
            style={{ flex: 1, backgroundColor: "#fff" }}
            data={notifications}
            keyExtractor={(item, index) => index}
            renderItem={this.renderNotificationItem}
            onRefresh={this.fetchNotifications}
            refreshing={isFetchingNotifications}
          />
        </ScreenContainer>
      );
    }
  }
}

const styles = StyleSheet.create({
  item: {
    borderColor: "#eee",
    borderBottomWidth: 1,
    padding: 16
  },
  imageAndDetails: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 4
  },
  imageWrapper: {
    backgroundColor: "#ececec",
    width: 80,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14
  },
  image: {
    height: "100%",
    width: "100%"
  },
  titleAndDetails: {
    flex: 1,
    justifyContent: "center"
  },
  dateAndCounts: {
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center"
  },
  date: {},
  count: {
    marginLeft: 8,
    height: 20,
    width: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  countIcon: {
    position: "absolute",
    height: "100%",
    width: "100%"
  },
  countText: {
    fontSize: 11,
    textAlign: "center",
    paddingBottom: 4,
    paddingLeft: 4
  },
  desc: {
    marginTop: 5,
    fontSize: 12,
    color: colors.secondaryText
  }
});

export default MailBox;
