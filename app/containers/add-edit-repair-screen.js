import React from "react";
import { StyleSheet, View, Alert } from "react-native";
import PropTypes from "prop-types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { getReferenceDataForCategory, addRepair, updateRepair } from "../api";

import LoadingOverlay from "../components/loading-overlay";
import { ScreenContainer, Text, Button } from "../elements";
import RepairForm from "../components/expense-forms/repair-form";

class AddEditRepair extends React.Component {
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

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
  }

  async componentDidMount() {
    const { mainCategoryId, productId, jobId, repair } = this.props;
    let title = "Add Repair";
    if (repair) {
      title = "Edit Repair";
    }

    this.props.navigator.setTitle({ title });
  }

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

    try {
      this.setState({ isLoading: true });
      if (!data.id) {
        await addRepair(data);
      } else {
        await updateRepair(data);
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
      repair,
      navigator
    } = this.props;

    const { isLoading } = this.state;
    return (
      <ScreenContainer style={styles.container}>
        <LoadingOverlay visible={isLoading} />
        <KeyboardAwareScrollView>
          <View style={{ flex: 1 }}>
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

export default AddEditRepair;
