import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  BackHandler,
  Alert
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";

import moment from "moment";
import _ from "lodash";

import Amazon from "./amazon";
import Flipkart from "./flipkart";
import { Text, Button, Image } from "../../elements";
import HeaderBackBtn from "../../components/header-nav-back-btn";

import Snackbar from "../../utils/snackbar";
import { colors } from "../../theme";
import KeyValueItem from "../../components/key-value-item";
import { API_BASE_URL, createTransaction } from "../../api";
import { SCREENS } from "../../constants";

const NEW_LINE_REGEX = /(?:\r\n|\r|\n)/g;
class EcommerceScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      title: "Start Shopping",
      headerLeft: <HeaderBackBtn onPress={params.onBackPress} />
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      orderId: null,
      item: null,
      productId: null,
      isModalVisible: false,
      scrapObjectArray: []
    };
  }
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    this.props.navigation.setParams({
      onBackPress: this.onBackPress
    });

    console.log(
      'this.props.navigation.getParam("productId", null): ',
      this.props.navigation.getParam("productId", null)
    );
    this.setState({
      item: this.props.navigation.getParam("item", null),
      productId: this.props.navigation.getParam("productId", null)
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  onBackPress = () => {
    Alert.alert("Are you sure?", "Your progress will be gone.", [
      {
        text: "Yes, Go Back",
        onPress: () => this.props.navigation.goBack()
      },
      {
        text: "No, Stay",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      }
    ]);
    return true;
  };

  getAmazonOrderDetails = async data => {
    const { item, productId } = this.state;

    const scrapObjectArray = [
      { key: "Order ID", value: data.orderId.replace(NEW_LINE_REGEX, "") },
      {
        key: "Order Date",
        value: data.orderDate.replace(NEW_LINE_REGEX, "")
      },
      {
        key: "Total Amount",
        value: data.orderTotal.replace(NEW_LINE_REGEX, "")
      },
      {
        key: "Payment Mode",
        value: data.paymentMode.replace(NEW_LINE_REGEX, "")
      },
      {
        key: "Delivery Date",
        value: data.deliveryDate.replace(NEW_LINE_REGEX, "")
      },
      { key: "Delivery Address", value: data.deliveryAddress }
    ];

    console.log("scrapObjectArray: ", scrapObjectArray);
    this.setState({
      scrapObjectArray: scrapObjectArray,
      isModalVisible: true
    });

    const orderId = data.orderId.replace(NEW_LINE_REGEX, "");

    try {
      await createTransaction({
        productId: productId,
        accessoryProductId: item.id,
        transactionId: orderId,
        price: +_.trim(
          data.orderTotal
            .split("(")[0]
            .match(/\d|\./g)
            .join(""),
          "."
        ), //get string before first '(' and get number from it, trim '.' and convert to number
        deliveryDate: moment(data.deliveryDate).format("YYYY-MM-DD"),
        deliveryAddress: data.deliveryAddress,
        detailsUrl: `https://www.amazon.in/gp/your-account/order-details/ref=oh_aui_or_o01_?ie=UTF8&orderID=${orderId}`,
        onlineSellerId: 1
      });
    } catch (e) {
      Snackbar.show({
        title: e.message,
        duration: Snackbar.LENGTH_SHORT
      });
    }
  };

  getFlipkartOrderDetails = async data => {
    console.log("flipkart:", data);
    const { item, productId } = this.state;
    const scrapObjectArray = [{ key: "Order ID", value: data.orderId }];
    this.setState({
      scrapObjectArray: scrapObjectArray,
      isModalVisible: true
    });
    try {
      await createTransaction({
        productId: productId,
        accessoryProductId: item.id,
        transactionId: data.orderId,
        price: +item.price,
        detailsUrl: `https://www.flipkart.com/rv/orderDetails?order_id=${
          data.orderId
        }`,
        onlineSellerId: 2
      });
    } catch (e) {
      Snackbar.show({
        title: e.message,
        duration: Snackbar.LENGTH_SHORT
      });
    }
  };

  exploreMoreDetails = () => {
    this.props.navigation.goBack();
  };

  onModalCrossPress = () => {
    this.props.navigation.navigate(SCREENS.DASHBOARD_SCREEN);
  };

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  render() {
    const { isModalVisible, scrapObjectArray } = this.state;
    const item = this.props.navigation.getParam("item", null);
    return (
      <View style={{ flex: 1 }}>
        {item.seller == "amazonIn" ? (
          <Amazon item={item} successOrder={this.getAmazonOrderDetails} />
        ) : (
          <Flipkart item={item} successOrder={this.getFlipkartOrderDetails} />
        )}
        <Modal
          style={{ margin: 0 }}
          isVisible={isModalVisible}
          useNativeDriver={true}
        >
          <View style={{ backgroundColor: "#fff", padding: 20, margin: 10 }}>
            <Text
              style={{
                color: colors.tomato,
                fontWeight: "bold",
                fontSize: 18
              }}
            >
              Order Successful!
            </Text>

            <View style={styles.imageContainer}>
              <Image
                style={{ width: 50, height: 50, marginRight: 20 }}
                source={{ uri: item.image }}
                resizeMode="contain"
              />
              <Text numberOfLines={2} style={{ flex: 1, fontWeight: "bold" }}>
                {item.name}
              </Text>
            </View>
            <View style={{ marginVertical: 10 }}>
              <FlatList
                data={scrapObjectArray}
                renderItem={({ item }) => (
                  <KeyValueItem keyText={item.key} valueText={item.value} />
                )}
                keyExtractor={item => item.key}
              />
            </View>
            <Button
              onPress={this.exploreMoreDetails}
              text={"Explore More Details"}
              color="secondary"
              borderRadius={30}
              style={styles.exploreButton}
            />
            <TouchableOpacity
              onPress={this.onModalCrossPress}
              style={{
                position: "absolute",
                top: 0,
                right: 5,
                paddingVertical: 5,
                paddingHorizontal: 10
              }}
            >
              <Icon name="ios-close" size={35} color="#000" />
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imageContainer: {
    flexDirection: "row",
    marginTop: 25
  },
  exploreButton: {
    width: "100%"
  }
});

export default EcommerceScreen;
