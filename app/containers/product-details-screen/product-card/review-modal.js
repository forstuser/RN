import React from "react";
import { StyleSheet, View, TouchableOpacity, Platform } from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";

import I18n from "../../../i18n";
import { Text } from "../../../elements";

import ProductReview from "../../../components/product-review";
import { colors } from "../../../theme";

class ReviewModal extends React.Component {
  state = {
    isModalVisible: false
  };

  show = () => {
    this.setState({
      isModalVisible: true
    });
  };

  hide = () => {
    this.setState({
      isModalVisible: false
    });
  };

  render() {
    const { isModalVisible } = this.state;
    const { product, onNewReview } = this.props;
    return (
      <Modal
        isVisible={isModalVisible}
        useNativeDriver={true}
        onBackButtonPress={this.hide}
        onBackdropPress={this.hide}
        avoidKeyboard={Platform.OS == "ios"}
      >
        <View style={styles.modal}>
          <TouchableOpacity style={styles.closeIcon} onPress={this.hide}>
            <Icon name="md-close" size={30} color={colors.mainText} />
          </TouchableOpacity>
          <Text
            weight="Bold"
            style={{ fontSize: 12, textAlign: "center", marginBottom: 5 }}
          >
            {I18n.t("product_details_screen_review_product").toUpperCase()}
          </Text>
          <ProductReview
            product={product}
            onReviewSubmit={review => {
              this.hide();
              onNewReview(review);
            }}
          />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    paddingTop: 40,
    backgroundColor: "#fff",
    borderRadius: 5
  },
  closeIcon: {
    position: "absolute",
    right: 15,
    top: 10
  }
});

export default ReviewModal;
