import React from "react";
import { StyleSheet, View, Alert } from "react-native";
import PropTypes from "prop-types";

import {
  getReferenceDataForCategory,
  addWarranty,
  updateWarranty
} from "../api";

import LoadingOverlay from "../components/loading-overlay";
import { ScreenContainer, Text, Button } from "../elements";
import WarrantyForm from "../components/expense-forms/warranty-form";
import { WARRANTY_TYPES } from "../constants";

class AddEditWarranty extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    mainCategoryId: PropTypes.number.isRequired,
    categoryId: PropTypes.number.isRequired,
    productId: PropTypes.number.isRequired,
    jobId: PropTypes.number.isRequired,
    warrantyType: PropTypes.oneOf(WARRANTY_TYPES),
    warranty: PropTypes.shape({
      id: PropTypes.number,
      effectiveDate: PropTypes.string,
      renewal_type: PropTypes.number,
      copies: PropTypes.array
    })
  };

  static defaultProps = {
    warrantyType: WARRANTY_TYPES.NORMAL
  };

  constructor(props) {
    super(props);
    this.state = {
      renewalTypes: [],
      warrantyProviders: [],
      isLoading: false
    };
  }

  async componentDidMount() {
    const {
      mainCategoryId,
      productId,
      jobId,
      warrantyType,
      warranty
    } = this.props;
    let title = "Add Warranty";
    if (warrantyType == WARRANTY_TYPES.NORMAL && warranty) {
      title = "Edit Warranty";
    } else if (warrantyType == WARRANTY_TYPES.DUAL && !warranty) {
      title = "Add Dual Warranty";
    } else if (warrantyType != WARRANTY_TYPES.DUAL && warranty) {
      title = "Edit Dual Warranty";
    } else if (warrantyType == WARRANTY_TYPES.EXTENDED && !warranty) {
      title = "Add Third Party Warranty";
    } else if (warrantyType == WARRANTY_TYPES.EXTENDED && warranty) {
      title = "Edit Third Party Warranty";
    }

    this.props.navigator.setTitle({ title });

    this.fetchCategoryData();
  }

  fetchCategoryData = async () => {
    try {
      this.setState({ isLoading: true });
      const res = await getReferenceDataForCategory(this.props.categoryId);
      this.setState({
        renewalTypes: res.renewalTypes,
        warrantyProviders: res.categories[0].warrantyProviders,
        isLoading: false
      });
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  onSavePress = async () => {
    const {
      mainCategoryId,
      categoryId,
      productId,
      jobId,
      warranty,
      navigator,
      warrantyType
    } = this.props;
    let data = {
      mainCategoryId,
      categoryId,
      productId,
      jobId,
      warrantyType,
      ...this.warrantyForm.getFilledData()
    };

    if (data.effectiveDate == null) {
      return Alert.alert("Please enter the Effective Date");
    }

    console.log("data: ", data);

    try {
      this.setState({ isLoading: true });
      if (!data.id) {
        await addWarranty(data);
      } else {
        await updateWarranty(data);
      }
      this.setState({ isLoading: false });
      navigator.pop();
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  render() {
    const {
      mainCategoryId,
      categoryId,
      productId,
      jobId,
      warranty,
      navigator,
      warrantyType
    } = this.props;

    const { renewalTypes, warrantyProviders, isLoading } = this.state;
    return (
      <ScreenContainer style={styles.container}>
        <LoadingOverlay visible={isLoading} />
        <View style={{ flex: 1 }}>
          <WarrantyForm
            ref={ref => (this.warrantyForm = ref)}
            {...{
              warrantyType,
              mainCategoryId,
              categoryId,
              productId,
              jobId,
              warranty,
              renewalTypes,
              warrantyProviders,
              navigator,
              isCollapsible: false
            }}
          />
        </View>
        <Button
          onPress={this.onSavePress}
          text="SAVE"
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

export default AddEditWarranty;
