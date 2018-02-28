import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { Text, Button } from "../../elements";
import Modal from "react-native-modal";
import { colors } from "../../theme";
import { API_BASE_URL } from "../../api";
import { SCREENS } from "../../constants";
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

  componentDidMount() {
    this.updateStateFromProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateStateFromProps(nextProps);
  }

  updateStateFromProps = props => {
    this.setState({ visible: props.visible });
  };

  onMoreProductsClick = () => {
    Analytics.logEvent(Analytics.EVENTS.ADD_ANOTHER_PRODUCT);
    this.setState({ visible: false }, () => {
      this.props.navigator.pop();
    });
  };

  onDoItLaterClick = () => {
    this.setState({ visible: false }, () => {
      if (this.props.productId) {
        this.props.navigator.pop({ animationType: "fade" });

        this.props.navigator.push({
          screen: SCREENS.PRODUCT_DETAILS_SCREEN,
          passProps: {
            productId: this.props.productId
          }
        });
      } else {
        this.props.navigator.dismissAllModals();
      }
    });
  };

  render() {
    const {
      mainCategoryId,
      showRepairIcon = false,
      title = I18n.t("add_edit_expense_screen_title_add_eHome"),
      navigator
    } = this.props;
    const { visible } = this.state;
    return (
      <Modal useNativeDriver={true} isVisible={visible}>
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
            text={I18n.t("add_edit_expense_screen_title_add_products")}
            color="secondary"
          />
          <Text
            onPress={this.onDoItLaterClick}
            weight="Bold"
            style={styles.doItLaterText}
          >
            I18n.t("add_edit_expense_screen_title_add_later")
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
