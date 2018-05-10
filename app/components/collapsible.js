import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native";

import Icon from "react-native-vector-icons/Entypo";

import { Text, Button } from "../elements";
import { colors } from "../theme";

const dropdownIcon = require("../images/ic_dropdown_arrow.png");

const PlusIcon = () => <Icon name="plus" size={20} color={colors.mainText} />;

const MinusIcon = () => <Icon name="minus" size={20} color={colors.mainText} />;

class Collapsible extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: true,
      isCollapsible: true
    };
  }

  componentDidMount() {
    if (this.props.isCollapsed === false) {
      this.setState({ isCollapsed: false });
    }
    if (this.props.isCollapsible === false) {
      this.setState({ isCollapsible: false, isCollapsed: false });
    }
  }

  toggleCollapse = () => {
    if (this.state.isCollapsible) {
      this.setState({
        isCollapsed: !this.state.isCollapsed
      });
    }
  };
  render() {
    const { isCollapsed, isCollapsible } = this.state;
    const {
      headerText = "",
      HeaderComponent,
      children,
      style,
      headerStyle,
      headerTextStyle,
      icon = "dropdown"
    } = this.props;
    return (
      <View style={style}>
        <TouchableWithoutFeedback
          onPress={this.toggleCollapse}
          style={styles.headerContainer}
        >
          <View>
            {headerText.length > 0 ? (
              <View style={[styles.headerInner, headerStyle]}>
                <Text
                  weight="Bold"
                  style={[styles.headerText, headerTextStyle]}
                >
                  {headerText}
                </Text>
                {isCollapsible &&
                  icon == "dropdown" && (
                    <Image
                      style={[
                        styles.dropdownIcon,
                        this.state.isCollapsed ? {} : styles.reverseArrow
                      ]}
                      source={dropdownIcon}
                    />
                  )}
                {isCollapsible && icon == "plus" && isCollapsed && <PlusIcon />}
                {isCollapsible &&
                  icon == "plus" &&
                  !isCollapsed && <MinusIcon />}
              </View>
            ) : (
              <View />
            )}
            {HeaderComponent ? <HeaderComponent /> : <View />}
          </View>
        </TouchableWithoutFeedback>
        <View
          style={[
            styles.bodyContainer,
            this.state.isCollapsed ? styles.collapsedBody : {}
          ]}
        >
          {children}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerInner: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
    borderColor: "#ececec",
    borderBottomWidth: 1
  },
  headerText: {
    fontSize: 16,
    flex: 1
  },
  dropdownIcon: {
    width: 24,
    height: 24
  },
  reverseArrow: {
    transform: [{ rotate: "180 deg" }]
  },
  bodyContainer: {
    backgroundColor: "#f7f7f7",
    overflow: "hidden"
  },
  collapsedBody: {
    height: 0
  }
});
export default Collapsible;
