import React from "react";
import {
  Platform,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  TextInput,
  Modal
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { API_BASE_URL } from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";
import I18n from "../../i18n";
import { colors } from "../../theme";

const roadblockIcon = require("../../images/ic_roadblock.png");

export default class TagsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      selectedTagIds: [],
      searchText: ""
    };
  }

  show = () => {
    this.setState({
      isModalVisible: true
    });
  };

  hide = () => {
    this.setState({
      isModalVisible: false
    });
  };

  onTagPress = tag => {
    const { selectedTagIds } = this.state;
    const idx = selectedTagIds.indexOf(tag.id);
    if (idx > -1) {
      selectedTagIds.splice(idx, 1);
    } else {
      selectedTagIds.push(tag.id);
    }
    this.setState({ selectedTagIds });
  };

  render() {
    const { tags, onSearchPress } = this.props;
    const { searchText, selectedTagIds, isModalVisible } = this.state;
    return (
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.searchContainer}>
              <Icon
                name="md-search"
                size={24}
                color={colors.lighterText}
                style={styles.searchIcon}
              />
              <TextInput
                onChangeText={searchText => this.setState({ searchText })}
                underlineColorAndroid="transparent"
                style={styles.searchTextInput}
                placeholder={I18n.t(
                  "do_you_know_screen_tags_search_placeholder"
                )}
                placeholderTextColor={colors.lighterText}
              />
            </View>
            <TouchableOpacity onPress={this.hide} style={styles.closeBtn}>
              <Icon name="md-close" size={24} color={colors.mainText} />
            </TouchableOpacity>
          </View>
          <View style={styles.body}>
            <View style={styles.tags}>
              {tags.map(tag => {
                if (
                  tag.title.toLowerCase().indexOf(searchText.toLowerCase()) > -1
                ) {
                  return (
                    <Button
                      onPress={() => this.onTagPress(tag)}
                      text={tag.title}
                      color="secondary"
                      style={styles.tag}
                      outlineBtnStyle={{ paddingHorizontal: 10 }}
                      gradientStyle={{ paddingHorizontal: 11 }}
                      textStyle={{ fontSize: 10 }}
                      type={
                        selectedTagIds.indexOf(tag.id) > -1
                          ? "normal"
                          : "outline"
                      }
                    />
                  );
                } else {
                  return null;
                }
              })}
            </View>
            <Button
              onPress={() => {
                this.hide();
                onSearchPress(selectedTagIds);
              }}
              text={I18n.t("do_you_know_screen_tags_search_cta")}
              color="secondary"
              borderRadius={0}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  header: {
    ...Platform.select({
      ios: {
        paddingTop: 20,
        height: 76
      },
      android: {
        height: 56
      }
    }),
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2
  },
  closeBtn: {
    padding: 5,
    marginLeft: 16
  },
  searchContainer: {
    flex: 1,
    height: 42,
    backgroundColor: "#eff1f6",
    borderRadius: 21,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15
  },
  searchIcon: {
    width: 24,
    height: 24,
    marginRight: 5
  },
  searchTextInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
    color: colors.mainText
  },
  body: {
    flex: 1
  },
  tags: {
    flex: 1,
    padding: 16,
    flexDirection: "row",
    flexWrap: "wrap"
  },
  tag: {
    height: 30,
    margin: 5
  }
});
