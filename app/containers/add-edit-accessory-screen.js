import React from "react";
import { StyleSheet, View, Alert, Platform, BackHandler } from "react-native";
import PropTypes from "prop-types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import moment from "moment";
import Analytics from "../analytics";
import I18n from "../i18n";
import { showSnackbar } from "../utils/snackbar";

import {
  getAccessoriesReferenceDataForCategory,
  getReferenceDataForCategory,
  addAccessory,
  updateAccessory,
  deleteProduct
} from "../api";

import LoadingOverlay from "../components/loading-overlay";
import { ScreenContainer, Text, Button } from "../elements";
import AccessoryForm from "../components/expense-forms/accessory-form";
import ChangesSavedModal from "../components/changes-saved-modal";
import HeaderBackBtn from "../components/header-nav-back-btn";
import { colors } from "../theme";

class AddEditAccessory extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      title: params.isEditing
        ? "Edit Part or Accessory"
        : "Add Part or Accessory",
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
    accessory: PropTypes.shape({
      id: PropTypes.number,
      purchaseDate: PropTypes.string,
      accessory_part_id: PropTypes.number,
      value: PropTypes.number,
      warrantyDetails: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          renewal_type: PropTypes.number
        })
      ),
      copies: PropTypes.array
    })
  };

  constructor(props) {
    super(props);
    this.state = {
      accessoryCategories: [],
      renewalTypes: [],
      isLoading: false,
      isLoadingRenewalTypes: false,
      initialValues: {
        purchaseDate: null,
        value: 0,
        accessoryPartId: null,
        warrantyId: null,
        warrantyRenewalType: null
      }
    };
  }

  async componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    const {
      mainCategoryId,
      productId,
      jobId,
      accessory
    } = this.props.navigation.state.params;

    this.loadRenewalTypes();
    this.fetchCategoryData();

    this.props.navigation.setParams({
      onBackPress: this.onBackPress
    });

    if (accessory) {
      this.props.navigation.setParams({
        isEditing: true,
        onDeletePress: this.onDeletePress
      });

      this.setState({
        initialValues: {
          purchaseDate: accessory.purchaseDate
            ? moment(accessory.purchaseDate).format("YYYY-MM-DD")
            : null,
          value: accessory.value,
          accessoryPartId: accessory.accessory_part_id,
          warrantyId:
            accessory.warrantyDetails && accessory.warrantyDetails[0]
              ? accessory.warrantyDetails[0].id
              : null,
          warrantyRenewalType:
            accessory.warrantyDetails && accessory.warrantyDetails[0]
              ? accessory.warrantyDetails[0].renewal_type
              : null
        }
      });
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  onBackPress = () => {
    if (!this.accessoryForm) {
      this.props.navigation.goBack();
    }

    let initialValues = this.state.initialValues;
    let newData = this.accessoryForm.getFilledData();
    console.log("initialValues: ", initialValues, "newData: ", newData);
    if (
      newData.purchaseDate == initialValues.purchaseDate &&
      newData.accessoryPartId == initialValues.accessoryPartId &&
      newData.value == initialValues.value &&
      newData.warrantyId == initialValues.warrantyId &&
      newData.warrantyRenewalType == initialValues.warrantyRenewalType
    ) {
      this.props.navigation.goBack();
    } else {
      Alert.alert(
        I18n.t("add_edit_amc_are_you_sure"),
        I18n.t("add_edit_accessory_unsaved_info"),
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
    const { productId, accessory } = this.props.navigation.state.params;
    Alert.alert(
      I18n.t("are_you_sure"),
      I18n.t("add_edit_accessory_delete_accessory_desc"),
      [
        {
          text: I18n.t("yes_delete"),
          onPress: async () => {
            try {
              this.setState({ isLoading: true });
              await deleteProduct(accessory.id);
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

  fetchCategoryData = async () => {
    try {
      this.setState({ isLoading: true });
      const res = await getAccessoriesReferenceDataForCategory(
        this.props.navigation.state.params.categoryId
      );
      this.setState({
        accessoryCategories: res.accessory_parts,
        isLoading: false
      });
    } catch (e) {
      showSnackbar({
        text: e.message
      });
    }
  };

  onSavePress = async () => {
    const { navigation } = this.props;
    const {
      mainCategoryId,
      categoryId,
      productId,
      jobId,
      accessory
    } = navigation.state.params;
    let data = {
      mainCategoryId,
      categoryId,
      productId,
      jobId,
      ...this.accessoryForm.getFilledData()
    };

    if (
      (!data.accessoryPartId && !data.accessoryPartName) ||
      !data.purchaseDate
    ) {
      return showSnackbar({
        text: "Please select category and purchase date"
      });
    }

    console.log("data: ", data);
    Analytics.logEvent(Analytics.EVENTS.CLICK_SAVE, { entity: "accessory" });

    try {
      this.setState({ isLoading: true });
      if (!data.id) {
        await addAccessory(data);
      } else {
        await updateAccessory(data);
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
      accessory
    } = navigation.state.params;

    const {
      accessoryCategories,
      renewalTypes,
      isLoading,
      isLoadingRenewalTypes
    } = this.state;

    if (isLoading || isLoadingRenewalTypes) {
      return <LoadingOverlay visible={isLoading || isLoadingRenewalTypes} />;
    }

    return (
      <ScreenContainer style={styles.container}>
        <ChangesSavedModal
          ref={ref => (this.changesSavedModal = ref)}
          navigation={this.props.navigation}
        />
        <KeyboardAwareScrollView>
          <AccessoryForm
            ref={ref => (this.accessoryForm = ref)}
            {...{
              mainCategoryId,
              categoryId,
              productId,
              jobId,
              accessory,
              accessoryCategories,
              renewalTypes,
              navigation
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

export default AddEditAccessory;
