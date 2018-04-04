import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
  Dimensions
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import call from "react-native-phone-call";
import moment from "moment";
import getDirections from "react-native-google-maps-directions";

import {
  SCREENS,
  MAIN_CATEGORY_IDS,
  CATEGORY_IDS,
  METADATA_KEYS
} from "../../../../constants";

import Analytics from "../../../../analytics";
import I18n from "../../../../i18n";
import { showSnackbar } from "../../../snackbar";

import { API_BASE_URL } from "../../../../api";
import { Text, AsyncImage } from "../../../../elements";
import { colors } from "../../../../theme";

import { getMetaValueByKey } from "../../../../utils";
const directionIcon = require("../../../../images/ic_directions.png");
const callIcon = require("../../../../images/ic_call.png");

class AscItem extends React.Component {
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

  handlePhonePress = phoneNumber => {
    call({
      number: phoneNumber.replace(/\(.+\)/, "").trim()
    }).catch(e => showSnackbar({
      text: e.message
    })
    )
  };

  handleEmailPress = email => {
    const url = `mailto:${email}`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        showSnackbar({
          text: "Don't know how to open URI: " + url
        })
      }
    });
  };

  render() {
    const { item, style } = this.props;
    let phoneNumbers = [];
    let emails = [];
    for (let i = 0; i < item.centerDetails.length; i++) {
      if (
        item.centerDetails[i].type == 3 &&
        item.centerDetails[i].details != null
      ) {
        phoneNumbers.push(String(item.centerDetails[i].details));
      } else if (
        item.centerDetails[i].type == 2 &&
        item.centerDetails[i].details != null
      ) {
        emails.push(String(item.centerDetails[i].details));
      }
    }

    return (
      <View style={[styles.item, style]}>
        <View style={styles.imageWrapper}>
          <Image
            style={styles.itemImage}
            source={{ uri: API_BASE_URL + item.cImageURL }}
            resizeMode="contain"
          />
        </View>
        <View style={styles.itemDetails}>
          <Text weight="Bold" style={styles.itemName}>
            {item.centerName.toUpperCase()}
          </Text>

          <Text weight="Medium" style={styles.itemDistance}>
            {item.distance + " " + item.distanceMetrics}
          </Text>
          <View style={styles.itemDetailSection}>
            <Text weight="Medium" style={styles.itemDetail}>
              {item.address}
            </Text>
          </View>
          {phoneNumbers.length > 0 && (
            <View style={styles.itemDetailSection}>
              {phoneNumbers.map(phoneNumber => (
                <TouchableOpacity
                  key={phoneNumber}
                  onPress={() => this.handlePhonePress(phoneNumber)}
                  style={styles.itemDetail}
                >
                  <Icon
                    name="ios-call"
                    size={15}
                    color={colors.pinkishOrange}
                  />
                  <Text style={styles.itemDetailText} weight="Medium">
                    {phoneNumber}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {emails.length > 0 && (
            <View style={styles.itemDetailSection}>
              {emails.map(email => (
                <TouchableOpacity
                  key={email}
                  onPress={() => this.handleEmailPress(email)}
                  style={styles.itemDetail}
                >
                  <Icon
                    name="md-mail-open"
                    size={15}
                    color={colors.pinkishOrange}
                  />
                  <Text style={styles.itemDetailText} weight="Medium">
                    {email}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <View style={styles.itemDetailSection}>
            <Text weight="Medium" style={styles.itemDetail}>
              {item.openingDays}
            </Text>
            <Text weight="Medium" style={styles.itemDetail}>
              {item.timings}
            </Text>
          </View>
        </View>
        <View style={styles.directionAndCall}>
          <TouchableOpacity
            onPress={() => this.openMap(item.centerAddress)}
            style={styles.directionAndCallItem}
          >
            <Text weight="Bold" style={styles.directionAndCallText}>
              {I18n.t("product_details_screen_asc_directions")}
            </Text>
            <Image style={styles.directionAndCallIcon} source={directionIcon} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    margin: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    backgroundColor: "#fff"
  },

  imageWrapper: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ececec"
  },
  itemImage: {
    height: 100
  },
  itemDetails: {
    padding: 16,
    flex: 1
  },
  itemDistance: {
    fontSize: 12,
    marginTop: 8
  },
  itemDetailSection: {
    marginTop: 10
  },
  itemDetail: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center"
  },
  itemDetailText: {
    marginLeft: 8,
    fontSize: 12,
    color: colors.secondaryText
  },
  directionAndCall: {
    flexDirection: "row"
  },
  directionAndCallItem: {
    bottom: 0,
    left: 0,
    width: "100%",
    height: 40,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#ececec",
    borderTopWidth: 1
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

export default AscItem;
