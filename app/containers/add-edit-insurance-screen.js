import React from "react";
import { StyleSheet, View, Alert } from "react-native";
import PropTypes from "prop-types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  getReferenceDataForCategory,
  addInsurance,
  updateInsurance,
  deleteInsurance
} from "../api";

import LoadingOverlay from "../components/loading-overlay";
import { ScreenContainer, Text, Button } from "../elements";
import InsuranceForm from "../components/expense-forms/insurance-form";

class AddEditInsurance extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    mainCategoryId: PropTypes.number.isRequired,
    categoryId: PropTypes.number.isRequired,
    productId: PropTypes.number.isRequired,
    jobId: PropTypes.number.isRequired,
    insurance: PropTypes.shape({
      insurance: PropTypes.shape({
        id: PropTypes.number,
        effectiveDate: PropTypes.string,
        provider: PropTypes.object,
        providerName: PropTypes.string,
        policyNo: PropTypes.string,
        value: PropTypes.number,
        amountInsured: PropTypes.number,
        copies: PropTypes.array
      })
    })
  };

  constructor(props) {
    super(props);
    this.state = {
      insuranceProviders: [],
      isLoading: false
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  async componentDidMount() {
    const { mainCategoryId, productId, jobId, insurance } = this.props;
    let title = "Add Insurance";
    if (insurance) {
      title = "Edit Insurance";
    }

    this.props.navigator.setTitle({ title });

    this.fetchCategoryData();

    if (insurance) {
      this.props.navigator.setButtons({
        rightButtons: [
          {
            title: "Delete",
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
      if (event.id == "delete") {
        const { productId, insurance } = this.props;
        Alert.alert(
          `Delete this insurance?`,
          "This will be an irreversible task.",
          [
            {
              text: "Yes, delete",
              onPress: async () => {
                try {
                  this.setState({ isLoading: true });
                  await deleteInsurance({
                    productId,
                    insuranceId: insurance.id
                  });
                  this.props.navigator.pop();
                } catch (e) {
                  Alert.alert(`Couldn't delete`);
                  this.setState({ isLoading: false });
                }
              }
            },
            {
              text: "No, don't Delete",
              onPress: () => {},
              style: "cancel"
            }
          ]
        );
      }
    }
  };

  fetchCategoryData = async () => {
    try {
      this.setState({ isLoading: true });
      const res = await getReferenceDataForCategory(this.props.categoryId);
      this.setState({
        insuranceProviders: res.categories[0].insuranceProviders,
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
      insurance,
      navigator
    } = this.props;
    let data = {
      mainCategoryId,
      categoryId,
      productId,
      jobId,
      ...this.insuranceForm.getFilledData()
    };

    if (!data.providerId && !data.providerName) {
      return Alert.alert("Please select or enter provider name");
    }

    console.log("data: ", data);

    try {
      this.setState({ isLoading: true });
      if (!data.id) {
        await addInsurance(data);
      } else {
        await updateInsurance(data);
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
      insurance,
      navigator
    } = this.props;

    const { insuranceProviders, isLoading } = this.state;
    return (
      <ScreenContainer style={styles.container}>
        <LoadingOverlay visible={isLoading} />
        <KeyboardAwareScrollView>
          <InsuranceForm
            ref={ref => (this.insuranceForm = ref)}
            {...{
              mainCategoryId,
              categoryId,
              productId,
              jobId,
              insurance,
              insuranceProviders,
              navigator,
              isCollapsible: false
            }}
          />
        </KeyboardAwareScrollView>
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

export default AddEditInsurance;
