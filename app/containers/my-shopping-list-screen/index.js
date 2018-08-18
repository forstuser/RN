import React from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  NativeModules
} from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import Share from "react-native-share";

import { getMySellers } from "../../api";

import { Text, Button } from "../../elements";
import { colors, defaultStyles } from "../../theme";

import Modal from "../../components/modal";
import LoadingOverlay from "../../components/loading-overlay";
import QuantityPlusMinus from "../../components/quantity-plus-minus";

import SelectedItemsList from "./selected-items-list";
import { showSnackbar } from "../../utils/snackbar";

class MyShoppingList extends React.Component {
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
    wishList: [],
    isLoadingMySellers: false,
    isMySellersModalVisible: false,
    sellers: []
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

  getMySellers = async () => {
    this.setState({
      isLoadingMySellers: true,
      isShareModalVisible: false,
      isMySellersModalVisible: true
    });
    try {
      const res = await getMySellers();
      this.setState({ sellers: res.result });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoadingMySellers: false });
    }
  };

  startChatWithSeller = seller => {
    this.setState({ isMySellersModalVisible: false });

    const { user } = this.props;
    var alUser = {
      userId: String(user.id),
      password: String(user.id),
      displayName: String(user.name),
      email: "",
      authenticationTypeId: 1,
      applicationId: "binbill40002f8f92e5e65dbc8dadc", //replace "applozic-sample-app" with Application Key from Applozic Dashboard
      deviceApnsType: 0 //Set 0 for Development and 1 for Distribution (Release)
    };

    console.log("alUser: ", alUser);

    var ApplozicChat = NativeModules.ApplozicChat;
    console.log("ApplozicChat: ", ApplozicChat);
    ApplozicChat.login(alUser, (error, response) => {
      if (error) {
        showSnackbar({ text: "Some error occurred!" });
        //authentication failed callback
        console.log("error: ", error);
      } else {
        //authentication success callback
        console.log("response:", response);
        ApplozicChat.openChatWithUser("seller_" + seller.id);
      }
    });
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

    const {
      isShareModalVisible,
      wishList,
      isLoadingMySellers,
      sellers,
      isMySellersModalVisible
    } = this.state;

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
                <TouchableOpacity
                  onPress={this.getMySellers}
                  style={styles.chatOption}
                >
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

        <Modal
          isVisible={isMySellersModalVisible}
          title="Select Seller"
          onClosePress={() => this.setState({ isMySellersModalVisible: false })}
          style={{
            height: 300,
            backgroundColor: "#fff"
          }}
        >
          <View>
            <FlatList
              data={sellers}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    onPress={() => this.startChatWithSeller(item)}
                    style={{
                      height: 90,
                      ...defaultStyles.card,
                      margin: 10,
                      borderRadius: 10,
                      padding: 15,
                      flexDirection: "row",
                      alignItems: "center"
                    }}
                  >
                    <Text weight="Bold">{item.name}</Text>
                  </TouchableOpacity>
                );
              }}
            />
            <LoadingOverlay visible={isLoadingMySellers} />
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

const mapStateToProps = state => {
  return {
    user: state.loggedInUser
  };
};

export default connect(mapStateToProps)(MyShoppingList);
