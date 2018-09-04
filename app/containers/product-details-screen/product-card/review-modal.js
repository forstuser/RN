import React from "react";
import { StyleSheet, View, TouchableOpacity, Platform } from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";

import I18n from "../../../i18n";
import { Text } from "../../../elements";

import ProductReview from "../../../components/product-review";
import { colors } from "../../../theme";
import Analytics from "../../../analytics";

class ReviewModal extends React.Component {
  state = {
    isModalVisible: false
  };

  show = () => {
    Analytics.logEvent(Analytics.EVENTS.CLICK_ON_REVIEW);
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
    const { product, onNewReview, review } = this.props;
    if (!isModalVisible) return null;

    return (
      <View collapsable={false} >
        {isModalVisible && (
          <View collapsable={false} >
            <Modal
              isVisible={true}
              useNativeDriver={true}
              onBackButtonPress={this.hide}
              onBackdropPress={this.hide}
              avoidKeyboard={Platform.OS == "ios"}
            >
              <View collapsable={false}  style={styles.modal}>
                <TouchableOpacity style={styles.closeIcon} onPress={this.hide}>
                  <Icon name="md-close" size={30} color={colors.mainText} />
                </TouchableOpacity>
                <Text
                  weight="Bold"
                  style={{ fontSize: 12, textAlign: "center", marginBottom: 5 }}
                >
                  {I18n.t(
                    "product_details_screen_review_product"
                  ).toUpperCase()}
                </Text>
                <ProductReview
                  product={product}
                  review={review}
                  onReviewSubmit={review => {
                    this.hide();
                    onNewReview(review);
                  }}
                />
              </View>
            </Modal>
          </View>
        )}
      </View>
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
