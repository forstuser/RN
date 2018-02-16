import React from "react";
import { StyleSheet, View, Alert } from "react-native";
import PropTypes from "prop-types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  getReferenceDataForCategory,
  addPuc,
  updatePuc,
  deletePuc
} from "../api";

import LoadingOverlay from "../components/loading-overlay";
import { ScreenContainer, Text, Button } from "../elements";
import PucForm from "../components/expense-forms/puc-form";
import ChangesSavedModal from "../components/changes-saved-modal";

class AddEditPuc extends React.Component {
  static navigatorStyle = {
    tabBarHidden: true,
    disabledBackGesture: true
  };
  static propTypes = {
    navigator: PropTypes.object.isRequired,
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

  static navigatorButtons = {
    leftButtons: [
      {
        id: "back",
        icon: require("../images/ic_back_ios.png")
      }
    ]
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  async componentDidMount() {
    const { mainCategoryId, productId, jobId, puc } = this.props;
    let title = "Add PUC";
    if (puc) {
      title = "Edit PUC";
    }

    this.props.navigator.setTitle({ title });

    if (puc) {
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
      if (event.id == "back") {
        Alert.alert(
          "Are you sure?",
          "All the unsaved information and document copies related to this PUC would be deleted",
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
        const { productId, puc } = this.props;
        Alert.alert(`Delete this puc?`, "This will be an irreversible task.", [
          {
            text: "Yes, delete",
            onPress: async () => {
              try {
                this.setState({ isLoading: true });
                await deletePuc({ productId, pucId: puc.id });
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
        ]);
      }
    }
  };

  onSavePress = async () => {
    const {
      mainCategoryId,
      categoryId,
      productId,
      jobId,
      puc,
      navigator
    } = this.props;
    let data = {
      mainCategoryId,
      categoryId,
      productId,
      jobId,
      ...this.pucForm.getFilledData()
    };

    if (!data.effectiveDate && !data.expiryPeriod) {
      return Alert.alert(`Please select 'PUC Effective Date' or 'PUC Upto'`);
    }

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
      puc,
      navigator
    } = this.props;

    const { isLoading } = this.state;
    return (
      <ScreenContainer style={styles.container}>
        <LoadingOverlay visible={isLoading} />
        <ChangesSavedModal
          ref={ref => (this.changesSavedModal = ref)}
          navigator={this.props.navigator}
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

export default AddEditPuc;
