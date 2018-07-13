import React from "react";
import { StyleSheet, View, Alert, Platform } from "react-native";
import PropTypes from "prop-types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { getReferenceDataForCategory, updateProduct } from "../api";
import Analytics from "../analytics";
import I18n from "../i18n";
import { showSnackbar } from "../utils/snackbar";

import LoadingOverlay from "../components/loading-overlay";
import { MAIN_CATEGORY_IDS, CATEGORY_IDS, METADATA_KEYS } from "../constants";
import { ScreenContainer, Text, Button } from "../elements";
import ProductBasicDetailsForm from "../components/expense-forms/product-basic-details-form";
import ExpenseBasicDetailsForm from "../components/expense-forms/expense-basic-details-form";
import ChangesSavedModal from "../components/changes-saved-modal";

class EditProductBasicDetails extends React.Component {
  static navigationOptions = {
    title: "Edit Details"
  };

  constructor(props) {
    super(props);
    this.state = {
      brands: [],
      categoryForms: [],
      subCategories: [],
      isLoading: false
    };
    // this.props.navigation.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent = event => {
    switch (event.id) {
      case "backPress":
        Alert.alert(
          I18n.t("add_edit_amc_are_you_sure"),
          I18n.t("add_edit_product_basic_unsaved_info"),
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

        break;
    }
  };

  async componentDidMount() {
    const { product } = this.props.navigation.state.params;
    this.fetchCategoryData(product);
  }

  fetchCategoryData = async product => {
    try {
      this.setState({ isLoading: true });
      const res = await getReferenceDataForCategory(product.categoryId);
      this.setState({
        brands: res.categories[0].brands,
        categoryForms: res.categories[0].categoryForms,
        subCategories: res.categories[0].subCategories,
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
    const { product } = navigation.state.params;

    let data = {
      mainCategoryId: product.masterCategoryId,
      categoryId: product.categoryId,
      productId: product.id,
      ...this.basicDetailsForm.getFilledData()
    };

    console.log("data: ", data);

    if (
      [
        MAIN_CATEGORY_IDS.AUTOMOBILE,
        MAIN_CATEGORY_IDS.ELECTRONICS,
        MAIN_CATEGORY_IDS.FASHION
      ].indexOf(data.mainCategoryId) > -1
    ) {
      if (data.brandId === undefined && !data.brandName) {
        return showSnackbar({
          text: I18n.t("add_edit_product_basic_select_brand")
        });
      }
    } else if (MAIN_CATEGORY_IDS.FURNITURE == data.mainCategoryId) {
      if (
        CATEGORY_IDS.FURNITURE.FURNITURE == data.categoryId &&
        !data.subCategoryId
      ) {
        return showSnackbar({
          text: I18n.t("add_edit_product_basic_select_type")
        });
      } else if (
        CATEGORY_IDS.FURNITURE.FURNITURE != data.categoryId &&
        data.brandId === undefined &&
        !data.brandName
      ) {
        return showSnackbar({
          text: I18n.t("add_edit_product_basic_select_brand")
        });
      }
    } else if (!data.value) {
      return showSnackbar({
        text: I18n.t("add_edit_product_basic_select_amount")
      });
    }

    if (!data.purchaseDate) {
      return showSnackbar({
        text: I18n.t("add_edit_product_basic_select_date")
      });
    }
    // if ((!data.sellerContact && !data.sellerName && data.sellerAddress) || (!data.sellerName && data.sellerAddress)) {
    //   return showSnackbar({
    //     text: "Please enter seller name/contact no."
    //   });
    // }
    if (data.sellerAddress) {
      if (!data.sellerContact && !data.sellerName) {
        return showSnackbar({
          text: "Please enter seller name/contact no."
        });
      }
    }
    if (
      [
        MAIN_CATEGORY_IDS.AUTOMOBILE,
        MAIN_CATEGORY_IDS.ELECTRONICS,
        MAIN_CATEGORY_IDS.FURNITURE,
        MAIN_CATEGORY_IDS.FASHION
      ].indexOf(data.mainCategoryId) == -1
    ) {
      if (!data.value) {
        return showSnackbar({
          text: I18n.t("add_edit_product_basic_select_amount")
        });
      }
    }

    Analytics.logEvent(Analytics.EVENTS.CLICK_SAVE, { entity: "repair" });
    try {
      this.setState({ isLoading: true });
      await updateProduct(data);
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
    const { product } = navigation.state.params;

    const { brands, categoryForms, subCategories, isLoading } = this.state;

    const {
      id,
      productName,
      purchaseDate,
      value,
      copies,
      sub_category_id
    } = product;
    const brandId = product.brandId;
    const modelName = product.model;

    let sellerName,
      sellerContact = "",
      sellerAddress = "";
    if (product.sellers) {
      sellerName = product.sellers.sellerName;
      sellerContact = product.sellers.contact;
      sellerAddress = product.sellers.address;
    } else if (product.onlineSellers) {
      sellerName = product.onlineSellers.sellerName;
      sellerContact = product.onlineSellers.contact;
    }

    let chasisNumber = (chasisNumberId = registrationNo = registrationNoId = imeiNo = imeiNoId = serialNo = serialNoId = nextDueDate = nextDueDateId = null);

    const productMetaDatas = product.metaData || [];

    const imeiMeta = productMetaDatas.find(
      meta => meta.name == METADATA_KEYS.IMEI_NUMBER
    );
    if (imeiMeta) {
      imeiNo = imeiMeta.value;
      imeiNoId = imeiMeta.id;
    }

    const serialNoMeta = productMetaDatas.find(
      meta => meta.name == METADATA_KEYS.SERIAL_NUMBER
    );
    if (serialNoMeta) {
      serialNo = serialNoMeta.value;
      serialNoId = serialNoMeta.id;
    }

    const registrationNoMeta = productMetaDatas.find(
      meta => meta.name == METADATA_KEYS.REGISTRATION_NUMBER
    );
    if (registrationNoMeta) {
      registrationNo = registrationNoMeta.value;
      registrationNoId = registrationNoMeta.id;
    }

    const chasisNumberMeta = productMetaDatas.find(
      meta => meta.name.toLowerCase() == METADATA_KEYS.CHASIS_NUMBER
    );
    if (chasisNumberMeta) {
      chasisNumber = chasisNumberMeta.value;
      chasisNumberId = chasisNumberMeta.id;
    }

    const dueDateMeta = productMetaDatas.find(
      meta => meta.name == METADATA_KEYS.DUE_DATE
    );
    if (dueDateMeta) {
      nextDueDate = dueDateMeta.value;
      nextDueDateId = dueDateMeta.id;
    }

    let showExpenseForm = true;
    if (
      [
        MAIN_CATEGORY_IDS.AUTOMOBILE,
        MAIN_CATEGORY_IDS.ELECTRONICS,
        MAIN_CATEGORY_IDS.FURNITURE,
        MAIN_CATEGORY_IDS.FASHION
      ].indexOf(product.masterCategoryId) > -1
    ) {
      showExpenseForm = false;
    }

    return (
      <ScreenContainer style={styles.container}>
        <LoadingOverlay visible={isLoading} />
        <ChangesSavedModal
          ref={ref => (this.changesSavedModal = ref)}
          navigation={this.props.navigation}
        />
        <KeyboardAwareScrollView>
          <View collapsable={false} style={{ flex: 1 }}>
            {showExpenseForm ? (
              <ExpenseBasicDetailsForm
                showFullForm={true}
                ref={ref => (this.basicDetailsForm = ref)}
                mainCategoryId={product.masterCategoryId}
                categoryId={product.categoryId}
                category={{
                  id: product.categoryId,
                  name: product.categoryName
                }}
                jobId={product.jobId}
                subCategories={subCategories}
                navigation={navigation}
                {...{
                  productId: id,
                  expenseName: productName,
                  date: purchaseDate,
                  subCategoryId: sub_category_id,
                  value,
                  copies,
                  sellerName,
                  sellerContact,
                  sellerAddress,
                  nextDueDate,
                  nextDueDateId
                }}
              />
            ) : (
              <ProductBasicDetailsForm
                showFullForm={true}
                ref={ref => (this.basicDetailsForm = ref)}
                mainCategoryId={product.masterCategoryId}
                categoryId={product.categoryId}
                subCategories={subCategories}
                subCategoryId={sub_category_id}
                category={{
                  id: product.categoryId,
                  name: product.categoryName
                }}
                id={product.id}
                jobId={product.jobId}
                brands={brands}
                categoryForms={categoryForms}
                navigation={navigation}
                {...{
                  id,
                  productName,
                  purchaseDate,
                  brandId,
                  value,
                  copies,
                  modelName,
                  sellerName,
                  sellerContact,
                  sellerAddress,
                  chasisNumber,
                  chasisNumberId,
                  registrationNo,
                  registrationNoId,
                  imeiNo,
                  imeiNoId,
                  serialNo,
                  serialNoId
                }}
              />
            )}
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

export default EditProductBasicDetails;
