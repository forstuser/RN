import React from "react";
import { View, TouchableOpacity, FlatList } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";

import { getMySellers } from "../../api";
import { Text, Button } from "../../elements";
import { defaultStyles, colors } from "../../theme";
import { SCREENS } from "../../constants";

export default class SelectSellerScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { onSkipPress } = navigation.state.params;
    return {
      title: "Select Sellers",
      headerRight: (
        <TouchableOpacity
          style={{ paddingHorizontal: 10 }}
          onPress={onSkipPress}
        >
          <Text style={{ color: colors.pinkishOrange }}>SKIP</Text>
        </TouchableOpacity>
      )
    };
  };

  state = {
    sellers: [],
    isLoading: false,
    error: null,
    selectedSeller: null,
    isHomeDeliveryModalVisible: false
  };

  componentDidMount() {
    this.props.navigation.setParams({ onSkipPress: this.proceedToNextStep });
    this.getMySellers();
  }

  getMySellers = async () => {
    this.setState({ isLoading: true });
    try {
      const res = await getMySellers();
      this.setState({ sellers: res.result });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  selectSeller = seller => {
    this.setState({ selectedSeller: seller });
  };

  showHomeDeliveryModalVisible = () => {
    this.setState({ isHomeDeliveryModalVisible: true });
  };

  hideHomeDeliveryModalVisible = () => {
    this.setState({ isHomeDeliveryModalVisible: false });
  };

  proceedToNextStep = (isHomeDelivered = false) => {
    this.setState(() => ({ isHomeDeliveryModalVisible: false }));
    const { navigation } = this.props;
    const product = navigation.getParam("product", null);
    const cashbackJob = navigation.getParam("cashbackJob", null);
    const copies = navigation.getParam("copies", []);
    const purchaseDate = navigation.getParam("purchaseDate", null);
    const amount = navigation.getParam("amount", null);
    const isDigitallyVerified = navigation.getParam(
      "isDigitallyVerified",
      false
    );
    const selectedItems = navigation.getParam("selectedItems", []);
    const { selectedSeller } = this.state;

    this.props.navigation.push(SCREENS.CLAIM_CASHBACK_FINAL_SCREEN, {
      product,
      cashbackJob,
      copies,
      purchaseDate,
      amount,
      isDigitallyVerified,
      isHomeDelivered,
      selectedItems,
      selectedSeller
    });
  };

  render() {
    const {
      sellers,
      isLoading,
      error,
      selectedSeller,
      isHomeDeliveryModalVisible
    } = this.state;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff"
        }}
      >
        <FlatList
          data={sellers}
          refreshing={isLoading}
          onRefresh={this.getMySellers}
          ListEmptyComponent={() => (
            <View
              style={{
                maxWidth: 300,
                alignSelf: "center",
                alignItems: "center",
                marginTop: 35
              }}
            >
              <Text style={{ textAlign: "center" }}>
                You have not added any Sellers. Please add your Seller in My
                Seller section to avail additional Seller benefits in future.
              </Text>
              <Button
                onPress={this.proceedToNextStep}
                text="Next"
                color="secondary"
                style={{ height: 40, width: 140, marginTop: 30 }}
              />
            </View>
          )}
          renderItem={({ item }) => {
            const isSelected =
              selectedSeller && selectedSeller.id == item.id ? true : false;

            return (
              <TouchableOpacity
                onPress={() => this.selectSeller(item)}
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
                <View
                  style={{
                    borderColor: "#efefef",
                    borderWidth: 1,
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 10
                  }}
                >
                  <Icon
                    name="md-checkmark"
                    size={35}
                    color={isSelected ? colors.success : "#efefef"}
                  />
                </View>
                <Text weight="Bold">{item.name}</Text>
              </TouchableOpacity>
            );
          }}
        />
        <Button
          onPress={this.showHomeDeliveryModalVisible}
          text="Send for Seller Approval & Proceed"
          color="secondary"
          borderRadius={0}
        />
        <Modal
          isVisible={isHomeDeliveryModalVisible}
          useNativeDriver={true}
          onBackButtonPress={this.hideHomeDeliveryModalVisible}
          onBackdropPress={this.hideHomeDeliveryModalVisible}
        >
          <View
            style={{
              backgroundColor: "#fff",
              width: 280,
              height: 150,
              alignSelf: "center",
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text weight="Medium" style={{ fontSize: 15, marginBottom: 20 }}>
              Did you avail Home Delivery?
            </Text>
            <View
              style={{
                width: "100%",
                maxWidth: 220,
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <Button
                text="No"
                style={{ width: 100, height: 40 }}
                textStyle={{ fontSize: 12 }}
                color="secondary"
                type="outline"
                onPress={() => this.proceedToNextStep(false)}
              />
              <Button
                text="Yes"
                style={{ width: 100, height: 40 }}
                color="secondary"
                textStyle={{ fontSize: 12 }}
                onPress={() => this.proceedToNextStep(true)}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
