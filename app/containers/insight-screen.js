import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  Image,
  FlatList,
  Alert,
  TouchableOpacity
} from "react-native";
import { API_BASE_URL, consumerGetEhome } from "../api";
import { ActionSheetCustom as ActionSheet } from "react-native-actionsheet";
import { Text, Button, ScreenContainer } from "../elements";
import Collapsible from "./../components/collapsible";

class InsightScreen extends Component {
  static navigatorStyle = {
    tabBarHidden: true
  };
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.navigator.setTitle({
      title: "Insights & Trends"
    });
  }

  taxPaidScreen = () => {
    this.props.navigator.setTitle({
      screen: "TotalTaxScreen"
    });
  };

  render() {
    const SectionHeader = ({ text }) => (
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderTopBorder} />
        <Text weight={"Bold"} style={styles.sectionHeaderText}>
          {text}
        </Text>
      </View>
    );
    return (
      <ScreenContainer style={styles.container}>
        <View style={{ backgroundColor: "#3b3b3b", height: 54, padding: 15 }}>
          <Text style={{ color: "#9c9c9c", fontSize: 14 }} weight="Bold">
            For Aug 2017
          </Text>
          <TouchableOpacity
            onPress={() => {
              this.insightModal.show();
            }}
          >
            <Text>Data</Text>
          </TouchableOpacity>
          <ActionSheet
            ref={o => (this.insightModal = o)}
            title="Choose an option"
            cancelButtonIndex={4}
            options={[
              "Email Manufacturer",
              "Call Manufacturer",
              "Service Request",
              "Nearest Authorised Service center",
              "Cancel"
            ]}
          />
        </View>

        <View style={{ padding: 20 }}>
          <View
            style={{
              flexDirection: "row",
              // height: 100,
              borderColor: "#ececec",
              borderRadius: 6,
              borderWidth: 1,
              width: "100%"
            }}
          >
            <View>
              <Image
                style={{ width: 90, height: 82 }}
                source={require("../images/ic_insight_tax_gradient.png")}
              />
            </View>

            <Image
              style={{
                position: "absolute",
                top: 10,
                left: 20,
                width: 50,
                height: 50,
                backgroundColor: "white",
                borderColor: "#e6e6e6",
                borderRadius: 6,
                borderWidth: 1,
                margin: 5
              }}
              source={require("../images/ic_insight_tax.png")}
            />
            <View style={{ width: 100, paddingTop: 15 }}>
              <Text style={{ fontSize: 14, color: "#4a4a4a" }} weight="Medium">
                Total Tax Paid
              </Text>
              <Text style={{ fontSize: 20, color: "#4a4a4a" }} weight="Bold">
                ₹1,300
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              paddingTop: 6,
              height: 40,
              backgroundColor: "white",
              borderColor: "#e6e6e6",
              borderRadius: 6,
              borderWidth: 1
            }}
          >
            <TouchableOpacity onPress={this.taxPaidScreen}>
              <View
                style={{
                  fontSize: 14,
                  marginRight: 30,
                  marginBottom: 10
                }}
              >
                <Text style={{ color: "#ff732e" }} weight="Bold">
                  See details
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <SectionHeader text={`EXPENSES`} />

        <View style={styles.spends}>
          <Text style={{ fontSize: 24, color: "#9c9c9c" }} weight="Regular">
            Total Spends
          </Text>
          <Text style={{ fontSize: 24, color: "#3b3b3b" }} weight="Medium">
            ₹31,400
          </Text>
        </View>

        <View>
          <View style={{ flexDirection: "row", padding: 20 }}>
            <View>
              <Text
                style={{
                  backgroundColor: "red",
                  height: 20,
                  width: 20,
                  borderRadius: 10,
                  marginTop: 10
                }}
              />
            </View>
            <View style={{ marginLeft: 18 }}>
              <Text style={{ fontSize: 14, color: "#4a4a4a" }} weight="Medium">
                Automobiles
              </Text>
              <Text style={{ fontSize: 12, color: "#4a4a4a" }} weight="Regular">
                ₹ 12114957
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", padding: 20 }}>
            <View>
              <Text
                style={{
                  backgroundColor: "red",
                  height: 20,
                  width: 20,
                  borderRadius: 10,
                  marginTop: 10
                }}
              />
            </View>
            <View style={{ marginLeft: 18 }}>
              <Text style={{ fontSize: 14, color: "#4a4a4a" }} weight="Medium">
                Automobiles
              </Text>
              <Text style={{ fontSize: 12, color: "#4a4a4a" }} weight="Regular">
                ₹ 12114957
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", padding: 20 }}>
            <View>
              <Text
                style={{
                  backgroundColor: "red",
                  height: 20,
                  width: 20,
                  borderRadius: 10,
                  marginTop: 10
                }}
              />
            </View>
            <View style={{ marginLeft: 18 }}>
              <Text style={{ fontSize: 14, color: "#4a4a4a" }} weight="Medium">
                Automobiles
              </Text>
              <Text style={{ fontSize: 12, color: "#4a4a4a" }} weight="Regular">
                ₹ 12114957
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", padding: 20 }}>
            <View>
              <Text
                style={{
                  backgroundColor: "red",
                  height: 20,
                  width: 20,
                  borderRadius: 10,
                  marginTop: 10
                }}
              />
            </View>
            <View style={{ marginLeft: 18 }}>
              <Text style={{ fontSize: 14, color: "#4a4a4a" }} weight="Medium">
                Automobiles
              </Text>
              <Text style={{ fontSize: 12, color: "#4a4a4a" }} weight="Regular">
                ₹ 12114957
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", padding: 20 }}>
            <View>
              <Text
                style={{
                  backgroundColor: "red",
                  height: 20,
                  width: 20,
                  borderRadius: 10,
                  marginTop: 10
                }}
              />
            </View>
            <View style={{ marginLeft: 18 }}>
              <Text style={{ fontSize: 14, color: "#4a4a4a" }} weight="Medium">
                Automobiles
              </Text>
              <Text style={{ fontSize: 12, color: "#4a4a4a" }} weight="Regular">
                ₹ 12114957
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", padding: 20 }}>
            <View>
              <Text
                style={{
                  backgroundColor: "red",
                  height: 20,
                  width: 20,
                  borderRadius: 10,
                  marginTop: 10
                }}
              />
            </View>
            <View style={{ marginLeft: 18 }}>
              <Text style={{ fontSize: 14, color: "#4a4a4a" }} weight="Medium">
                Automobiles
              </Text>
              <Text style={{ fontSize: 12, color: "#4a4a4a" }} weight="Regular">
                ₹ 12114957
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", padding: 20 }}>
            <View>
              <Text
                style={{
                  backgroundColor: "red",
                  height: 20,
                  width: 20,
                  borderRadius: 10,
                  marginTop: 10
                }}
              />
            </View>
            <View style={{ marginLeft: 18 }}>
              <Text style={{ fontSize: 14, color: "#4a4a4a" }} weight="Medium">
                Automobiles
              </Text>
              <Text style={{ fontSize: 12, color: "#4a4a4a" }} weight="Regular">
                ₹ 12114957
              </Text>
            </View>
          </View>
        </View>
      </ScreenContainer>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    padding: 0
  },
  spends: {
    alignItems: "center"
    // borderColor: "#ececec"
    // borderBottomWidth: 1
  },
  sectionHeader: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 10
  },
  sectionHeaderTopBorder: {
    width: 40,
    height: 2,
    backgroundColor: "#e6e6e6"
  },
  sectionHeaderText: {
    padding: 10,
    fontSize: 12
  }
});
export default InsightScreen;
