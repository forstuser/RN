import React from "react";
import { StyleSheet, View, Alert, Platform, BackHandler } from "react-native";
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

import HeaderBackBtn from "../components/header-nav-back-btn";
import { colors } from "../theme";

class AddEditRepair extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      title: params.isEditing
        ? I18n.t("add_edit_repair_edit_repair")
        : I18n.t("add_edit_repair_add_repair"),
      headerRight: params.isEditing ? (
        <Text
          onPress={params.onDeletePress}
          weight="Bold"
          style={{ color: colors.danger, marginRight: 10 }}
        >
          Delete
        </Text>
      ) : null,
      headerLeft: <HeaderBackBtn onPress={params.onBackPress} />
    };
  };

  static propTypes = {
    navigation: PropTypes.object.isRequired,
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
  }

  async componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    this.props.navigation.setParams({
      onBackPress: this.onBackPress
    });

    const {
      mainCategoryId,
      productId,
      jobId,
      repair
    } = this.props.navigation.state.params;

    if (repair) {
      this.props.navigation.setParams({
        isEditing: true,
        onDeletePress: this.onDeletePress
      });
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
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  onBackPress = () => {
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
      this.props.navigation.goBack();
    } else {
      Alert.alert(
        I18n.t("add_edit_amc_are_you_sure"),
        I18n.t("add_edit_repair_unsaved_info"),
        [
          {
            text: I18n.t("add_edit_amc_go_back"),
            onPress: () => this.props.navigation.goBack()
          },
          {
            text: I18n.t("add_edit_amc_stay"),
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          }
        ]
      );
    }

    return true;
  };

  onDeletePress = () => {
    const { productId, repair } = this.props.navigation.state.params;
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
              this.props.navigation.goBack();
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
  };

  onSavePress = async () => {
    const { navigation } = this.props;

    const {
      mainCategoryId,
      categoryId,
      productId,
      jobId,
      repair
    } = navigation.state.params;

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
    const { navigation } = this.props;

    const {
      mainCategoryId,
      categoryId,
      productId,
      jobId,
      repair
    } = navigation.state.params;

    const { isLoading } = this.state;
    return (
      <ScreenContainer style={styles.container}>
        <LoadingOverlay visible={isLoading} />
        <ChangesSavedModal
          ref={ref => (this.changesSavedModal = ref)}
          navigation={this.props.navigation}
        />
        <KeyboardAwareScrollView>
          <View collapsable={false} style={{ flex: 1 }}>
            <RepairForm
              ref={ref => (this.repairForm = ref)}
              {...{
                mainCategoryId,
                categoryId,
                productId,
                jobId,
                repair,
                navigation,
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
