import React, { Component } from "react";
import {
  View,
  FlatList,
  Alert,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Linking,
  Platform
} from "react-native";
import moment from "moment";
import call from "react-native-phone-call";
import getDirections from "react-native-google-maps-directions";
import { ActionSheetCustom as ActionSheet } from "react-native-actionsheet";

import { API_BASE_URL, getAscSearchResults } from "../../api";
import { ScreenContainer, Text, Button, Image } from "../../elements";
import { colors } from "../../theme";
import { showSnackbar } from "../../utils/snackbar";

import EmptyServicesListPlaceholder from "./empty-services-list-placeholder";

import I18n from "../../i18n";

const directionIcon = require("../../images/ic_directions.png");
const callIcon = require("../../images/ic_call.png");

class AscSearchScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    const { brand, category } = params;
    return {
      title: I18n.t("asc_search_screen_title", {
        brandAndCategory: brand.brandName + " " + category.category_name
      })
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      isFetchingResults: false,
      serviceCenters: [],
      phoneNumbers: []
    };
  }

  componentDidMount() {
    this.fetchResults();
  }

  fetchResults = async () => {
    this.setState({ isFetchingResults: true });
    const brand = this.props.navigation.getParam("brand", {});
    const category = this.props.navigation.getParam("category", {});
    const latitude = this.props.navigation.getParam("latitude", null);
    const longitude = this.props.navigation.getParam("longitude", null);
    try {
      const res = await getAscSearchResults({
        categoryId: category.category_id,
        brandId: brand.id,
        latitude: latitude,
        longitude: longitude
      });
      this.setState({
        serviceCenters: res.serviceCenters,
        isFetchingResults: false
      });
    } catch (e) {
      this.setState({
        serviceCenters: [],
        isFetchingResults: false
      });
      showSnackbar({
        text: e.message
      });
    }
  };

  openMap = address => {
    const data = {
      params: [
        {
          key: "daddr",
          value: address
        }
      ]
    };

    getDirections(data);
  };

  callServiceCenter = serviceCenter => {
    let phoneNumbers = [];
    for (let i = 0; i < serviceCenter.centerDetails.length; i++) {
      if (
        serviceCenter.centerDetails[i].type == 3 &&
        serviceCenter.centerDetails[i].details
      ) {
        console.log(
          "serviceCenter.centerDetails[i].details: ",
          serviceCenter.centerDetails[i].details
        );
        phoneNumbers.push(String(serviceCenter.centerDetails[i].details));
      }
    }
    if (phoneNumbers.length == 0) {
      return showSnackbar({
        text: I18n.t("asc_search_screen_phone_not_available")
      });
    }
    this.setState(
      {
        phoneNumbers
      },
      () => {
        this.phoneOptions.show();
      }
    );
  };

  handlePhonePress = index => {
    if (index < this.state.phoneNumbers.length) {
      call({ number: this.state.phoneNumbers[index] }).catch(e =>
        showSnackbar({
          text: e.message
        })
      );
    }
  };

  render() {
    const { serviceCenters, isFetchingResults } = this.state;
    if (!isFetchingResults && serviceCenters.length == 0) {
      return <EmptyServicesListPlaceholder />;
    } else {
      return (
        <ScreenContainer style={{ padding: 0 }}>
          <FlatList
            style={{ flex: 1, backgroundColor: "#fff", marginBottom: 10 }}
            data={serviceCenters}
            keyExtractor={(item, index) => index}
            onRefresh={this.fetchResults}
            refreshing={isFetchingResults}
            renderItem={({ item }) => (
              <View collapsable={false} style={styles.item}>
                <View collapsable={false} style={styles.imageWrapper}>
                  <Image
                    style={styles.itemImage}
                    source={{ uri: API_BASE_URL + item.cImageURL }}
                    resizeMode="contain"
                  />
                </View>
                <View collapsable={false} style={styles.itemDetails}>
                  <Text weight="Bold" style={styles.itemName}>
                    {item.centerName}
                  </Text>
                  <Text weight="Medium" style={styles.itemDistance}>
                    {item.distance + " " + item.distanceMetrics}
                  </Text>
                  <Text weight="Medium" style={styles.itemAddress}>
                    {item.address}
                  </Text>
                </View>
                <View collapsable={false} style={styles.directionAndCall}>
                  <TouchableOpacity
                    onPress={() => this.openMap(item.centerAddress)}
                    style={styles.directionAndCallItem}
                  >
                    <Text weight="Bold" style={styles.directionAndCallText}>
                      {I18n.t("asc_search_screen_directions")}
                    </Text>
                    <Image
                      style={styles.directionAndCallIcon}
                      source={directionIcon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.callServiceCenter(item)}
                    style={styles.directionAndCallItem}
                  >
                    <Text weight="Bold" style={styles.directionAndCallText}>
                      {I18n.t("asc_search_screen_call")}
                    </Text>
                    <Image
                      style={styles.directionAndCallIcon}
                      source={callIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
          <ActionSheet
            onPress={this.handlePhonePress}
            ref={o => (this.phoneOptions = o)}
            title={
              this.state.phoneNumbers.length > 0
                ? "Select a phone number"
                : "Phone Number Not Available"
            }
            cancelButtonIndex={this.state.phoneNumbers.length}
            options={[...this.state.phoneNumbers, "Cancel"]}
          />
        </ScreenContainer>
      );
    }
  }
}

const styles = StyleSheet.create({
  item: {
    elevation: 2,
    margin: 10,
    marginBottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    backgroundColor: "#fff"
  },

  imageWrapper: {
    width: "100%",
    height: 120,
    padding: 20
  },
  itemImage: {
    width: "100%",
    height: "100%"
  },
  itemDetails: {
    padding: 16
  },
  itemDistance: {
    fontSize: 12
  },
  itemAddress: {
    marginTop: 10,
    color: colors.secondaryText
  },
  directionAndCall: {
    flexDirection: "row"
  },
  directionAndCallItem: {
    height: 40,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#ececec",
    borderWidth: 1
  },
  directionAndCallText: {
    color: colors.pinkishOrange,
    marginRight: 6
  },
  directionAndCallIcon: {
    width: 18,
    height: 18
  }
});

export default AscSearchScreen;
