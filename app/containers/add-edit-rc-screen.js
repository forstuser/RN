import React from "react";
import { StyleSheet, View, Alert, Platform, BackHandler } from "react-native";
import PropTypes from "prop-types";
import moment from "moment";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Analytics from "../analytics";

import {
  getReferenceDataForCategory,
  addRc,
  updateRc,
  deleteRc,
  fetchStates
} from "../api";
import I18n from "../i18n";
import { showSnackbar } from "../utils/snackbar";

import LoadingOverlay from "../components/loading-overlay";
import { ScreenContainer, Text, Button } from "../elements";
import RcForm from "../components/expense-forms/rc-form";
import ChangesSavedModal from "../components/changes-saved-modal";
import HeaderBackBtn from "../components/header-nav-back-btn";
import { colors } from "../theme";

class AddEditRC extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      title: params.isEditing ? "Edit RC details" : "Add RC",
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
    productId: PropTypes.number.isRequired,
    jobId: PropTypes.number.isRequired,
    rc: PropTypes.shape({
      id: PropTypes.number,
      effective_date: PropTypes.string,
      renewal_type: PropTypes.number,
      document_number: PropTypes.string,
      state: PropTypes.shape({
        id: PropTypes.number,
        state_name: PropTypes.string
      }),
      copies: PropTypes.array
    })
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoadingRenewalTypes: false,
      isLoading: false,
      renewalTypes: [],
      states: [],
      initialValues: {
        effectiveDate: null,
        renewalType: 18, // 15 years
        rcNumber: "",
        stateId: null
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
      rc
    } = this.props.navigation.state.params;

    this.loadRenewalTypes();
    this.loadStates();

    if (rc) {
      this.props.navigation.setParams({
        isEditing: true,
        onDeletePress: this.onDeletePress
      });

      this.setState({
        initialValues: {
          effectiveDate: rc.effective_date
            ? moment(rc.effective_date).format("YYYY-MM-DD")
            : null,
          rcNumber: rc.document_number || "",
          renewalType: rc.renewal_type || null,
          stateId: rc.state ? rc.state.id : null
        }
      });
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  onBackPress = () => {
    let initialValues = this.state.initialValues;
    let newData = this.rcForm.getFilledData();

    console.log("initialValues: ", initialValues, "newData: ", newData);

    if (
      newData.effectiveDate == initialValues.effectiveDate &&
      newData.rcNumber == initialValues.rcNumber &&
      newData.renewalType == initialValues.renewalType &&
      newData.stateId == initialValues.stateId
    ) {
      this.props.navigation.goBack();
    } else {
      Alert.alert(
        I18n.t("add_edit_amc_are_you_sure"),
        I18n.t("add_edit_rc_unsaved_info"),
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
    const { productId, rc } = this.props.navigation.state.params;
    Alert.alert(
      I18n.t("add_edit_puc_delete_puc"),
      I18n.t("add_edit_rc_delete_rc_desc"),
      [
        {
          text: I18n.t("add_edit_insurance_yes_delete"),
          onPress: async () => {
            try {
              this.setState({ isLoading: true });
              await deleteRc({ productId, rcId: rc.id });
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

  loadStates = async () => {
    this.setState({
      isLoading: true
    });
    try {
      const res = await fetchStates();
      this.setState({
        states: res.states
      });
    } catch (error) {
    } finally {
      this.setState({ isLoading: false });
    }
  };

  loadRenewalTypes = async () => {
    const { categoryId } = this.props.navigation.state.params;
    this.setState({
      isLoadingRenewalTypes: true
    });
    try {
      const res = await getReferenceDataForCategory(categoryId);
      this.setState({
        renewalTypes: res.renewalTypes
      });
    } catch (error) {
    } finally {
      this.setState({ isLoadingRenewalTypes: false });
    }
  };

  onSavePress = async () => {
    const { navigation } = this.props;
    const {
      mainCategoryId,
      categoryId,
      productId,
      jobId,
      rc
    } = navigation.state.params;

    let data = {
      mainCategoryId,
      categoryId,
      productId,
      jobId,
      ...this.rcForm.getFilledData()
    };

    if (
      !data.effectiveDate &&
      !data.rcNumber &&
      !data.renewalType &&
      !data.stateId
    ) {
      return showSnackbar({
        text: I18n.t("add_edit_rc_required_fields")
      });
    }
    Analytics.logEvent(Analytics.EVENTS.CLICK_SAVE, { entity: "rc" });
    try {
      this.setState({ isLoading: true });
      if (!data.id) {
        await addRc(data);
      } else {
        await updateRc(data);
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
      rc
    } = navigation.state.params;

    const {
      isLoadingRenewalTypes,
      isLoading,
      renewalTypes,
      states
    } = this.state;

    if (isLoadingRenewalTypes || isLoading) {
      return <LoadingOverlay visible={true} />;
    }

    return (
      <ScreenContainer style={styles.container}>
        <ChangesSavedModal
          ref={ref => (this.changesSavedModal = ref)}
          navigation={this.props.navigation}
        />
        <KeyboardAwareScrollView>
          <RcForm
            ref={ref => (this.rcForm = ref)}
            renewalTypes={renewalTypes}
            states={states}
            {...{
              mainCategoryId,
              categoryId,
              productId,
              jobId,
              rc,
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

export default AddEditRC;
