import React, { Component } from "react";
import { Platform, StyleSheet, View, FlatList, Alert } from "react-native";
import { API_BASE_URL, consumerGetEhome } from "../api";
import { Text, Button, ScreenContainer } from "../elements";

class TipsScreen extends Component {
  static navigatorStyle = {
    tabBarHidden: true
  };

  componentDidMount() {
    this.props.navigator.setTitle({
      title: "Tips to Build Your eHome"
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      tips: [
        {
          data:
            "“Always ask for a valid bill from the seller/trader. It is your right to get a bill as well as duty to ask from the seller.”",
          color: "#2ab9fe",
          border: "#54ddff"
        },
        {
          data:
            "Whenever you get a bill, the first thing you should do is scan and upload it in BinBill before you misplace or accidentally destroy it.",
          color: "#ff6262",
          border: "#ff9b9b"
        },
        {
          data:
            "While scanning the bill, ensure sufficient light without any shadow obstruction from your hand, phone or things around.",
          color: "#6271f0",
          border: "#9baaf9"
        },
        {
          data:
            "The document that you’d scan with the inbuilt scanner should keep in between the four corners as shown on the screen.",
          color: "#1ddbb7",
          border: "#3eefdc"
        },
        {
          data:
            "For good image quality, keep bills or documents on hard and level surface without any disturbance from wind.",
          color: "#b4e914",
          border: "#dbf62d"
        },
        {
          data:
            "Recommended to check if the bill is not torn, crumpled or physically damaged.",
          color: "#1ddbb7",
          border: "#3eefdc"
        },
        {
          data:
            "While scanning and uploading, crop the image to trim the unwanted areas and make it readable.",
          color: "#1ddbb7",
          border: "#3eefdc"
        },
        {
          data:
            "Choose from Original, Magic or Gray Color mode. Magic Mode is the most suitable for worn out or bills with fading ink.",
          color: "#1ddbb7",
          border: "#3eefdc"
        },
        {
          data:
            "Always review the image of bills or documents before finally uploading. If you can see the entries then we can alsoand if you are finding it difficult then chances are we will also find them difficult to read. Especially for the “kachha bills” the handwriting should be legible and preferred language is English.",
          color: "#1ddbb7",
          border: "#3eefdc"
        },
        {
          data:
            "It is always advisable to upload your bill along with any associated warranty, guarantee or insurance document. Rememberthese are important to extract necessary information in order to maintain your records in BinBill.",
          color: "#1ddbb7",
          border: "#3eefdc"
        },
        {
          data:
            "You can add prescriptions and related reports along with chemist bills, if they are available.",
          color: "#1ddbb7",
          border: "#3eefdc"
        },
        {
          data:
            "Do not upload selfies or other irrelevant photos since these would be discarded.",
          color: "#1ddbb7",
          border: "#3eefdc"
        },
        {
          data:
            "Bills can also be added from “Gallery”. After adding the image of the bill, make sure all the details are visible.If not, then retake the photo from BinBill scanner.",
          color: "#1ddbb7",
          border: "#3eefdc"
        },
        {
          data:
            "In case of Doc. and Pdf make sure that it contains bills and related documents, before uploading it.",
          color: "#1ddbb7",
          border: "#3eefdc"
        },
        {
          data:
            "If the bill is lengthy and cannot possibly come in a single frame, then take multiple photos. Please keep in mind to segregate Bill in equal parts.",
          color: "#1ddbb7",
          border: "#3eefdc"
        },
        {
          data:
            " Please do not upload the same bill/document more than once. Duplicacy will be discarded owing to quality issues. ",
          color: "#1ddbb7",
          border: "#3eefdc"
        }
      ]
    };
  }

  render() {
    return (
      <ScreenContainer style={styles.centerText}>
        <FlatList
          style={{ padding: 20, flex: 1 }}
          data={this.state.tips}
          keyExtractor={(item, index) => index}
          renderItem={({ item, index }) => (
            <View
              style={{
                backgroundColor: item.border,
                borderBottomColor: item.color,
                borderBottomWidth: 8,
                opacity: 20,
                marginBottom: 10,
                borderRadius: 4
              }}
            >
              <View style={styles.overlay} />
              <Text style={styles.mainText} weight="Medium">
                {item.data}
              </Text>

              <View
                style={{
                  marginTop: 35,
                  marginBottom: 20,
                  flex: 1,
                  flexDirection: "row"
                }}
              >
                <Text style={styles.gyan}>BinBill Gyan</Text>
                <Text style={styles.number} weight="Bold">
                  #{index + 1}
                </Text>
              </View>
            </View>
          )}
        />
      </ScreenContainer>
    );
  }
}
const styles = StyleSheet.create({
  centerText: {
    fontSize: 14,
    backgroundColor: "#eff1f6",
    padding: 0,
    height: "100%"
  },
  mainText: {
    fontSize: 20,
    padding: 30,
    letterSpacing: 0.25
  },
  gyan: {
    fontSize: 16,
    color: "#3b3b3b",
    width: 220,
    marginLeft: 20,
    marginTop: 30
  },
  overlay: {
    backgroundColor: "rgba(255,255,255,0.55)",
    position: "absolute",
    width: "100%",
    top: 0,
    bottom: 0
  },
  number: {
    fontSize: 40,
    alignItems: "center",
    color: "rgba(0,0,0,0.1)"
  }
});

export default TipsScreen;
