import React from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { Text, Button } from "../../elements";
import { colors } from "../../theme";

import Modal from "../../components/modal";

export default class MyShoppingList extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "My Shopping List",
      headerRight: (
        <TouchableOpacity
          onPress={navigation.state.params.onSharePress}
          style={{ marginRight: 10 }}
        >
          <Icon name="md-share" size={25} color={colors.mainBlue} />
        </TouchableOpacity>
      )
    };
  };

  state = {
    isShareModalVisible: false,
    wishList: []
  };

  componentDidMount() {
    this.props.navigation.setParams({ onSharePress: this.onSharePress });

    const wishList = this.props.navigation.getParam("wishList", []);
    this.setState({ wishList });
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
  };

  render() {
    const { navigation } = this.props;

    const { isShareModalVisible, wishList } = this.state;

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
              {`You do not have a Shopping List.\n GO back and start adding items to create your Shopping List.`}
            </Text>
            <Button
              onPress={() => navigation.goBack()}
              style={{ width: 250 }}
              text="Go Back"
              color="secondary"
            />
          </View>
        ) : (
          <FlatList
            contentContainerStyle={{
              borderBottomWidth: 1,
              borderBottomColor: "#eee"
            }}
            data={wishList}
            ItemSeparatorComponent={() => (
              <View style={{ height: 1, backgroundColor: "#eee" }} />
            )}
            keyExtractor={item => item.title}
            renderItem={({ item, index }) => (
              <View
                style={{
                  flexDirection: "row",
                  padding: 10,
                  height: 60
                }}
              >
                <View style={{ marginRight: 5 }}>
                  <TouchableOpacity
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 8,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: colors.success
                    }}
                  >
                    <Icon name="md-checkmark" size={12} color="#fff" />
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1, paddingTop: 2 }}>
                  <Text weight="Medium" style={{ fontSize: 10 }}>
                    {item.title}
                  </Text>
                  <Text
                    weight="Medium"
                    style={{
                      fontSize: 10,
                      color: colors.mainBlue,
                      marginTop: 9
                    }}
                  >
                    You get back Rs. 20
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.changeIndexQuantity(index, item.quantity - 1);
                      }}
                      style={styles.signContainer}
                    >
                      <Text style={{ marginTop: -4 }}>-</Text>
                    </TouchableOpacity>
                    <Text style={{ width: 30, textAlign: "center" }}>
                      {item.quantity}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        this.changeIndexQuantity(index, item.quantity + 1);
                      }}
                      style={styles.signContainer}
                    >
                      <Text style={{ marginTop: -4 }}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      this.changeIndexQuantity(index, 0);
                    }}
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 5
                    }}
                  >
                    <Icon name="ios-trash-outline" size={25} color="#999999" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
                <TouchableOpacity style={styles.chatOption}>
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
  signContainer: {
    borderColor: colors.pinkishOrange,
    borderWidth: 1,
    width: 15,
    height: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  },
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
