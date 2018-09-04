import React from "react";
import { StyleSheet, View, TouchableOpacity, ScrollView } from "react-native";
import moment from "moment";
import _ from "lodash";
import getDirections from "react-native-google-maps-directions";

import Analytics from "../../../../analytics";

import KeyValueItem from "../../../../components/key-value-item";
import MultipleContactNumbers from "../../../../components/multiple-contact-numbers";
import { Text, Button } from "../../../../elements";
import { colors } from "../../../../theme";
import I18n from "../../../../i18n";

import {
  MAIN_CATEGORY_IDS,
  SCREENS,
  WARRANTY_TYPES
} from "../../../../constants";

import AddItemBtn from "./add-item-btn";
import ViewBillRow from "./view-bill-row";
import EditOptionRow from "./edit-option-row";

class AccessoriesDetails extends React.Component {
  render() {
    const { product, navigation } = this.props;
    const { accessories } = product;

    const AccessoryItem = ({ accessory }) => (
      <View collapsable={false} style={styles.card}>
        <EditOptionRow
          text="Details"
          onEditPress={() => {
            Analytics.logEvent(Analytics.EVENTS.CLICK_EDIT, {
              entity: "parts_and_accessories"
            });
            this.props.openAddEditAccessoryScreen(accessory);
          }}
        />
        {accessory.copies ? (
          <ViewBillRow
            collapsable={false}
            docType="Accessory"
            copies={accessory.copies || []}
          />
        ) : (
          <View />
        )}

        {accessory.accessory_part_name ? (
          <KeyValueItem
            keyText="Name"
            valueText={accessory.accessory_part_name}
          />
        ) : (
          <View />
        )}

        {accessory.warrantyDetails && accessory.warrantyDetails[0] ? (
          <KeyValueItem
            keyText="Warranty"
            valueText={accessory.warrantyDetails[0].premiumType}
          />
        ) : (
          <View />
        )}
      </View>
    );

    return (
      <View collapsable={false} style={styles.container}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.slider}
          showsHorizontalScrollIndicator={true}
        >
          {accessories.map((accessory, index) => (
            <AccessoryItem key={index} accessory={accessory} />
          ))}
          <AddItemBtn
            text="Add Part or Accessory"
            onPress={() => this.props.openAddEditAccessoryScreen(null)}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10
  },
  slider: {
    paddingBottom: 20
  },
  card: {
    width: 290,
    backgroundColor: "#fff",
    marginRight: 20,
    marginLeft: 5,
    borderRadius: 3,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1
  }
});

export default AccessoriesDetails;
