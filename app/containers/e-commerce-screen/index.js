import React, { Component } from "react";
import {
  StyleSheet, View
} from "react-native";
import Amazon from "./amazon";
import Flipkart from "./flipkart";
import { Text, Button, Image } from "../../elements";
import Modal from "react-native-modal";
import { colors } from "../../theme";
import KeyValueItem from "../../components/key-value-item";
import { API_BASE_URL, createTransaction } from "../../api";
class EcommerceScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderId: null,
      item: null,
      isModalVisible: false,
      scrapObjectArray: []
    }
  }
  componentDidMount() {
    console.log("item with get Params", this.props.navigation.getParam("item"))
    this.setState({
      item: this.props.navigation.getParam("item")
    })
  }

  getAmazonOrderDetails = (data) => {
    console.log("amazon", data);
    this.setState({
      scrapObjectArray: data,
      isModalVisible: true
    })
  }
  getFlipkartOrderDetails = (data) => {
    console.log(data);
    const item = this.state.item;
    this.setState({
      scrapObjectArray: data,
      isModalVisible: true
    })
  }

  transaction = async (transaction_id, price, quantity, online_seller_id, product_id, accessory_product_id, payment_mode, details_url) => {
    try {
      await createTransaction({
        transaction_id,
        price,
        quantity,
        online_seller_id,
        // delivery_address,
        // delivery_date,
        product_id,
        accessory_product_id,
        payment_mode,
        details_url
      });
    } catch (e) {
      showSnackbar({
        text: e.message
      });
    }
  };

  exploreMoreDetails = () => {
    this.props.navigation.goBack();
  };
  showModal = () => {
    this.setState({ isModalVisible: true });
  };
  hideModal = () => {
    this.setState({ isModalVisible: false });
  };
  render() {
    const { isModalVisible, scrapObjectArray } = this.state;
    const item = this.props.navigation.getParam("item", null);
    return (<View style={{ flex: 1 }}>
      {item.seller == 'amazonIn' ?
        <Amazon item={item} successOrder={this.getAmazonOrderDetails} />
        :
        <Flipkart item={item} successOrder={this.getFlipkartOrderDetails} />
      }
      <Modal
        style={{ margin: 0 }}
        isVisible={isModalVisible}
        useNativeDriver={true}
        onBackButtonPress={this.hideModal}
        onBackdropPress={this.hideModal}
      >
        <View style={{ backgroundColor: '#fff', padding: 20 }}>
          <Text style={{ color: colors.tomato, fontWeight: 'bold', fontSize: 18 }} >Order Successful!</Text>
          <View style={styles.imageContainer}>
            <Image
              style={{ width: 50, height: 50, marginRight: 20 }}
              source={{ uri: item.image }}
              resizeMode='contain'
            />
            <Text numberOfLines={2} style={{ flex: 1, fontWeight: 'bold' }}>{item.name}</Text>
          </View>
          <View style={{ marginTop: 10 }}>
            {scrapObjectArray.map((item) => {
              return (<KeyValueItem
                keyText={item.key}
                valueText={item.value}
              />)
            })}
          </View>
          <Button
            onPress={this.exploreMoreDetails}
            text={"Explore More Details"}
            color="secondary"
            borderRadius={30}
            style={styles.exploreButton}
          />
        </View>
      </Modal>
    </View>)
  }
}

const styles = StyleSheet.create({
  imageContainer: {
    flexDirection: 'row',
    marginTop: 25
  },
  exploreButton: {
    width: "100%"
  },
});

export default EcommerceScreen;
