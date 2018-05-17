import React from "react";
import { StyleSheet, View, Alert, Platform } from "react-native";
import PropTypes from "prop-types";
import moment from "moment";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import I18n from "../i18n";
import {
  getReferenceDataForCategory,
  addRepair,
  updateRepair,
  deleteRepair
} from "../api";
import { showSnackbar } from "../utils/snackbar";

import LoadingOverlay from "../components/loading-overlay";
import { ScreenContainer, Text, Button } from "../elements";
import RepairForm from "../components/expense-forms/repair-form";
import ChangesSavedModal from "../components/changes-saved-modal";
import Analytics from "../analytics";
class AddEditRepair extends React.Component {
  static navigatorStyle = {
    tabBarHidden: true,
    disabledBackGesture: true
  };
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    mainCategoryId: PropTypes.number.isRequired,
    categoryId: PropTypes.number.isRequired,
    productId: PropTypes.number.isRequired,
    jobId: PropTypes.number.isRequired,
    repair: PropTypes.shape({
      id: PropTypes.number,
      purchaseDate: PropTypes.string,
      value: PropTypes.number,
      repair_for: PropTypes.string,
      warranty_upto: PropTypes.string,
      sellers: PropTypes.object,
      copies: PropTypes.array
    })
  };

  static navigatorButtons = {
    ...Platform.select({
      ios: {
        leftButtons: [
          {
            id: "backPress",
            icon: require("../images/ic_back_ios.png")
          }
        ]
      }
    })
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      initialValues: {
        purchaseDate: null,
        value: "",
        repairFor: "",
        warrantyUpto: "",
        sellerName: "",
        sellerContact: ""
      }
    };
    // this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  async componentDidMount() {
    const { mainCategoryId, productId, jobId, repair } = this.props;
    let title = I18n.t("add_edit_repair_add_repair");
    if (repair) {
      title = I18n.t("add_edit_repair_edit_repair");
    }

    this.props.navigator.setTitle({ title });

    if (repair) {
      this.setState({
        initialValues: {
          purchaseDate: repair.purchaseDate
            ? moment(repair.purchaseDate).format("YYYY-MM-DD")
            : null,
          value: repair.value,
          repairFor: repair.repair_for,
          warrantyUpto: repair.warranty_upto,
          sellerName:
            repair.sellers && repair.sellers.sellerName
              ? repair.sellers.sellerName
              : "",
          sellerContact:
            repair.sellers && repair.sellers.contact
              ? repair.sellers.contact
              : ""
        }
      });
      this.props.navigator.setButtons({
        rightButtons: [
          {
            title: I18n.t("add_edit_insurance_delete"),
            id: "delete",
            buttonColor: "red",
            buttonFontSize: 16,
            buttonFontWeight: "600"
          }
        ],
        animated: true
      });
    }
  }

  onNavigatorEvent = event => {
    if (event.type == "NavBarButtonPress") {
      if (event.id == "backPress") {
        let initialValues = this.state.initialValues;
        let newData = this.repairForm.getFilledData();

        console.log("initialValues: ", initialValues, "newData: ", newData);

        if (
          newData.repairDate == initialValues.purchaseDate &&
          newData.value == initialValues.value &&
          newData.repairFor == initialValues.repairFor &&
          newData.warrantyUpto == initialValues.warrantyUpto &&
          newData.sellerName == initialValues.sellerName &&
          newData.sellerContact == initialValues.sellerContact
        ) {
          return this.props.navigator.pop();
        }
        Alert.alert(
          I18n.t("add_edit_amc_are_you_sure"),
          I18n.t("add_edit_repair_unsaved_info"),
          [
            {
              text: I18n.t("add_edit_amc_go_back"),
              onPress: () => this.props.navigator.pop()
            },
            {
              text: I18n.t("add_edit_amc_stay"),
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            }
          ]
        );
      } else if (event.id == "delete") {
        const { productId, repair } = this.props;
        Alert.alert(
          I18n.t("add_edit_repair_delete_repair"),
          I18n.t("add_edit_repair_delete_repair_desc"),
          [
            {
              text: I18n.t("add_edit_insurance_yes_delete"),
              onPress: async () => {
                try {
                  this.setState({ isLoading: true });
                  await deleteRepair({ productId, repairId: repair.id });
                  this.props.navigator.pop();
                } catch (e) {
                  showSnackbar({
                    text: I18n.t("add_edit_amc_could_not_delete")
                  });
                  this.setState({ isLoading: false });
                }
              }
            },
            {
              text: I18n.t("add_edit_no_dnt_delete"),
              onPress: () => {},
              style: "cancel"
            }
          ]
        );
      }
    }
  };

  onSavePress = async () => {
    const {
      mainCategoryId,
      categoryId,
      productId,
      jobId,
      repair,
      navigator
    } = this.props;
    let data = {
      mainCategoryId,
      categoryId,
      productId,
      jobId,
      ...this.repairForm.getFilledData()
    };

    if (!data.repairDate) {
      return showSnackbar({
        text: I18n.t("add_edit_repair_date")
      });
    }
    Analytics.logEvent(Analytics.EVENTS.CLICK_SAVE, { entity: "repair" });
    try {
      this.setState({ isLoading: true });
      if (!data.id) {
        await addRepair(data);
      } else {
        await updateRepair(data);
      }
      this.setState({ isLoading: false });
      this.changesSavedModal.show();
    } catch (e) {
      showSnackbar({
        text: e.message
      });
      this.setState({ isLoading: false });
    }
  };

  render() {
    const {
      mainCategoryId,
      categoryId,
      productId,
      jobId,
      repair,
      navigator
    } = this.props;

    const { isLoading } = this.state;
    return (
      <ScreenContainer style={styles.container}>
        <LoadingOverlay visible={isLoading} />
        <ChangesSavedModal
          ref={ref => (this.changesSavedModal = ref)}
          navigator={this.props.navigator}
        />
        <KeyboardAwareScrollView>
          <View collapsable={false}  style={{ flex: 1 }}>
            <RepairForm
              ref={ref => (this.repairForm = ref)}
              {...{
                mainCategoryId,
                categoryId,
                productId,
                jobId,
                repair,
                navigator,
                isCollapsible: false
              }}
            />
          </View>
        </KeyboardAwareScrollView>
        <Button
          onPress={this.onSavePress}
          text={I18n.t("add_edit_amc_save")}
          color="secondary"
          borderRadius={0}
        />
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: "#FAFAFA"
  }
});

export default AddEditRepair;
