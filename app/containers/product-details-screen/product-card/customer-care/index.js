import React from "react";
import {
  Image,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import RNGooglePlaces from "react-native-google-places";

import { API_BASE_URL, getAscSearchResults } from "../../../../api";
import { Text } from "../../../../elements";
import I18n from "../../../../i18n";
import LoadingOverlay from "../../../../components/loading-overlay";

import ConnectItem from "./connect-item";
import AscItem from "./asc-item";
import { colors } from "../../../../theme";

const insuranceIcon = require("../../../../images/categories/insurance.png");
const nearbyIcon = require("../../../../images/ic_nearby.png");

class CustomerCare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      place: null,
      ascItems: []
    };
  }

  fetchAscItems = async () => {
    const { place } = this.state;
    const { product, loggedInUser, scrollScreenToBottom } = this.props;
    const { brand } = product;

    setTimeout(() => {
      scrollScreenToBottom();
    }, 200);

    this.setState({ isFetchingAscItems: true });
    try {
      const res = await getAscSearchResults({
        categoryId: product.categoryId,
        brandId: brand.id,
        latitude: place.latitude,
        longitude: place.longitude
      });
      this.setState({
        ascItems: res.serviceCenters,
        isFetchingAscItems: false
      });
    } catch (e) {
      this.setState({
        ascItems: [],
        isFetchingAscItems: false
      });
      Alert.alert(e.message);
    }
  };

  openLocationPicker = async () => {
    try {
      const place = await RNGooglePlaces.openPlacePickerModal();
      console.log("place: ", place);
      this.setState(
        {
          isFetchingAscItems: false,
          place
        },
        () => {
          this.fetchAscItems();
        }
      );
    } catch (e) {
      console.log("e: ", e);
      alert(e.message);
    }
  };

  renderAscItem = ({ item }) => {
    return <AscItem product={this.props.product} item={item} />;
  };

  render() {
    const { place, ascItems, isFetchingAscItems } = this.state;
    const { product, loggedInUser } = this.props;
    const { brand, insuranceDetails, warrantyDetails } = product;

    let brandData = {
      urls: [],
      emails: [],
      phoneNumbers: []
    };

    if (brand) {
      brand.details.forEach(item => {
        switch (item.typeId) {
          case 1:
            brandData.urls.push(item.details);
            break;
          case 2:
            brandData.emails.push(item.details);
            break;
          case 3:
            brandData.phoneNumbers.push(item.details);
            break;
        }
      });
    }

    let insuranceData = {
      providerName: "",
      urls: [],
      emails: [],
      phoneNumbers: []
    };

    if (insuranceDetails.length > 0) {
      const provider = insuranceDetails[0].provider;

      if (provider) {
        insuranceData.providerName = provider.name;
      }

      if (provider && provider.contact) {
        insuranceData.phoneNumbers = provider.contact
          .split(/\\/)
          .filter(number => number.length > 0);
      }

      if (provider && provider.email) {
        insuranceData.emails = provider.email
          .split(/\\/)
          .filter(email => email.length > 0);
      }

      if (provider && provider.url) {
        insuranceData.urls = provider.url
          .split(/\\/)
          .filter(url => url.length > 0);
      }
    }

    let warrantyData = {
      providerName: "",
      urls: [],
      emails: [],
      phoneNumbers: []
    };

    if (warrantyDetails.length > 0) {
      const provider = warrantyDetails[0].provider;

      if (provider) {
        warrantyData.providerName = provider.name;
      }

      if (provider && provider.contact) {
        warrantyData.phoneNumbers = provider.contact
          .split(/\\/)
          .filter(number => number.length > 0);
      }

      if (provider && provider.email) {
        warrantyData.emails = provider.email
          .split(/\\/)
          .filter(email => email.length > 0);
      }

      if (provider && provider.url) {
        warrantyData.urls = provider.url
          .split(/\\/)
          .filter(url => url.length > 0);
      }
    }

    return (
      <View>
        <ScrollView
          style={styles.slider}
          contentContainerStyle={styles.sliderContentContainer}
          horizontal={true}
        >
          {brand && brand.status_type == 1 ? (
            <ConnectItem
              product={product}
              loggedInUser={loggedInUser}
              type="brand"
              title={I18n.t("product_details_screen_connect_brand_connect")}
              imageUrl={API_BASE_URL + "/" + brand.imageUrl}
              name={brand.name}
              phoneNumbers={brandData.phoneNumbers}
              emails={brandData.emails}
              urls={brandData.urls}
            />
          ) : null}

          {insuranceData.providerName ? (
            <ConnectItem
              product={product}
              loggedInUser={loggedInUser}
              type="insurance"
              title={I18n.t(
                "product_details_screen_connect_insurance_provider"
              )}
              imageSource={insuranceIcon}
              name={insuranceData.providerName}
              phoneNumbers={insuranceData.phoneNumbers}
              emails={insuranceData.emails}
              urls={insuranceData.urls}
            />
          ) : null}

          {warrantyData.providerName ? (
            <ConnectItem
              product={product}
              loggedInUser={loggedInUser}
              type="warranty"
              title={I18n.t("product_details_screen_connect_warranty_provider")}
              name={warrantyData.providerName}
              phoneNumbers={warrantyData.phoneNumbers}
              emails={warrantyData.emails}
              urls={warrantyData.urls}
            />
          ) : null}
        </ScrollView>
        {brand && brand.status_type == 1 ? (
          <View style={styles.ascContainer}>
            <Text weight="Bold" style={styles.ascTitle}>
              {I18n.t("product_details_screen_asc_title")}
            </Text>
            <TouchableOpacity
              onPress={this.openLocationPicker}
              style={styles.locationPicker}
            >
              <Text weight="Medium" style={styles.locationPickerText}>
                {place
                  ? `${place.name} (${place.address})`
                  : I18n.t("product_details_screen_asc_select_location")}
              </Text>
              <Icon
                name="md-locate"
                color={colors.pinkishOrange}
                size={24}
                style={{ width: 24 }}
              />
            </TouchableOpacity>
            {place && (
              <View style={styles.ascListContainer}>
                <FlatList
                  style={styles.ascList}
                  horizontal={true}
                  data={ascItems}
                  keyExtractor={(item, index) => index}
                  renderItem={this.renderAscItem}
                  refreshing={isFetchingAscItems}
                />
                {ascItems.length == 0 &&
                  !isFetchingAscItems && (
                    <View>
                      <Image style={styles.noAscImage} source={nearbyIcon} />
                      <Text style={styles.noAscMsg}>
                        {I18n.t("product_details_screen_asc_no_results")}
                      </Text>
                    </View>
                  )}
                <LoadingOverlay visible={isFetchingAscItems} />
              </View>
            )}
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  slider: {
    overflow: "visible"
  },
  sliderContentContainer: {
    paddingLeft: 16
  },
  ascContainer: {},
  ascTitle: {
    color: colors.mainText,
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 16
  },
  locationPicker: {
    marginHorizontal: 16,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 3,
    paddingVertical: 10,
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    marginBottom: 10,
    alignItems: "center"
  },
  locationPickerText: {
    color: colors.secondaryText,
    flex: 1
  },
  noAscMsg: {
    textAlign: "center",
    color: colors.secondaryText
  },
  ascListContainer: {
    minHeight: 200,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30
  },
  ascList: {
    marginLeft: 6
  },
  noAscImage: {
    width: 140,
    height: 140
  }
});

const mapStateToProps = state => {
  return {
    loggedInUser: state.loggedInUser
  };
};

export default connect(mapStateToProps)(CustomerCare);
