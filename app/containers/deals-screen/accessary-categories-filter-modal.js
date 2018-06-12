import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  FlatList,
  Platform,
  TouchableOpacity
} from "react-native";
import Snackbar from "react-native-snackbar";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";

import Checkbox from "../../components/checkbox";
import { Text, Button } from "../../elements";

import { colors } from "../../theme";

export default class AccessaryCategoriesFilterModal extends React.Component {
  state = {
    isModalVisible: false,
    selectedCategory: null,
    selectedAccessoryCategoryIds: []
  };

  show = selectedAccessoryCategoryIds => {
    this.setState({ isModalVisible: true, selectedAccessoryCategoryIds });
  };

  hide = () => {
    this.setState({ isModalVisible: false });
  };

  toggleSelectedItem = itemId => {
    const selectedAccessoryCategoryIds = [
      ...this.state.selectedAccessoryCategoryIds
    ];
    const idx = selectedAccessoryCategoryIds.indexOf(itemId);

    if (idx > -1) {
      selectedAccessoryCategoryIds.splice(idx, 1);
    } else {
      selectedAccessoryCategoryIds.push(itemId);
    }
    this.setState({ selectedAccessoryCategoryIds });
  };

  renderCategoryItem = ({ item }) => {
    const { selectedAccessoryCategoryIds } = this.state;
    return (
      <TouchableOpacity
        onPress={() => this.toggleSelectedItem(item.id)}
        style={{
          flexDirection: "row",
          padding: 15
        }}
      >
        <Text style={{ flex: 1 }}>{item.title}</Text>
        <Checkbox isChecked={selectedAccessoryCategoryIds.includes(item.id)} />
      </TouchableOpacity>
    );
  };

  render() {
    const { accessoryCategories, setSelectedAccessoryCategoryIds } = this.props;
    const { isModalVisible, selectedAccessoryCategoryIds } = this.state;

    return (
      <Modal
        style={{ margin: 0 }}
        isVisible={isModalVisible}
        useNativeDriver={true}
        onBackButtonPress={() => this.setState({ isModalVisible: false })}
      >
        <View style={{ backgroundColor: "#fff", flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity
              style={{ paddingVertical: 10, paddingHorizontal: 15 }}
              onPress={this.hide}
            >
              <Icon name="md-arrow-round-back" color="#fff" size={30} />
            </TouchableOpacity>
            <Text weight="Bold" style={{ color: "#fff", fontSize: 20 }}>
              Category Filter
            </Text>
          </View>
          <View style={styles.body}>
            <FlatList
              data={accessoryCategories}
              renderItem={this.renderCategoryItem}
              keyExtractor={item => item.id}
              ItemSeparatorComponent={highlighted => (
                <View style={{ height: 1, backgroundColor: "#eee" }} />
              )}
            />
            <Button
              onPress={() => {
                setSelectedAccessoryCategoryIds(selectedAccessoryCategoryIds);
                this.hide();
              }}
              text="Apply Filter"
              borderRadius={0}
              color="secondary"
            />
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: 0,
    width: "100%",
    height: 70,
    backgroundColor: colors.pinkishOrange,
    flexDirection: "row",
    alignItems: "center",
    ...Platform.select({
      ios: { paddingTop: 20 },
      android: { paddingTop: 10 }
    })
  },
  body: {
    flex: 1
  }
});
