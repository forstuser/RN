import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import moment from "moment";
import LinearGradient from "react-native-linear-gradient";
import { Text, Button } from "../../elements";
import I18n from "../../i18n";
import { colors } from "../../theme";
import { API_BASE_URL } from "../../api";
import { openBillsPopUp } from "../../navigation";
import SelectModal from "../../components/select-modal";

const AddProductItem = ({ item }) => {
  let mainCategoryId = 2;
  let categoryId = 327;

  let text = "Now let’s add your Mobile to Your eHome";
  let icon = require("../../images/ic_mobile.png");
  let subTitle = "";
  let sidebarTitle = "";
  let sidebarSubTitle = "";

  switch (item) {
    default:
  }
  return (
    <LinearGradient
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 0.0, y: 1 }}
      colors={["#01c8ff", "#0ae2f1"]}
      style={styles.container}
    >
      <Text weight="Bold" style={styles.title}>
        {text}
      </Text>
      <Image style={styles.icon} source={icon} resizeMode="contain" />
      <TouchableOpacity style={styles.detectDevice}>
        <Image
          style={styles.detectDeviceIcon}
          source={require("../../images/ic_detect_device.png")}
        />
        <Text style={styles.detectDeviceText}>DETECT THIS DEVICE</Text>
      </TouchableOpacity>

      <SelectModal
        style={styles.select}
        dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
        placeholder="Select a brand"
        placeholderRenderer={({ placeholder }) => (
          <Text weight="Bold" style={{ color: colors.secondaryText }}>
            {placeholder}
          </Text>
        )}
      />
      <SelectModal
        style={styles.select}
        dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
        placeholder="Select Modal Name"
        placeholderRenderer={({ placeholder }) => (
          <Text weight="Bold" style={{ color: colors.secondaryText }}>
            {placeholder}
          </Text>
        )}
      />
      <TouchableOpacity
        style={[styles.select, { flexDirection: "row", marginBottom: 35 }]}
      >
        <Text weight="Bold" style={{ color: colors.secondaryText, flex: 1 }}>
          Upload Bill (Optional)
        </Text>
        <Image
          style={{ width: 24, height: 24 }}
          source={require("../../images/ic_upload_new_pic_orange.png")}
        />
      </TouchableOpacity>
      <Button text="Add Product" color="secondary" style={{ width: 320 }} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  title: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 15
  },
  icon: {
    width: 68,
    height: 68
  },
  detectDevice: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    marginBottom: 25
  },
  detectDeviceIcon: {
    width: 12,
    height: 12,
    marginRight: 10
  },
  detectDeviceText: {
    fontSize: 14,
    color: "#fff"
  },
  select: {
    backgroundColor: "#fff",
    borderColor: colors.secondaryText,
    borderWidth: 1,
    height: 50,
    width: 320,
    borderRadius: 4,
    padding: 14,
    marginBottom: 20,
    alignItems: "center"
  }
});
export default AddProductItem;
