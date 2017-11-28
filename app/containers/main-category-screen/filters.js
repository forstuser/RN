import React, { Component } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  Alert,
  TouchableOpacity
} from "react-native";
import Modal from "react-native-modal";
import CheckBox from "react-native-check-box";

import { Text, Button, ScreenContainer } from "../../elements";
import { colors } from "../../theme";

import Collapsible from "../../components/collapsible";

const filterIcon = require("../../images/ic_list_filter.png");

class Filters extends Component {
  static defaultProps = {
    categories: [],
    brands: [],
    sellers: {
      offlineSellers: [],
      onlineSellers: []
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      choosenCategoryIds: [],
      choosenCategoryIdsTemp: [],
      choosenBrandIds: [],
      choosenBrandIdsTemp: [],
      filters: []
    };
  }
  showModal = () => {
    this.setState({
      choosenCategoryIdsTemp: [...this.state.choosenCategoryIds],
      choosenBrandIdsTemp: [...this.state.choosenBrandIds],
      isModalVisible: true
    });
  };
  onCancelPress = () => {
    this.setState({
      isModalVisible: false
    });
  };

  onApplyPress = () => {
    this.setState(
      {
        choosenCategoryIds: [...this.state.choosenCategoryIdsTemp],
        choosenBrandIds: [...this.state.choosenBrandIdsTemp],
        isModalVisible: false
      },
      async () => {
        await this.props.loadProducts({
          pageNo: 1,
          categoryIds: this.state.choosenCategoryIds,
          brandIds: this.state.choosenBrandIds
        });
      }
    );
  };

  onCategoryClick = id => {
    let { choosenCategoryIdsTemp } = this.state;
    const idx = choosenCategoryIdsTemp.indexOf(id);
    if (idx > -1) {
      choosenCategoryIdsTemp.splice(idx, 1);
    } else {
      choosenCategoryIdsTemp.push(id);
    }
    this.setState({
      choosenCategoryIdsTemp
    });
  };

  onBrandClick = id => {
    let { choosenBrandIdsTemp } = this.state;
    const idx = choosenBrandIdsTemp.indexOf(id);
    if (idx > -1) {
      choosenBrandIdsTemp.splice(idx, 1);
    } else {
      choosenBrandIdsTemp.push(id);
    }
    this.setState({
      choosenBrandIdsTemp
    });
  };

  renderCategoryItem = ({ item }) => {
    return (
      <CheckBox
        style={{ paddingVertical: 10, paddingHorizontal: 16 }}
        onClick={() => this.onCategoryClick(item.id)}
        isChecked={this.state.choosenCategoryIds.indexOf(item.id) > -1}
        leftTextView={
          <Text weight="Medium" style={{ flex: 1 }}>
            {item.name}
          </Text>
        }
        checkBoxColor={colors.mainBlue}
      />
    );
  };

  renderBrandItem = ({ item }) => {
    return (
      <CheckBox
        style={{ paddingVertical: 10, paddingHorizontal: 16 }}
        onClick={() => this.onBrandClick(item.brandId)}
        isChecked={this.state.choosenBrandIds.indexOf(item.brandId) > -1}
        leftTextView={
          <Text weight="Medium" style={{ flex: 1 }}>
            {item.name}
          </Text>
        }
        checkBoxColor={colors.mainBlue}
      />
    );
  };
  render() {
    const { categories, brands, sellers } = this.props;
    return (
      <View>
        <TouchableOpacity onPress={this.showModal} style={styles.alwaysVisible}>
          <Image style={styles.filterIcon} source={filterIcon} />
          <Text weight="Medium" style={styles.filterText}>
            Filter & Sort
          </Text>
        </TouchableOpacity>
        <Modal isVisible={this.state.isModalVisible}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text
                weight="Medium"
                style={{ color: "red" }}
                onPress={this.onCancelPress}
              >
                Cancel
              </Text>
              <Text weight="Medium" style={[styles.filterText, { flex: 1 }]}>
                Filter & Sort
              </Text>
              <Text
                weight="Medium"
                style={{ color: colors.mainBlue }}
                onPress={this.onApplyPress}
              >
                Apply
              </Text>
            </View>
            <View>
              <Collapsible headerText="Type">
                <FlatList
                  style={{ height: 200 }}
                  data={categories}
                  keyExtractor={(item, index) => item.id}
                  renderItem={this.renderCategoryItem}
                />
              </Collapsible>
              <Collapsible headerText="Brand">
                <FlatList
                  style={{ maxHeight: 200 }}
                  data={brands}
                  keyExtractor={(item, index) => item.brandId}
                  renderItem={this.renderBrandItem}
                />
              </Collapsible>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  alwaysVisible: {
    flexDirection: "row",
    padding: 13,
    alignItems: "center",
    justifyContent: "center"
  },
  filterIcon: {
    width: 24,
    height: 24,
    marginRight: 10
  },
  filterText: {
    fontSize: 16,
    textAlign: "center"
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 5,
    flex: 1,
    margin: 0
  },
  modalHeader: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    borderColor: "#eee",
    borderBottomWidth: 1
  }
});

export default Filters;
