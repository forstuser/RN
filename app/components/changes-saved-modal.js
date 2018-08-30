import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { Text, Button } from "../elements";
import Modal from "react-native-modal";
import { colors } from "../theme";
import { API_BASE_URL } from "../api";
import { SCREENS } from "../constants";
import I18n from "../i18n";

const tick = require("../images/tick.png");
class ChangesSavedModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  componentDidMount() {
    this.updateStateFromProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateStateFromProps(nextProps);
  }

  updateStateFromProps = props => {
    this.setState({ visible: props.visible });
  };

  show = () => {
    this.setState({ visible: true });
  };

  onOkayClick = () => {
    this.setState({ visible: false }, () => {
      this.props.navigation.goBack();
    });
  };

  render() {
    const { title = "Changes Saved Successfully", navigation } = this.props;
    const { visible } = this.state;
    if (!visible) return null;

    return (
      <View collapsable={false}>
        {visible ? (
          <View collapsable={false}>
            <Modal useNativeDriver={true} isVisible={true}>
              <View collapsable={false} style={styles.finishModal}>
                <Image
                  style={styles.finishImage}
                  source={tick}
                  resizeMode="contain"
                />
                <Text weight="Bold" style={styles.finishMsg}>
                  {title}
                </Text>
                <Button
                  onPress={this.onOkayClick}
                  style={styles.finishBtn}
                  text={I18n.t("component_items_okey")}
                  color="secondary"
                />
              </View>
            </Modal>
          </View>
        ) : (
          <View collapsable={false} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  finishModal: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 300,
    alignSelf: "center"
  },
  finishImage: {
    width: 200,
    height: 200
  },
  finishMsg: {
    color: colors.mainBlue,
    fontSize: 24,
    textAlign: "center",
    marginTop: 25,
    width: 200
  },
  finishBtn: {
    width: 200,
    marginTop: 20
  }
});

export default ChangesSavedModal;
