import React from "react";
import { StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { RNCamera } from "react-native-camera";
import Analytics from "../../analytics";

import { showSnackbar } from "../../utils/snackbar";

import { getBarcodeSkuItem } from "../../api";

import Modal from "../../components/modal";
import LoadingOverlay from "../../components/loading-overlay";
import { Text, Image, Button } from "../../elements";
import { defaultStyles, colors } from "../../theme";

import SkuItem from "./sku-item";

export default class BarcodeScanner extends React.Component {
  state = {
    isLoading: false,
    item: null,
    itemNotFound: false
  };

  onBarcodeScan = async barcode => {
    Analytics.logEvent(Analytics.EVENTS.SCAN_BARCODE);
    const { onClosePress = () => null } = this.props;
    const { isLoading, itemNotFound } = this.state;
    if (isLoading || itemNotFound) return;
    try {
      this.setState({ isLoading: false });
      const res = await getBarcodeSkuItem({ barcode: barcode.data });
      console.log("result is", res);
      if (!res.result) {
        this.setState({ itemNotFound: true });
      } else {
        const item = res.result;
        this.setState({ item }, () => {
          this.selectActiveSkuMeasurementId(null, item.sku_measurement.id);
        });
      }
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  closeModal = () => {
    const { onClosePress = () => null } = this.props;
    onClosePress();
    this.setState({
      isLoading: false,
      item: null,
      itemNotFound: false
    });
  };

  selectActiveSkuMeasurementId = (_, skuMeasurementId) => {
    const item = { ...this.state.item };
    item.activeSkuMeasurementId = skuMeasurementId;
    this.setState({ item });
  };

  render() {
    const {
      visible = false,
      onSelectItem = () => null,
      measurementTypes,
      pastItems = [],
      wishList = [],
      addSkuItemToList,
      changeSkuItemQuantityInList
    } = this.props;
    const { isLoading, itemNotFound, item } = this.state;

    return (
      <Modal
        isVisible={visible}
        title="Scan Item Barcode"
        style={{
          height: 300,
          ...defaultStyles.card
        }}
        onClosePress={this.closeModal}
      >
        <View
          style={{
            flex: 1
          }}
        >
          {item ? (
            <View
              style={{
                flex: 1
              }}
            >
              <SkuItem
                style={{ elevation: 0, shadowColor: "transparent" }}
                measurementTypes={measurementTypes}
                item={item}
                wishList={wishList}
                addSkuItemToList={addSkuItemToList}
                changeSkuItemQuantityInList={changeSkuItemQuantityInList}
                selectActiveSkuMeasurementId={this.selectActiveSkuMeasurementId}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  margin: 10
                }}
              >
                <Button
                  text="Rescan"
                  style={{ width: 120, height: 40 }}
                  textStyle={{ fontSize: 12 }}
                  color="grey"
                  onPress={() => this.setState({ item: null })}
                />
                <Button
                  text="Continue"
                  style={{ width: 120, height: 40 }}
                  textStyle={{ fontSize: 12 }}
                  color="secondary"
                  onPress={() => {
                    onSelectItem(item);
                    this.closeModal();
                  }}
                />
              </View>
            </View>
          ) : (
            <RNCamera
              style={{
                flex: 1,
                alignItems: "center"
              }}
              type={RNCamera.Constants.Type.back}
              flashMode={RNCamera.Constants.FlashMode.on}
              permissionDialogTitle={"Permission to use camera"}
              permissionDialogMessage={
                "We need your permission to use your camera phone"
              }
              onBarCodeRead={this.onBarcodeScan}
            />
          )}
          {itemNotFound && (
            <View
              style={{
                backgroundColor: "#fff",
                padding: 20,
                position: "absolute",
                top: 20,
                width: "80%",
                alignItems: "center",
                alignSelf: "center",
                borderRadius: 5
              }}
            >
              <Text weight="Medium" style={{ marginBottom: 20 }}>
                Item not found
              </Text>
              <View
                style={{
                  width: "100%",
                  maxWidth: 220,
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Button
                  text="Cancel"
                  style={{ width: 100, height: 40 }}
                  textStyle={{ fontSize: 12 }}
                  color="grey"
                  onPress={this.closeModal}
                />
                <Button
                  text="Retry"
                  style={{ width: 100, height: 40 }}
                  textStyle={{ fontSize: 12 }}
                  color="secondary"
                  onPress={() => this.setState({ itemNotFound: false })}
                />
              </View>
            </View>
          )}
          <LoadingOverlay visible={isLoading} />
        </View>
      </Modal>
    );
  }
}
