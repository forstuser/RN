import React from "react";
import { StyleSheet, View, Alert } from "react-native";
import PropTypes from "prop-types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  getReferenceDataForCategory,
  addRepair,
  updateRepair,
  deleteRepair
} from "../api";

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
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  async componentDidMount() {
    const { mainCategoryId, productId, jobId, repair } = this.props;
    let title = "Add Repair";
    if (repair) {
      title = "Edit Repair";
    }

    this.props.navigator.setTitle({ title });

    if (repair) {
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
        const { productId, repair } = this.props;
        Alert.alert(
          `Delete this repair?`,
          "This will be an irreversible task.",
          [
            {
              text: "Yes, delete",
              onPress: async () => {
                try {
                  this.setState({ isLoading: true });
                  await deleteRepair({ productId, repairId: repair.id });
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
      return Alert.alert("Please select repair date");
    }

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
