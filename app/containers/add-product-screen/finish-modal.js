import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { Text, Button } from "../../elements";
import Modal from "react-native-modal";
import { colors } from "../../theme";
import { API_BASE_URL } from "../../api";
import { SCREENS, MAIN_CATEGORY_IDS, CATEGORY_IDS, MAIN_CATEGORIES } from "../../constants";
import I18n from "../../i18n";
import Analytics from "../../analytics";

const repairIcon = require("../../images/main-categories/ic_repair.png");
class FinishModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  show = () => {
    this.setState({ visible: true });
  };

  onMoreProductsClick = () => {
    Analytics.logEvent(Analytics.EVENTS.ADD_MORE_PRODUCT);
    this.setState({ visible: false }, () => {
      this.props.startOver();
    });
  };


  onDoItLaterClick = () => {

    if (this.props.mainCategoryId) {
      var categoryObject = {};
      categoryObject = MAIN_CATEGORIES.find((key) => { return key.id === this.props.mainCategoryId });
      categoryObject = { id: categoryObject.id, cName: categoryObject.name };
      Analytics.logEvent(Analytics.EVENTS.CLICK_I_WILL_DO_IT_LATER, {
        category_id: this.props.mainCategoryId
      });
    }
    this.setState({ visible: false }, () => {
      if (this.props.productId) {
        this.props.navigation.goBack();
        if (this.props.mainCategoryId == MAIN_CATEGORY_IDS.TRAVEL || this.props.mainCategoryId == MAIN_CATEGORY_IDS.SERVICES || this.props.mainCategoryId == MAIN_CATEGORY_IDS.HOUSEHOLD || this.props.mainCategoryId == MAIN_CATEGORY_IDS.FASHION) {
          this.props.navigation.navigate(SCREENS.TRANSACTIONS_SCREEN, { category: categoryObject, color: colors.mainBlue }
          );
        } else {
          this.props.navigation.navigate(SCREENS.PRODUCT_DETAILS_SCREEN, {
            productId: this.props.productId
          });
        }
      } else {
        this.props.navigation.goBack();
      }
    });
  };

  render() {
    const {
      mainCategoryId,
      category,
      showRepairIcon = false,
      navigation
    } = this.props;
    const { visible } = this.state;

    let title = I18n.t("add_edit_expense_screen_title_add_eHome");
    let btnText = I18n.t("add_edit_expense_screen_title_add_products");
    switch (mainCategoryId) {
      case MAIN_CATEGORY_IDS.AUTOMOBILE:
      case MAIN_CATEGORY_IDS.ELECTRONICS:
      case MAIN_CATEGORY_IDS.FURNITURE:
      case MAIN_CATEGORY_IDS.FASHION:
        break;
      case MAIN_CATEGORY_IDS.PERSONAL:
      case MAIN_CATEGORY_IDS.HEALTHCARE:
        if (category && category.id != CATEGORY_IDS.HEALTHCARE.EXPENSE) {
          title = "Document added to your eHome";
          btnText = "ADD MORE DOCUMENTS";
          break;
        }
      default:
        title = "Expense added in your eHome";
        btnText = "ADD MORE EXPENSE";
    }

    if (!mainCategoryId) {
      title = "Repair details added to the product card";
      btnText = "ADD MORE PRODUCTS";
    }
    if (!visible) return null;

    return (
      <View collapsable={false}>
        {visible && (
          <View collapsable={false}>
            <Modal
              useNativeDriver={true}
              isVisible={true}
              animationOutTiming={10}
            >
              <View collapsable={false} style={styles.finishModal}>
                <Image
                  style={styles.finishImage}
                  source={
                    mainCategoryId
                      ? {
                        uri:
                          API_BASE_URL +
                          `/categories/${mainCategoryId}/images/1`
                      }
                      : repairIcon
                  }
                  resizeMode="contain"
                />
                <Text weight="Bold" style={styles.finishMsg}>
                  {title}
                </Text>
                <Button
                  onPress={this.onMoreProductsClick}
                  style={styles.finishBtn}
                  text={btnText}
                  color="secondary"
                />
                <Text
                  onPress={this.onDoItLaterClick}
                  weight="Bold"
                  style={styles.doItLaterText}
                >
                  {I18n.t("add_edit_expense_screen_title_add_later")}
                </Text>
              </View>
            </Modal>
          </View>
        )}
      </View>
    );
  }
}

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
