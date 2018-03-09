import React from "react";
import { StyleSheet, View, Alert, Platform } from "react-native";
import PropTypes from "prop-types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  getReferenceDataForCategory,
  addAmc,
  updateAmc,
  deleteAmc
} from "../api";

import LoadingOverlay from "../components/loading-overlay";
import { ScreenContainer, Text, Button } from "../elements";
import AmcForm from "../components/expense-forms/amc-form";

import ChangesSavedModal from "../components/changes-saved-modal";

class AddEditAmc extends React.Component {
  static navigatorStyle = {
    tabBarHidden: true,
    navBarTranslucent: false,
    navBarTransparent: false,
    navBarBackgroundColor: "#fff"
  };

  static propTypes = {
    navigator: PropTypes.object.isRequired,
    mainCategoryId: PropTypes.number.isRequired,
    categoryId: PropTypes.number.isRequired,
    productId: PropTypes.number.isRequired,
    jobId: PropTypes.number.isRequired,
    amc: PropTypes.shape({
      id: PropTypes.number,
      effectiveDate: PropTypes.string,
      value: PropTypes.number,
      sellers: PropTypes.object,
      copies: PropTypes.array
    })
  };

  static navigatorButtons = {
    ...Platform.select({
      ios: {
        leftButtons: [
          {
            id: "backPress",
            icon: require("../images/ic_back_ios.png")
          }
        ]
      }
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
    const { mainCategoryId, productId, jobId, amc } = this.props;
    let title = "Add AMC";
    if (amc) {
      title = "Edit AMC";
    }

    this.props.navigator.setTitle({ title });

    if (amc) {
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
      if (event.id == "backPress") {
        Alert.alert(
          "Are you sure?",
          "All the unsaved information and document copies related to this AMC would be deleted",
          [
            {
              text: "Go Back",
              onPress: () => this.props.navigator.pop()
            },
            {
              text: "Stay",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            }
          ]
        );
      } else if (event.id == "delete") {
        const { productId, amc } = this.props;
        Alert.alert(
          `Are you sure?`,
          "All the information and document copies related to this AMC will be deleted.",
          [
            {
              text: "Yes, delete",
              onPress: async () => {
                try {
                  this.setState({ isLoading: true });
                  await deleteAmc({ productId, amcId: amc.id });
                  this.props.navigator.pop();
                } catch (e) {
                  console.log("e: ", e);
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
      amc,
      navigator
    } = this.props;
    let data = {
      mainCategoryId,
      categoryId,
      productId,
      jobId,
      ...this.amcForm.getFilledData()
    };

    if (!data.effectiveDate) {
      return Alert.alert("Please select AMC effective date");
    }

    try {
      this.setState({ isLoading: true });
      if (!data.id) {
        await addAmc(data);
      } else {
        await updateAmc(data);
      }
      this.setState({ isLoading: false });
      this.changesSavedModal.show();
    } catch (e) {
      Alert.alert(e.message);
      this.setState({ isLoading: false });
    }
  };

  render() {
    const {
      mainCategoryId,
      categoryId,
      productId,
      jobId,
      amc,
      navigator
    } = this.props;

    const { isLoading } = this.state;
    return (
      <ScreenContainer style={styles.container}>
        <ChangesSavedModal
          ref={ref => (this.changesSavedModal = ref)}
          navigator={this.props.navigator}
        />
        <LoadingOverlay visible={isLoading} />
        <KeyboardAwareScrollView>
          <AmcForm
            ref={ref => (this.amcForm = ref)}
            {...{
              mainCategoryId,
              categoryId,
              productId,
              jobId,
              amc,
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

export default AddEditAmc;
