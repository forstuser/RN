import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TextInput
} from "react-native";
import { Text, Button } from "../elements";
import { colors } from "../theme";

const dropdownIcon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfhDAkMGjg4AXstAAAAcklEQVRIx+3Tuw3AIAxF0avMxQAMwNKeiYIUUSSE+NimQ7zU9wQK4O6IBYTi/ITARl4oyLN/hUh2/z8TAZKTyKT/FB6iyj1Ek1uJTm4hBrmWmOQaYpGvCEU+I5T5iDDkPcKYt4QjrwlnDhAR5Htxd0fvBYOKNVDm/h2pAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTEyLTA5VDEyOjI2OjU2KzAxOjAw6KWTZgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0xMi0wOVQxMjoyNjo1NiswMTowMJn4K9oAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC`;

_placeholderRenderer = ({ placeholder }) => {
  return (
    <Text style={[styles.placeholder, placeholderStyle]}>{placeholder}</Text>
  );
};
class SelectModal extends Component {
  render() {
    const {
      options = [],
      selectedValue = null,
      valueKey = "id",
      visibleKey = "name",
      placeholder = "Select a value",
      newValueOption = true,
      onNewValueOptionAdd,
      style = {},
      placeholderStyle = {},
      dropdownArrowStyle = {},
      placeholderRenderer = this._placeholderRenderer
    } = this.props;
    return (
      <TouchableOpacity
        onPress={this.openSearchScreen}
        style={[styles.container, style]}
      >
        <View style={{ flex: 1 }}>{placeholderRenderer({ placeholder })}</View>
        <Image
          style={[styles.dropdownIcon, dropdownArrowStyle]}
          source={{ uri: dropdownIcon }}
        />
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10
  },
  placeholder: {
    flex: 1
  },
  dropdownIcon: {
    width: 12,
    height: 12
  }
});
export default SelectModal;
