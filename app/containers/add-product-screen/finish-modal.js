import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { Text, Button } from "../../elements";
import Modal from "react-native-modal";
import { colors } from "../../theme";
import { API_BASE_URL } from "../../api";
import { SCREENS, MAIN_CATEGORY_IDS, CATEGORY_IDS } from "../../constants";
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
    this.setState({ visible: true })
  }

  onMoreProductsClick = () => {
    Analytics.logEvent(Analytics.EVENTS.ADD_ANOTHER_PRODUCT);
    this.setState({ visible: false }, () => {
      this.props.goToStep(0);
    });
  };

  onDoItLaterClick = () => {
    Analytics.logEvent(Analytics.EVENTS.CLICK_I_WILL_DO_IT_LATER);
    this.setState({ visible: false }, () => {
      if (this.props.productId) {
        this.props.goToStep(0);

        this.props.navigator.push({
          screen: SCREENS.PRODUCT_DETAILS_SCREEN,
          passProps: {
            productId: this.props.productId
          }
        });
      } else {
        this.props.navigator.pop();
      }
    });
  };

  render() {
    const {
      mainCategoryId,
      category,
      showRepairIcon = false,
      navigator
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
          title = 'Document added to your eHome';
          btnText = 'ADD MORE DOCUMENTS';
          break;
        }
      default:
        title = 'Expense added to your eHome';
        btnText = 'ADD MORE EXPENSE'
    }

    if (!mainCategoryId) {
      title = 'Repair added to the product';
    }

    return (
      <Modal useNativeDriver={true} isVisible={visible} animationOutTiming={10}>
        <View style={styles.finishModal}>
          <Image
            style={styles.finishImage}
            source={
              mainCategoryId
                ? {
                  uri: API_BASE_URL + `/categories/${mainCategoryId}/images/1`
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
