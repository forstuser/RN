import React from "react";
import { StyleSheet, View, Alert, Platform, BackHandler } from "react-native";
import PropTypes from "prop-types";
import moment from "moment";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Analytics from "../analytics";

import {
  getReferenceDataForCategory,
  addPuc,
  updatePuc,
  deletePuc
} from "../api";
import I18n from "../i18n";
import { showSnackbar } from "../utils/snackbar";

import LoadingOverlay from "../components/loading-overlay";
import { ScreenContainer, Text, Button } from "../elements";
import PucForm from "../components/expense-forms/puc-form";
import ChangesSavedModal from "../components/changes-saved-modal";
import HeaderBackBtn from "../components/header-nav-back-btn";
import { colors } from "../theme";

class AddEditPuc extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      title: params.isEditing
        ? I18n.t("add_edit_puc_edit_puc")
        : I18n.t("add_edit_puc_add_puc"),
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
    puc: PropTypes.shape({
      id: PropTypes.number,
      effectiveDate: PropTypes.string,
      value: PropTypes.number,
      renewal_type: PropTypes.number,
      sellers: PropTypes.object,
      copies: PropTypes.array
    })
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      initialValues: {
        effectiveDate: null,
        value: "",
        renewalType: null,
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
      puc
    } = this.props.navigation.state.params;

    if (puc) {
      this.props.navigation.setParams({
        isEditing: true,
        onDeletePress: this.onDeletePress
      });
      this.setState({
        initialValues: {
          effectiveDate: puc.effectiveDate
            ? moment(puc.effectiveDate).format("YYYY-MM-DD")
            : null,
          value: puc.value,
          renewalType: puc.renewal_type,
          sellerName:
            puc.sellers && puc.sellers.sellerName ? puc.sellers.sellerName : "",
          sellerContact:
            puc.sellers && puc.sellers.contact ? puc.sellers.contact : ""
        }
      });
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  onBackPress = () => {
    let initialValues = this.state.initialValues;
    let newData = this.pucForm.getFilledData();

    console.log("initialValues: ", initialValues, "newData: ", newData);

    if (
      newData.effectiveDate == initialValues.effectiveDate &&
      newData.value == initialValues.value &&
      newData.expiryPeriod == initialValues.renewalType &&
      newData.sellerName == initialValues.sellerName &&
      newData.sellerContact == initialValues.sellerContact
    ) {
      this.props.navigation.goBack();
    } else {
      Alert.alert(
        I18n.t("add_edit_amc_are_you_sure"),
        I18n.t("add_edit_puc_unsaved_info"),
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
    const { productId, puc } = this.props.navigation.state.params;
    Alert.alert(
      I18n.t("add_edit_puc_delete_puc"),
      I18n.t("add_edit_puc_delete_puc_desc"),
      [
        {
          text: I18n.t("add_edit_insurance_yes_delete"),
          onPress: async () => {
            try {
              this.setState({ isLoading: true });
              await deletePuc({ productId, pucId: puc.id });
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
      puc
    } = navigation.state.params;

    let data = {
      mainCategoryId,
      categoryId,
      productId,
      jobId,
      ...this.pucForm.getFilledData()
    };

    if (!data.effectiveDate && !data.expiryPeriod) {
      return showSnackbar({
        text: I18n.t("add_edit_puc_select_puc")
      });
    }
    Analytics.logEvent(Analytics.EVENTS.CLICK_SAVE, { entity: "puc" });
    try {
      this.setState({ isLoading: true });
      if (!data.id) {
        await addPuc(data);
      } else {
        await updatePuc(data);
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
      puc
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
          <PucForm
            ref={ref => (this.pucForm = ref)}
            {...{
              mainCategoryId,
              categoryId,
              productId,
              jobId,
              puc,
              navigation,
              isCollapsible: false
            }}
          />
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

export default AddEditPuc;
