import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { Text, Button } from "../../elements";
import Modal from "react-native-modal";
import { colors } from "../../theme";
import { API_BASE_URL } from "../../api";

const FinishModal = ({
  visible,
  mainCategoryId,
  title = "Product added to your eHome.",
  navigator
}) => (
  <Modal useNativeDriver={true} isVisible={visible}>
    <View style={styles.finishModal}>
      <Image
        style={styles.finishImage}
        source={{
          uri: API_BASE_URL + `/categories/${mainCategoryId}/images/1`
        }}
        resizeMode="contain"
      />
      <Text weight="Bold" style={styles.finishMsg}>
        {title}
      </Text>
      <Button
        style={styles.finishBtn}
        text="ADD MORE PRODUCTS"
        color="secondary"
      />
      <Text
        onPress={() => navigator.pop()}
        weight="Bold"
        style={styles.doItLaterText}
      >
        I'll Do it Later
      </Text>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  finishModal: {
    backgroundColor: "#fff",
    height: 500,
    borderRadius: 10,
    padding: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  finishImage: {
    width: 200,
    height: 200
  },
  finishMsg: {
    color: colors.mainBlue,
    fontSize: 24,
    textAlign: "center",
    marginTop: 25
  },
  finishBtn: {
    width: 250,
    marginTop: 20
  },
  doItLaterText: {
    color: colors.pinkishOrange,
    fontSize: 16,
    marginTop: 20
  }
});

export default FinishModal;
