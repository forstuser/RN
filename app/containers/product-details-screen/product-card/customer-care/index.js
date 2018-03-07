import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { connect } from "react-redux";

import { API_BASE_URL } from "../../../../api";
import { Text } from "../../../../elements";

import Card from "./card";

class CustomerCare extends React.Component {
  render() {
    const { product, loggedInUser } = this.props;
    const { brand, insuranceDetails, warrantyDetails } = product;
    console.log("warrantyDetails: ", warrantyDetails);
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
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        horizontal={true}
      >
        {brand ? (
          <Card
            product={product}
            loggedInUser={loggedInUser}
            type="brand"
            title="BRAND CONNECT"
            imageUrl={API_BASE_URL + "/" + brand.imageUrl}
            name={brand.name}
            phoneNumbers={brandData.phoneNumbers}
            emails={brandData.emails}
            urls={brandData.urls}
          />
        ) : null}

        {insuranceData.providerName ? (
          <Card
            product={product}
            loggedInUser={loggedInUser}
            type="insurance"
            title="INSURANCE PROVIDER"
            name={insuranceData.providerName}
            phoneNumbers={insuranceData.phoneNumbers}
            emails={insuranceData.emails}
            urls={insuranceData.urls}
          />
        ) : null}

        {warrantyData.providerName ? (
          <Card
            product={product}
            loggedInUser={loggedInUser}
            type="warranty"
            title="WARRANTY PROVIDER"
            name={warrantyData.providerName}
            phoneNumbers={warrantyData.phoneNumbers}
            emails={warrantyData.emails}
            urls={warrantyData.urls}
          />
        ) : null}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: "visible"
  },
  contentContainer: {
    paddingLeft: 16
  }
});

const mapStateToProps = state => {
  return {
    loggedInUser: state.loggedInUser
  };
};

export default connect(mapStateToProps)(CustomerCare);
