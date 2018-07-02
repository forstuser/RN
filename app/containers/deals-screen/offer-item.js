import React from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Clipboard,
  Linking,
  Platform
} from "react-native";
import Modal from "react-native-modal";
import moment from "moment";
import Snackbar from "react-native-snackbar";
import { Text, Image } from "../../elements";
import { defaultStyles, colors } from "../../theme";
import OfferDetailedItem from "./offer-detailed-item";

export default class OfferItem extends React.Component {
  state = {
    isModalVisible: false
  };

  showModal = () => {
    this.setState({ isModalVisible: true });
  };
  hideModal = () => {
    this.setState({ isModalVisible: false });
  };

  onPromocodePress = () => {
    const { item } = this.props;
    if (item.promo_code) {
      Clipboard.setString(item.promo_code);
      Snackbar.show({
        title: "Promo code copied!!",
        duration: Snackbar.LENGTH_SHORT
      });
    } else {
      Linking.openURL(item.promo_link);
    }
  };
  render() {
    const { item, categoryImageUrl } = this.props;
    const { isModalVisible } = this.state;

    return (
      <TouchableOpacity
        onPress={this.showModal}
        style={{
          height: 200,
          width: 150,
          margin: 5,
          borderRadius: 5,
          marginRight: 10,
          padding: 10,
          justifyContent: "center",
          alignItems: "center",
          ...defaultStyles.card
        }}
      >
        <Image
          source={{ uri: item.logo || categoryImageUrl }}
          style={{ width: 80, height: 65 }}
          resizeMode="contain"
        />
        <Text
          weight="Medium"
          style={{
            textAlign: "center",
            fontSize: 11,
            color: "#616161",
            marginTop: 15
          }}
          numberOfLines={2}
        >
          {item.title}
        </Text>

        <View
          style={{
            flexDirection: "row",
            marginVertical: 5,
            alignItems: "center"
          }}
        >
          <Text
            weight="Medium"
            style={{ fontSize: 11, color: "#b6b6b6", marginLeft: 2 }}
          >
            {"Valid Upto " + moment(item.date_end).format("MMM DD")}
          </Text>
        </View>

        <TouchableOpacity
          onPress={this.onPromocodePress}
          style={{
            borderColor: colors.mainBlue,
            borderWidth: 1,
            height: 28,
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 12,
            minWidth: 100,
            marginTop: 10
          }}
        >
          {/* <Image
            source={{ uri: item.logo }}
            style={{ width: 20, height: 20, margin: 5 }}
            resizeMode="contain"
          /> */}
          <View
            style={{
              flex: 1,
              // borderLeftWidth: 1,
              borderColor: colors.mainBlue,
              height: "100%",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text
              weight="Bold"
              numberOfLines={1}
              style={{
                fontSize: 12,
                color: colors.mainBlue,
                ...Platform.select({ android: { marginTop: -2 } })
              }}
            >
              {item.promo_code || "Buy Now"}
            </Text>
          </View>
        </TouchableOpacity>
        <Modal
          style={{ margin: 0 }}
          isVisible={isModalVisible}
          useNativeDriver={true}
          onBackButtonPress={this.hideModal}
          onBackdropPress={this.hideModal}
        >
          <OfferDetailedItem item={item} />
        </Modal>
      </TouchableOpacity>
    );
  }
}
