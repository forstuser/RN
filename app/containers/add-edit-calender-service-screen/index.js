import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  FlatList,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView
} from "react-native";
import I18n from "../../i18n";

import { API_BASE_URL, fetchCalenderReferenceData } from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";

import { SCREENS } from "../../constants";

import { colors } from "../../theme";

import CustomTextInput from "../../components/form-elements/text-input";
import CustomDatePicker from "../../components/form-elements/date-picker";
import SelectServiceHeader from "./select-service-header";

class AddEditCalenderServiceScreen extends Component {
  static navigatorStyle = {
    tabBarHidden: true
  };
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isFetchingServiceTypes: true,
      serviceTypes: [],
      selectedServiceType: null,
      name: "",
      providerName: "",
      wages: "",
      startingDate: null
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent = event => {
    switch (event.id) {
      case "didAppear":
        this.fetchReferenceData();
        break;
    }
  };

  componentDidMount() {
    this.props.navigator.setTitle({
      title: I18n.t("add_edit_calender_service_screen_title")
    });
  }

  fetchReferenceData = async () => {
    this.setState({
      isFetchingServiceTypes: true,
      error: null
    });
    try {
      const res = await fetchCalenderReferenceData();
      this.setState({
        serviceTypes: res.items
      });
    } catch (error) {
      this.setState({
        error
      });
    }
    this.setState({
      isFetchingServiceTypes: false
    });
  };

  openAddEditCalenderServiceScreen = () => {
    this.props.navigator.push({
      screen: SCREENS.ADD_EDIT_CALENDER_SERVICE_SCREEN
    });
  };

  renderItem = ({ item, index }) => {
    return null;
  };

  onServiceTypeSelect = serviceType => {
    this.setState({
      selectedServiceType: serviceType
    });
  };

  render() {
    const {
      error,
      isFetchingServiceTypes,
      serviceTypes,
      selectedServiceType,
      name,
      providerName,
      wages,
      startingDate
    } = this.state;
    if (error) {
      return (
        <ErrorOverlay error={error} onRetryPress={this.fetchReferenceData} />
      );
    }
    return (
      <ScreenContainer style={{ padding: 0, backgroundColor: "#f7f7f7" }}>
        <ScrollView style={{ flex: 1 }}>
          <SelectServiceHeader
            serviceTypes={serviceTypes}
            onServiceTypeSelect={this.onServiceTypeSelect}
          />
          <View style={styles.form}>
            <CustomTextInput
              placeholder={I18n.t("add_edit_calender_service_screen_form_name")}
              placeholder2="*"
              placeholder2Color={colors.mainBlue}
              value={name}
              onChangeText={name => this.setState({ name })}
            />
            <CustomTextInput
              placeholder={I18n.t(
                "add_edit_calender_service_screen_form_provider_name"
              )}
              value={providerName}
              onChangeText={providerName => this.setState({ providerName })}
            />
            <CustomTextInput
              placeholder={I18n.t(
                "add_edit_calender_service_screen_form_wages"
              )}
              value={wages}
              onChangeText={wages => this.setState({ wages })}
            />
            <CustomDatePicker
              date={startingDate}
              placeholder={I18n.t(
                "add_edit_calender_service_screen_form_starting_date"
              )}
              onDateChange={startingDate => {
                this.setState({ startingDate });
              }}
            />
          </View>
        </ScrollView>
        <Button
          text={I18n.t("my_calender_screen_add_btn")}
          color="secondary"
          borderRadius={0}
          style={styles.addItemBtn}
        />
        <LoadingOverlay visible={isFetchingServiceTypes} />
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  form: {
    padding: 16
  },
  addItemBtn: {
    width: "100%"
  }
});

export default AddEditCalenderServiceScreen;
