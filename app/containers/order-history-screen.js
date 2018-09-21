import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  FlatList,
  Alert,
  TouchableOpacity
} from "react-native";
import moment from "moment";
import { API_BASE_URL, fetchOrderHistory } from "../api";
import { Text, Button, ScreenContainer, Image } from "../elements";
import LoadingOverlay from "../components/loading-overlay";
import ErrorOverlay from "../components/error-overlay";
import Collapsible from "./../components/collapsible";
import I18n from "../i18n";
import { defaultStyles, colors } from "../theme";
import { SCREENS } from "../constants";

const NEW_LINE_REGEX = /(?:\r\n|\r|\n)/g;

const DetailItem = ({
  style = {},
  dotColor = colors.success,
  textColor = colors.mainText,
  text,
  subText = ""
}) => (
  <View style={[{ flexDirection: "row", marginBottom: 10 }, style]}>
    <View
      style={{
        width: 7,
        height: 7,
        backgroundColor: dotColor,
        borderRadius: 4,
        marginTop: 7,
        marginRight: 8
      }}
    />
    <View
      style={{
        flex: 1
      }}
    >
      <Text
        style={{
          fontSize: 12,
          color: textColor
        }}
        weight="Medium"
      >
        {text}
      </Text>
      <Text
        style={{
          fontSize: 10,
          color: "#606060"
        }}
      >
        {subText}
      </Text>
    </View>
  </View>
);

class OrderHistoryScreen extends Component {
  static navigationOptions = {
    title: "Accessories Ordered"
  };

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      isLoading: true,
      error: null
    };
  }

  componentDidMount() {
    this.fetchOrderHistory();
  }

  fetchOrderHistory = async () => {
    this.setState({ isLoading: true, error: null });
    try {
      const res = await fetchOrderHistory();
      this.setState({
        orders: res.result
      });
    } catch (error) {
      console.log(error);
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { orders, isLoading, error } = this.state;
    if (error) {
      return (
        <ErrorOverlay error={error} onRetryPress={this.fetchOrderHistory} />
      );
    }
    return (
      <ScreenContainer style={styles.contain}>
        {!isLoading && orders.length == 0 ? (
          <View
            style={{
              marginTop: 40,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text weight="Bold" style={{ color: colors.lighterText }}>
              You have not ordered any Accessory as yet

            </Text>
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item, index) => index}
            ref={ref => (this.faqList = ref)}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <View style={styles.itemBody}>
                  <View style={styles.itemImageAndName}>
                    <Text style={styles.itemTitle} weight="Bold">
                      Order Successful
                    </Text>
                    <Image
                      source={{ uri: item.accessory_product.details.image }}
                      style={styles.image}
                      resizeMode="contain"
                    />
                    <Text
                      style={styles.itemName}
                      numberOfLines={2}
                      weight="Medium"
                    >
                      {item.accessory_product.title}
                    </Text>
                  </View>
                  <View style={styles.itemDetails}>
                    <DetailItem
                      text={`Ordered on ${moment(item.created_at).format(
                        "ddd, MMM Do, YY"
                      )}`}
                    />
                    <DetailItem
                      text={
                        item.online_seller_id == 1 ? "Amazon.in" : "Flipkart"
                      }
                    />
                    <DetailItem
                      text={`Rs. ${item.amount_paid}`}
                      subText={item.payment_mode ? item.payment_mode.title : ""}
                    />
                    {item.delivery_address ? (
                      <DetailItem
                        style={{ marginBottom: 0 }}
                        text={`To be delivered at ${item.delivery_address.replace(
                          NEW_LINE_REGEX,
                          ", "
                        )}`}
                        dotColor={colors.pinkishOrange}
                        textColor={colors.pinkishOrange}
                      />
                    ) : (
                      <View />
                    )}
                  </View>
                </View>
                <View style={styles.itemFooter}>
                  <TouchableOpacity
                    style={{ padding: 5 }}
                    onPress={() =>
                      this.props.navigation.navigate(SCREENS.WEBVIEW_SCREEN, {
                        uri: item.details_url,
                        title: "Order Details"
                      })
                    }
                  >
                    <Text style={styles.footerText} weight="Bold">
                      View Details
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ padding: 5 }}
                    onPress={() =>
                      this.props.navigation.navigate(SCREENS.WEBVIEW_SCREEN, {
                        uri:
                          item.online_seller_id == 1
                            ? "https://www.amazon.in/gp/help/customer/display.html"
                            : "https://www.flipkart.com/helpcentre",
                        title: "Contact Seller"
                      })
                    }
                  >
                    <Text style={styles.footerText} weight="Bold">
                      Contact Seller
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
        <LoadingOverlay visible={isLoading} />
      </ScreenContainer>
    );
  }
}
const styles = StyleSheet.create({
  contain: {
    padding: 0
  },
  text: {
    padding: 12,
    fontSize: 14,
    color: "#3b3b3b"
  },
  item: {
    margin: 10,
    borderRadius: 5,
    ...defaultStyles.card
  },
  itemBody: {
    flexDirection: "row"
  },
  itemImageAndName: {
    width: 135,
    height: "100%",
    padding: 10,
    alignItems: "center",
    borderRightColor: "#efefef",
    borderRightWidth: 1
  },
  itemTitle: {
    color: colors.pinkishOrange
  },
  image: {
    width: 72,
    height: 72,
    marginTop: 15
  },
  itemName: {
    marginTop: 15,
    fontSize: 11,
    textAlign: "center"
  },
  itemDetails: {
    flex: 1,
    marginLeft: -4,
    paddingVertical: 10
  },
  itemFooter: {
    borderTopColor: "#efefef",
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 38,
    paddingHorizontal: 20
  },
  footerText: {
    fontSize: 12,
    color: colors.mainBlue
  }
});

export default OrderHistoryScreen;
