import React from "react";
import { StyleSheet, View, Image, Alert, TouchableOpacity } from "react-native";

import moment from "moment";

import { MAIN_CATEGORY_IDS } from "../../constants";
import { getReferenceDataBrands, getReferenceDataModels } from "../../api";

import { Text } from "../../elements";
import SelectModal from "../../components/select-modal";
import { colors } from "../../theme";

import ContactFields from "../form-elements/contact-fields";
import CustomTextInput from "../form-elements/text-input";
import CustomDatePicker from "../form-elements/date-picker";
import HeaderWithUploadOption from "../form-elements/header-with-upload-option";

class HealthcareInsuranceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDocUploaded: false,
      reportTitle: "",
      types: [
        {
          id: 706,
          name: "Prescriptions"
        },
        {
          id: 707,
          name: "Test Reports"
        }
      ],
      date: null,
      selectedType: null,
      doctorName: "",
      doctorContact: ""
    };
  }

  componentDidMount() {}

  getFilledData = () => {
    const {
      isDocUploaded,
      reportTitle,
      selectedType,
      date,
      doctorName
    } = this.state;

    let data = {
      isDocUploaded,
      productName: reportTitle,
      subCategoryId: selectedType ? selectedType.id : null,
      purchaseDate: date,
      sellerName: doctorName,
      sellerContact: this.doctorContactRef.getFilledData()
    };

    return data;
  };

  onTypeSelect = type => {
    if (this.state.selectedType && this.state.selectedTyper.id == type.id) {
      return;
    }
    this.setState({
      selectedType: type
    });
  };

  render() {
    const { mainCategoryId, categoryId, product } = this.props;
    const {
      isDocUploaded,
      reportTitle,
      types,
      selectedType,
      date,
      doctorName,
      doctorContact
    } = this.state;
    return (
      <View style={styles.container}>
        <HeaderWithUploadOption
          title="Basic Details"
          textBeforeUpload="Upload Doc"
          textBeforeUpload2="*"
          textBeforeUpload2Color={colors.mainBlue}
          jobId={product ? product.job_id : null}
          type={1}
          onUpload={uploadResult => {
            console.log("upload result: ", uploadResult);
            this.setState({ isDocUploaded: true });
          }}
          navigator={this.props.navigator}
        />
        <View style={styles.body}>
          <CustomTextInput
            placeholder="Report Title"
            style={styles.input}
            value={reportTitle}
            onChangeText={reportTitle => this.setState({ reportTitle })}
          />

          <SelectModal
            style={styles.input}
            dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
            placeholder="Type"
            placeholderRenderer={({ placeholder }) => (
              <View style={{ flexDirection: "row" }}>
                <Text weight="Medium" style={{ color: colors.secondaryText }}>
                  {placeholder}
                </Text>
              </View>
            )}
            selectedOption={selectedType}
            options={types}
            onOptionSelect={value => {
              this.onTypeSelect(value);
            }}
            hideAddNew={true}
          />

          <CustomDatePicker
            date={date}
            placeholder="Date"
            onDateChange={date => {
              this.setState({ date });
            }}
          />

          <CustomTextInput
            placeholder="Doctor/Hospital Name"
            style={styles.input}
            value={doctorName}
            onChangeText={doctorName => this.setState({ doctorName })}
          />

          <ContactFields
            ref={ref => (this.doctorContactRef = ref)}
            value={doctorContact}
            placeholder="Doctor/Hospital Contact"
            style={styles.input}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderColor: "#eee",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  input: {
    paddingVertical: 10,
    borderColor: colors.lighterText,
    borderBottomWidth: 2,
    paddingTop: 20,
    height: 60,
    marginBottom: 15
  }
});

export default HealthcareInsuranceForm;
