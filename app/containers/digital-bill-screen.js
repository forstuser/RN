import React, { Component } from "react";
import { StyleSheet, View, FlatList, Image } from "react-native";
import { Text, Button, ScreenContainer } from "../elements";
import { colors } from "../theme";
const logo = require("../images/splash.png");

class DigitalBillScreen extends Component {
  static navigationOptions = {
    title: "Invoice"
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {}

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ flex: 1 }}>
          <FlatList
            style={{ flex: 1 }}
            ListHeaderComponent={() => (
              <View
                style={{
                  flex: 1,
                  borderBottomColor: "#dadada",
                  borderBottomWidth: 1,
                  margin: 15,
                  marginBottom: 0,
                  paddingBottom: 5
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center"
                  }}
                >
                  <Text weight="Bold" style={styles.shopName}>
                    Variety Store{" "}
                  </Text>
                  <Image
                    source={logo}
                    style={{
                      position: "absolute",
                      right: 5,
                      top: 0,
                      width: 50,
                      height: 50
                    }}
                  />
                  <Text style={styles.address}>
                    B-350, I-Tech Park, Sohna Road, Sector - 49, Gurgaon 110012,
                    Haryana
                  </Text>
                  <Text style={{ fontSize: 12 }}>GSTIN : 39485736254176</Text>
                </View>
                <View style={styles.line} />
                <View style={{ marginTop: 7 }}>
                  <View style={styles.billDate}>
                    <Text style={{ fontSize: 12 }}>Bill No. :</Text>
                    <Text style={{ fontSize: 12 }}>893847</Text>
                  </View>
                  <View style={styles.billDate}>
                    <Text style={{ fontSize: 12 }}>Date & Time :</Text>
                    <Text style={{ fontSize: 12 }}>
                      30 Oct, 2018 | 01:16 PM
                    </Text>
                  </View>
                </View>

                <View style={styles.line} />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginHorizontal: 7,
                    marginTop: 7
                  }}
                >
                  <Text
                    weight="Medium"
                    style={{ fontSize: 10.5, color: "#777777", flex: 3 }}
                  >
                    Items
                  </Text>
                  <Text weight="Medium" style={styles.headerTitle}>
                    Qty.
                  </Text>
                  <Text weight="Medium" style={styles.headerTitle}>
                    Rate
                  </Text>
                  <Text weight="Medium" style={styles.headerTitle}>
                    GST
                  </Text>
                  <Text weight="Medium" style={styles.headerTitle}>
                    Total Amt.
                  </Text>
                </View>
                <View style={styles.line} />
              </View>
            )}
            data={[
              {
                id: "1",
                name: "Amul Butter"
              },
              {
                id: "2",
                name: "Amul Butter"
              },
              {
                id: "3",
                name: "Amul Butter"
              }
            ]}
            keyExtractor={(item, index) => item.id + "" + index}
            renderItem={({ item, index }) => {
              <View style={{ flex: 1, backgroundColor: "green" }}>
                <Text>{item.name}</Text>
              </View>;
            }}
            ListFooterComponent={() => (
              <View>
                <View style={styles.footerView}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 7
                    }}
                  >
                    <View>
                      <Text weight="Medium" style={{ fontSize: 12 }}>
                        Total Amount:
                      </Text>
                      <Text style={{ fontSize: 11 }}>(Inclusive of Tax)</Text>
                    </View>

                    <Text weight="Medium" style={{ fontSize: 12 }}>
                      724
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 7
                    }}
                  >
                    <Text weight="Medium" style={{ fontSize: 12 }}>
                      BinBill Cashback :
                    </Text>
                    <Text weight="Medium" style={{ fontSize: 12 }}>
                      724
                    </Text>
                  </View>
                </View>
                <Text style={{ fontSize: 12, marginHorizontal: 14 }}>
                  Total Quantity : 06
                </Text>
                <View style={styles.taxView}>
                  <Text style={{ fontSize: 12, marginHorizontal: 7 }}>
                    CGST = 300.0 * 2.5% = 7.5 130.0 * 0.0% = 0.0. 67.86 * 6.0% =
                    4.07
                  </Text>
                  <Text style={styles.taxText}>Total CGST = 11.57</Text>
                  <Text style={styles.taxText}>
                    SGST = 300.0 * 2.5% = 7.5 130.0 * 0.0% = 0.0. 67.86 * 6.0% =
                    4.07
                  </Text>
                  <Text style={styles.taxText}>Total SGST = 11.57</Text>
                </View>

                <View
                  style={{
                    flex: 1,
                    alignContent: "flex-end",
                    flexDirection: "column"
                  }}
                >
                  <Text style={styles.footerText}>
                    *** This is a computer generated invoice and signature is
                    not required
                  </Text>
                  <Text style={styles.footerText}>
                    E&OE: Powered by BinBill
                  </Text>
                </View>
              </View>
            )}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  shopName: {
    fontSize: 16,
    color: colors.mainText
  },
  address: {
    fontSize: 12,
    width: 235,
    padding: 14
  },
  billDate: {
    flexDirection: "row",
    width: 235,
    justifyContent: "space-between"
  },
  image: {
    width: 50,
    height: 50
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: colors.secondaryText,
    width: 355,
    marginTop: 8
  },
  headerTitle: {
    fontSize: 10,
    color: "#777777",
    flex: 1
  },
  footerView: {
    flex: 1,
    borderBottomColor: "#dadada",
    borderBottomWidth: 1,
    marginHorizontal: 15,
    marginBottom: 0,
    paddingBottom: 5
  },
  taxView: { marginTop: 16, padding: 7, backgroundColor: "#f9f9f9" },
  taxText: { fontSize: 12, marginHorizontal: 7, paddingTop: 7 },
  footerText: { fontSize: 10, marginHorizontal: 7, alignSelf: "center" }
});

export default DigitalBillScreen;
