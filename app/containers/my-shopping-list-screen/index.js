import React from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Share from "react-native-share";

import { Text, Button } from "../../elements";
import { colors } from "../../theme";

import Modal from "../../components/modal";
import QuantityPlusMinus from "../../components/quantity-plus-minus";

import SelectedItemsList from "./selected-items-list";

export default class MyShoppingList extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const showShareBtn = navigation.getParam("showShareBtn", false);
    return {
      title: "My Shopping List",
      headerRight: showShareBtn ? (
        <TouchableOpacity
          onPress={navigation.state.params.onSharePress}
          style={{ marginRight: 10 }}
        >
          <Icon name="md-share" size={25} color={colors.mainBlue} />
        </TouchableOpacity>
      ) : null
    };
  };

  state = {
    isShareModalVisible: false,
    wishList: []
  };

  componentDidMount() {
    const wishList = this.props.navigation.getParam("wishList", []);
    this.setState({ wishList });

    this.props.navigation.setParams({
      onSharePress: this.onSharePress,
      showShareBtn: wishList.length > 0
    });
  }

  onSharePress = () => {
    this.setState({ isShareModalVisible: true });
  };

  changeIndexQuantity = (index, quantity) => {
    const { navigation } = this.props;
    navigation.state.params.changeIndexQuantity(index, quantity);

    const wishList = [...this.state.wishList];
    if (quantity <= 0) {
      wishList.splice(index, 1);
    } else {
      wishList[index].quantity = quantity;
    }
    this.setState({ wishList });
    this.props.navigation.setParams({
      showShareBtn: wishList.length > 0
    });
  };

  shareWithWhatsapp = () => {
    const shareOptions = {
      title: "Share via\nwhatsapp",
      social: Share.Social.WHATSAPP
    };
    Share.shareSingle(shareOptions);
  };

  render() {
    const { navigation } = this.props;
    const measurementTypes = navigation.getParam("measurementTypes", []);

    const { isShareModalVisible, wishList } = this.state;

    console.log("measurementTypes: ", measurementTypes);

    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {wishList.length == 0 ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              padding: 20
            }}
          >
            <Image
              style={{ width: 150, height: 150 }}
              source={require("../../images/blank_shopping_list.png")}
            />
            <Text
              weight="Medium"
              style={{ textAlign: "center", fontSize: 15, marginVertical: 30 }}
            >
              {`You do not have a Shopping List.\n Start adding items to create your Shopping List.`}
            </Text>
            <Button
              onPress={() => navigation.goBack()}
              style={{ width: 250 }}
              text="Create Shopping List"
              color="secondary"
            />
          </View>
        ) : (
          <SelectedItemsList
            measurementTypes={measurementTypes}
            selectedItems={wishList}
            changeIndexQuantity={this.changeIndexQuantity}
          />
        )}
        <Modal
          isVisible={isShareModalVisible}
          title="Share Via"
          onClosePress={() => this.setState({ isShareModalVisible: false })}
          style={{
            height: 200,
            backgroundColor: "#fff"
          }}
        >
          <View>
            <View
              style={{
                flexDirection: "row",
                padding: 20,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <View style={styles.chatOptionContainer}>
                <TouchableOpacity
                  style={styles.chatOption}
                  onPress={this.shareWithWhatsapp}
                >
                  <Image
                    source={require("../../images/whatsapp.png")}
                    style={styles.chatImage}
                  />
                </TouchableOpacity>
                <Text weight="Medium">WhatsApp</Text>
              </View>

              <View style={styles.chatOptionContainer}>
                <TouchableOpacity style={styles.chatOption}>
                  <Image
                    source={require("../../images/chat.png")}
                    style={styles.chatImage}
                  />
                </TouchableOpacity>
                <Text weight="Medium">Chat</Text>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chatOptionContainer: {
    alignItems: "center"
  },
  chatOption: {
    width: 88,
    height: 88,
    backgroundColor: "#f1f1f1",
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginBottom: 15
  },
  chatImage: {
    width: 55,
    height: 55
  }
});
