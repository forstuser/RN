import React, { Component } from "react";
import {
  View,
  FlatList,
  Alert,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import moment from "moment";
import { API_BASE_URL, getMailboxData, updateMailboxRead } from "../../api";
import LoadingOverlay from "../../components/loading-overlay";
import { ScreenContainer, Text, Button, Image } from "../../elements";
import { colors } from "../../theme";
import { openBillsPopUp } from "../../navigation";
import I18n from "../../i18n";
import { showSnackbar } from "../../utils/snackbar";
import Analytics from "../../analytics";
import { MAIN_CATEGORY_IDS, SCREENS } from "../../constants";

import EmptyMailboxPlaceholder from "./empty-mailbox-placeholder";

import filterIcon from "../../images/ic_filter_none_black.png";

class MailBox extends Component {
  static navigationOptions = {
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
    this.props.navigation.setTitle({
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

      await updateMailboxRead(res.notifications.map(notif => notif.id));
    } catch (e) {
      showSnackbar({
        text: e.message
      });
    }
  };

  onItemPress = item => {
    if (item.productType == 1 || (item.productType == 3 && item.productId)) {
      this.props.navigation.navigate(SCREENS.PRODUCT_DETAILS_SCREEN, {
        productId: item.productId
      });
    } else {
      openBillsPopUp({
        id: item.productName,
        date: item.purchaseDate,
        copies: item.copies
      });
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
      <View>
        <TouchableOpacity onPress={this.onItemPress} style={styles.item}>
          <View collapsable={false} style={styles.imageAndDetails}>
            <View collapsable={false} style={styles.imageWrapper}>
              {!item.copies || item.copies.length == 0 ? (
                <Image
                  style={styles.image}
                  fileStyle={{ width: 50, height: 50 }}
                  fileType="pdf"
                />
              ) : (
                <Image
                  style={styles.image}
                  fileStyle={{ width: 50, height: 50 }}
                  fileType={item.copies[0].file_type || item.copies[0].fileType}
                  source={{ uri: API_BASE_URL + item.copies[0].copyUrl }}
                />
              )}
            </View>
            <View collapsable={false} style={styles.titleAndDetails}>
              <Text weight="Medium" style={{ color: titleColor }}>
                {item.title}
              </Text>
              <View collapsable={false} style={styles.dateAndCounts}>
                <Text style={styles.date}>
                  {moment(date).format("DD MMM, YYYY")}
                </Text>
                <View collapsable={false} style={styles.count}>
                  <Image style={styles.countIcon} source={filterIcon} />
                  <Text weight="Medium" style={styles.countText}>
                    {item.copies ? item.copies.length : 0}
                  </Text>
                </View>
              </View>
              {amount ? (
                <Text weight="Medium">{amount}</Text>
              ) : (
                <View collapsable={false} />
              )}
            </View>
          </View>
          <Text weight="Medium" style={styles.desc}>
            {item.description}
          </Text>
        </TouchableOpacity>
      </View>
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
            keyExtractor={(item, index) => String(item.id)}
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
