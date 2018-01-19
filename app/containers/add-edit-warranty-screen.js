import React from "react";
import { StyleSheet, View, Alert } from "react-native";

import {
  getReferenceDataForCategory,
  addWarranty,
  updateWarranty
} from "../api";
import LoadingOverlay from "../components/loading-overlay";
import { ScreenContainer, Text, Button } from "../elements";
import WarrantyForm from "../components/expense-forms/warranty-form";

class AddEditWarranty extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renewalTypes: [],
      isLoading: false
    };
  }

  async componentDidMount() {
    const { mainCategoryId, productId, jobId, warranty } = this.props;
    let title = "Add Warranty";
    if (warranty) {
      title = "Edit Warranty";
    }

    this.props.navigator.setTitle({ title });

    this.fetchRenewalTypes();
  }

  fetchRenewalTypes = async () => {
    try {
      this.setState({ isLoading: true });
      const res = await getReferenceDataForCategory(this.props.categoryId);
      this.setState({
        renewalTypes: res.renewalTypes,
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
      navigator
    } = this.props;
    let data = {
      mainCategoryId,
      categoryId,
      productId,
      jobId,
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
      navigator
    } = this.props;

    const { renewalTypes, isLoading } = this.state;
    return (
      <ScreenContainer style={styles.container}>
        <LoadingOverlay visible={isLoading} />
        <View style={{ flex: 1 }}>
          <WarrantyForm
            ref={ref => (this.warrantyForm = ref)}
            {...{
              mainCategoryId,
              categoryId,
              productId,
              jobId,
              warranty,
              renewalTypes,
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
