import React from "react";
import {
  Image,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions
} from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import RNGooglePlaces from "react-native-google-places";

import { API_BASE_URL, getAscSearchResults } from "../../../../api";
import { Text } from "../../../../elements";
import I18n from "../../../../i18n";
import LoadingOverlay from "../../../../components/loading-overlay";
import { showSnackbar } from "../../../../utils/snackbar";
import { MAIN_CATEGORY_IDS } from "../../../../constants";
import ConnectItem from "./connect-item";
import AscItem from "./asc-item";
import ServiceSchedules from "./service-schedules";
import Analytics from "../../../../analytics";
import { colors } from "../../../../theme";

const insuranceIcon = require("../../../../images/categories/insurance.png");
const nearbyIcon = require("../../../../images/ic_nearby.png");

class CustomerCare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      place: null,
      ascItems: [],
      ascContainerPositionY: 0
    };
  }

  fetchAscItems = async () => {
    const { place, ascContainerPositionY } = this.state;
    const { product, loggedInUser, scrollScreenToAsc } = this.props;
    const { brand } = product;

    setTimeout(() => {
      scrollScreenToAsc(ascContainerPositionY);
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
      setTimeout(() => {
        scrollScreenToAsc(ascContainerPositionY);
      }, 200);
    } catch (e) {
      this.setState({
        ascItems: [],
        isFetchingAscItems: false
      });
      showSnackbar({
        text: e.message
      });
    }
  };

  onAscContainerLayout = event => {
    this.setState({ ascContainerPositionY: event.nativeEvent.layout.y });
  };

  openLocationPicker = async () => {
    Analytics.logEvent(Analytics.EVENTS.CLICK_ASC_INSIDE_PRODUCT_CARD);
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
      showSnackbar({
        text: e.message
      });
    }
  };

  render() {
    const { place, ascItems, isFetchingAscItems } = this.state;
    const {
      product,
      loggedInUser,
      cardWidthWhenMany,
      cardWidthWhenOne
    } = this.props;
    const {
      brand,
      insuranceDetails,
      warrantyDetails,
      serviceSchedules
    } = product;

    let brandData = {
      urls: [],
      emails: [],
      phoneNumbers: []
    };

    if (brand) {
      brand.details.forEach(item => {
        switch (item.typeId) {
          case 1:
            brandData.urls.push(item);
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
      providerId: null,
      providerName: "",
      urls: [],
      emails: [],
      phoneNumbers: []
    };

    if (insuranceDetails.length > 0) {
      const provider = insuranceDetails[0].provider;

      if (provider && provider.status_type != 11) {
        insuranceData.providerId = provider.id;
        insuranceData.providerName = provider.name;
      }

      if (insuranceData.providerId && provider.contact) {
        insuranceData.phoneNumbers = provider.contact
          .split(/\\/)
          .filter(number => number.length > 0);
      }

      if (insuranceData.providerId && provider.email) {
        insuranceData.emails = provider.email
          .split(/\\/)
          .filter(email => email.length > 0);
      }

      if (insuranceData.providerId && provider.url) {
        insuranceData.urls = provider.url
          .split(/\\/)
          .filter(url => url.length > 0)
          .map(val => {
            return {
              displayName: val,
              details: val
            };
          });
      }
    }

    let warrantyData = {
      providerId: null,
      providerName: "",

      urls: [],
      emails: [],
      phoneNumbers: []
    };

    if (warrantyDetails.length > 0) {
      const provider = warrantyDetails[0].provider;

      if (provider && provider.status_type != 11) {
        warrantyData.providerId = provider.id;
        warrantyData.providerName = provider.name;
      }

      if (warrantyData.providerId && provider.contact) {
        warrantyData.phoneNumbers = provider.contact
          .split(/\\/)
          .filter(number => number.length > 0);
      }

      if (warrantyData.providerId && provider.email) {
        warrantyData.emails = provider.email
          .split(/\\/)
          .filter(email => email.length > 0);
      }

      if (warrantyData.providerId && provider.url) {
        warrantyData.urls = provider.url
          .split(/\\/)
          .filter(url => url.length > 0)
          .map(val => {
            return {
              displayName: val,
              details: val
            };
          });
      }
    }

    let connectItems = [];
    if (brand && brand.status_type == 1 && brand.id > 0) {
      connectItems.push({
        type: "brand",
        title: I18n.t("product_details_screen_connect_brand_connect"),
        imageUrl: API_BASE_URL + "/" + brand.imageUrl,
        name: brand.name,
        phoneNumbers: brandData.phoneNumbers,
        emails: brandData.emails,
        urls: brandData.urls
      });
    }

    if (insuranceData.providerId) {
      connectItems.push({
        type: "insurance",
        title: I18n.t("product_details_screen_connect_insurance_provider"),
        imageUrl: `${API_BASE_URL}/providers/${
          insuranceData.providerId
        }/images`,
        name: insuranceData.providerName,
        phoneNumbers: insuranceData.phoneNumbers,
        emails: insuranceData.emails,
        urls: insuranceData.urls
      });
    }

    if (warrantyData.providerId) {
      connectItems.push({
        type: "warranty",
        title: I18n.t("product_details_screen_connect_warranty_provider"),
        imageUrl: `${API_BASE_URL}/providers/${warrantyData.providerId}/images`,
        name: warrantyData.providerName,
        phoneNumbers: warrantyData.phoneNumbers,
        emails: warrantyData.emails,
        urls: warrantyData.urls
      });
    }

    let connectItemWidth = cardWidthWhenMany;
    if (connectItems.length == 1) {
      connectItemWidth = cardWidthWhenOne;
    }

    let ascItemWidth = cardWidthWhenMany;
    if (ascItems.length == 1) {
      ascItemWidth = cardWidthWhenOne;
    }

    return (
      <View collapsable={false} style={styles.container}>
        <FlatList
          style={styles.slider}
          horizontal={true}           showsHorizontalScrollIndicator={false}
          data={connectItems}
          keyExtractor={(item, index) => index}
          renderItem={({ item }) => {
            return (
              <ConnectItem
                cardStyle={{ width: connectItemWidth }}
                product={product}
                loggedInUser={loggedInUser}
                type={item.type}
                title={item.title}
                imageUrl={item.imageUrl}
                imageSource={item.imageSource}
                name={item.name}
                phoneNumbers={item.phoneNumbers}
                emails={item.emails}
                urls={item.urls}
              />
            );
          }}
        />
        {product.masterCategoryId != MAIN_CATEGORY_IDS.FURNITURE &&
        brand &&
        brand.id > 0 &&
        brand.status_type == 1 ? (
          <View
            collapsable={false}
            style={styles.ascContainer}
            onLayout={this.onAscContainerLayout}
          >
            <Text weight="Bold" style={styles.sectionTitle}>
              {I18n.t("product_details_screen_asc_title")}
            </Text>
            <TouchableOpacity
              onPress={this.openLocationPicker}
              style={styles.locationPicker}
            >
              <Text weight="Medium" style={styles.locationPickerText}>
                {place
                  ? `${place.name} ${
                      place.address ? "(" + place.address + ")" : ""
                    }`
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
              <View collapsable={false} style={styles.ascListContainer}>
                <FlatList
                  style={styles.ascList}
                  horizontal={true}           showsHorizontalScrollIndicator={false}
                  data={ascItems}
                  keyExtractor={(item, index) => index}
                  renderItem={({ item }) => {
                    return (
                      <AscItem
                        product={this.props.product}
                        item={item}
                        style={{ width: ascItemWidth }}
                      />
                    );
                  }}
                  refreshing={isFetchingAscItems}
                />
                {ascItems.length == 0 && !isFetchingAscItems ? (
                  <View collapsable={false}>
                    <Image style={styles.noAscImage} source={nearbyIcon} />
                    <Text style={styles.noAscMsg}>
                      {I18n.t("product_details_screen_asc_no_results")}
                    </Text>
                  </View>
                ) : (
                  <View collapsable={false} />
                )}
                <LoadingOverlay visible={isFetchingAscItems} />
              </View>
            )}
          </View>
        ) : null}
        {serviceSchedules &&
          serviceSchedules.length > 0 && (
            <View collapsable={false}>
              <Text weight="Bold" style={styles.sectionTitle}>
                {I18n.t("product_details_screen_service_schedule_title")}
              </Text>
              <ServiceSchedules
                product={product}
                navigation={this.props.navigation}
              />
            </View>
          )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8
  },
  slider: {
    overflow: "visible"
  },
  sliderContentContainer: {
    paddingLeft: 16
  },
  ascContainer: {},
  sectionTitle: {
    color: colors.mainText,
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 8
  },
  locationPicker: {
    marginHorizontal: 8,
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
    color: colors.secondaryText,
    marginBottom: 15
  },
  ascListContainer: {
    minHeight: 100,
    alignItems: "center",
    justifyContent: "center"
  },
  ascList: {},
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
