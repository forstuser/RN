import React from "react";
import { View, Image, ScrollView } from "react-native";

import { Text } from "../../elements";
import Modal from "../../components/modal";

export default ({
  isChecklistModalVisible = false,
  hideChecklistModal = () => null
}) => {
  const checklistWithImages = [
    {
      image: require("../../images/checklist-images/image1.png"),
      text: "Only Printed"
    },
    {
      image: require("../../images/checklist-images/image2.png"),
      text: "Readable"
    },
    {
      image: require("../../images/checklist-images/image3.png"),
      text: "One Bill in one Click"
    }
  ];
  const terms = [
    "Additional Cashback valid only on FMCG items",
    "Bill to be uploaded on same date as Purchase Date",
    "Purchase Date, Total Amt. & Bill No. details are mandatory",
    "Items in the bill must have clear identification for Brand & Product",
    "Add your Seller in My Seller section to avail additional Seller Points"
  ];

  return (
    <Modal
      isVisible={isChecklistModalVisible}
      title="Cashback Claim Checklist"
      onClosePress={hideChecklistModal}
      style={{ backgroundColor: "#fff", height: 350 }}
    >
      <ScrollView contentContainerStyle={{ padding: 15 }}>
        <Text weight="Bold" style={{ fontSize: 11 }}>
          Bill Image Checklist
        </Text>
        <View
          style={{
            flexDirection: "row",
            padding: 10
          }}
        >
          {checklistWithImages.map(item => (
            <View
              key={item.text}
              style={{
                flex: 1,
                alignItems: "center"
              }}
            >
              <View
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 27,
                  backgroundColor: "#f7f7f7",
                  padding: 15
                }}
              >
                <Image
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="contain"
                  source={item.image}
                />
              </View>
              <Text
                weight="Medium"
                style={{ fontSize: 10, marginTop: 8, textAlign: "center" }}
              >
                {item.text}
              </Text>
            </View>
          ))}
        </View>
        <Text weight="Bold" style={{ fontSize: 11, marginBottom: 10 }}>
          Terms & Conditions
        </Text>
        {terms.map(term => (
          <View
            key={term}
            style={{
              marginBottom: 8,
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <View
              style={{
                marginRight: 8,
                width: 7,
                height: 7,
                borderRadius: 4,
                backgroundColor: "#cacaca"
              }}
            />
            <Text style={{ fontSize: 10 }}>{term}</Text>
          </View>
        ))}
      </ScrollView>
    </Modal>
  );
};
