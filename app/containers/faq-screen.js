import React, { Component } from "react";
import { Platform, StyleSheet, View, FlatList, Alert } from "react-native";
import { API_BASE_URL, consumerGetEhome } from "../api";
import { Text, Button, ScreenContainer } from "../elements";
import Collapsible from "./../components/collapsible";

class FaqScreen extends Component {
  static navigatorStyle = {
    tabBarHidden: true
  };
  constructor(props) {
    super(props);
    this.state = {
      faqs: [
        {
          question: "What is BinBill?",
          answer:
            "BinBill is a way to ease the process of managing bills, analysing expense trends, and availing after sales benefits with ease. In short, BinBill is a smarter way of living life."
        },
        {
          question: "Where will I find in BinBill?",
          answer:
            "You can download the mobile App for android , or login to www.binbill.com"
        },
        {
          question: "How does BinBill work?",
          answer:
            "Once you upload your bills, our team processes the bills and add items and other details of the bills to your eHome(BinBill account); subsequently bills and products get added into your eHome based on categories of item. After the analysis, we help you with your expense trend, reminders for renewals, or warranty expiration, and much more."
        },
        {
          question: "How do I upload a bill?",
          answer:
            "Launch the application on your phone (if not downloaded, request download link), and tap on the upload bill button. Just use the camera through our application, fit the bill/document being scanned in the edges as marked on the screen and tap on the camera button. It’s done, and in similar manner you can do it on the website. Just click on upload tab in the App or login to www.binbill.com."
        },
        {
          question: "How does BinBill add value to my bills?",
          answer:
            "BinBill captures important details in the bill from seller like product info, manufacturer info, amount spent etc., all of which will be available at your disposal whenever you need it. Along with all of it, BinBill sorts out the bills for the users, based on the categories like electronics, automotives, home appliances etc."
        }
      ]
    };
  }
  componentDidMount() {
    this.props.navigator.setTitle({
      title: "FAQs"
    });
  }

  render() {
    return (
      <ScreenContainer style={styles.contain}>
        <FlatList
          data={this.state.faqs}
          keyExtractor={(item, index) => index}
          renderItem={({ item }) => (
            <Collapsible headerText={item.question} weight="Medium">
              <Text style={styles.text}>{item.answer}</Text>
            </Collapsible>
          )}
        />
      </ScreenContainer>
    );
  }
}
const styles = StyleSheet.create({
  contain: {
    fontSize: 14,
    padding: 0
  },
  text: {
    padding: 12,
    fontSize: 14,
    color: "#3b3b3b"
  }
});
export default FaqScreen;
