import React from "react";
import { StyleSheet, View, Alert } from "react-native";
import PropTypes from "prop-types";

import { getReferenceDataForCategory, addPuc, updatePuc } from "../api";

import LoadingOverlay from "../components/loading-overlay";
import { ScreenContainer, Text, Button } from "../elements";
import PucForm from "../components/expense-forms/puc-form";

class AddEditPuc extends React.Component {
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

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
  }

  async componentDidMount() {
    const { mainCategoryId, productId, jobId, puc } = this.props;
    let title = "Add PUC";
    if (puc) {
      title = "Edit PUC";
    }

    this.props.navigator.setTitle({ title });
  }

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

    try {
      this.setState({ isLoading: true });
      if (!data.id) {
        await addPuc(data);
      } else {
        await updatePuc(data);
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
      puc,
      navigator
    } = this.props;

    const { isLoading } = this.state;
    return (
      <ScreenContainer style={styles.container}>
        <LoadingOverlay visible={isLoading} />
        <View style={{ flex: 1 }}>
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

export default AddEditPuc;
