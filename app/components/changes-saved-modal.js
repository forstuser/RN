import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { Text, Button } from "../elements";
import Modal from "react-native-modal";
import { colors } from "../theme";
import { API_BASE_URL } from "../api";
import { SCREENS } from "../constants";

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
      this.props.navigator.pop();
    });
  };

  render() {
    const { title = "Changes Saved Successfully", navigator } = this.props;
    const { visible } = this.state;
    return (
      <Modal useNativeDriver={true} isVisible={visible}>
        <View style={styles.finishModal}>
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
            text="OKAY"
            color="secondary"
          />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  finishModal: {
    backgroundColor: "#fff",
    height: 500,
    borderRadius: 10,
    padding: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  finishImage: {
    width: 200,
    height: 200
  },
  finishMsg: {
    color: colors.mainBlue,
    fontSize: 24,
    textAlign: "center",
    marginTop: 25
  },
  finishBtn: {
    width: 250,
    marginTop: 20
  },
  doItLaterText: {
    color: colors.pinkishOrange,
    fontSize: 16,
    marginTop: 20
  }
});

export default ChangesSavedModal;
