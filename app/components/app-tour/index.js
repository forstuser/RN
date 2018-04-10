import React from "react";
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions
} from "react-native";
import I18n from "../../i18n";
import { Text } from "../../elements";

export default class AppTour extends React.Component {
  static defaultProps = {
    steps: []
  };
  constructor(props) {
    super(props);
    this.state = {
      activeStepIndex: -1,
      showTour: false,
      tooltipText: "",
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      tooltipVerticalPosition: "top",
      tooltipHorizontalPosition: "left",
      toolTipContainerHeight: 0
    };
  }
  componentDidMount() {
    console.log("tour props:", this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateDimensions();
  }

  startTour = () => {
    this.setState({ activeStepIndex: 0 }, () => this.updateDimensions());
  };

  next = () => {
    this.setState({ activeStepIndex: this.state.activeStepIndex + 1 }, () =>
      this.updateDimensions()
    );
  };

  updateDimensions = () => {
    const { steps } = this.props;
    const { activeStepIndex } = this.state;
    const activeStep = steps[activeStepIndex];

    if (activeStep && activeStep.ref) {
      activeStep.ref.measureInWindow((x, y, width, height) => {
        const windowHeight = Dimensions.get("window").height;
        const windowWidth = Dimensions.get("window").width;

        let tooltipHorizontalPosition = "left";
        let tooltipVerticalPosition = "top";
        //if visible area in upper half of screen
        if (y + height / 2 < windowHeight / 2) {
          tooltipVerticalPosition = "bottom";
        }

        //if visible area in left half of screen
        if (x + width / 2 < windowWidth / 2) {
          tooltipHorizontalPosition = "right";
        }

        console.log("mmmm", x, y, width, height);

        this.setState({
          showTour: true,
          tooltipText: activeStep.text,
          tooltipVerticalPosition,
          tooltipHorizontalPosition,
          x,
          y,
          width,
          height
        });
      });
    } else {
      this.setState({
        showTour: false
      });
    }
  };

  onTooltipContainerRender = event => {
    this.setState({
      toolTipContainerHeight: event.nativeEvent.layout.height
    });
  };

  render() {
    const {
      showTour,
      tooltipText,
      tooltipVerticalPosition,
      tooltipHorizontalPosition,
      x,
      y,
      width,
      height,
      toolTipContainerHeight
    } = this.state;
    const windowWidth = Dimensions.get("window").width;
    const windowHeight = Dimensions.get("window").height;

    if (!showTour) {
      return null;
    }
    return (
      <Modal transparent={true} ref={this.props.setRef}>
        <TouchableWithoutFeedback onPress={this.next}>
          <View style={styles.container}>
            <View style={[styles.border, styles.borderTop, { height: y }]} />
            <View
              style={[
                styles.border,
                styles.borderRight,
                { top: y, left: x + width, height: height }
              ]}
            />
            <View
              style={[styles.border, styles.borderBottom, { top: y + height }]}
            />
            <View
              style={[
                styles.border,
                styles.borderLeft,
                { top: y, width: x, height: height }
              ]}
            />
            <TouchableOpacity
              onPress={this.next}
              style={[
                styles.visibleArea,
                { top: y, left: x, width: width, height: height }
              ]}
            />
            <View
              style={[
                styles.tooltipArrow,
                tooltipVerticalPosition == "top"
                  ? {
                      top: y - 25,
                      left: x + width / 2 - 10,
                      borderTopColor: "#00C3E3"
                    }
                  : {
                      top: y + height,
                      left: x + width / 2 - 10,
                      borderBottomColor: "#00C3E3"
                    }
              ]}
            />
            <View
              style={[
                styles.tooltipContainer,
                tooltipVerticalPosition == "top"
                  ? {
                      top: y - (toolTipContainerHeight + 45)
                    }
                  : {
                      top: y + height
                    },
                tooltipHorizontalPosition == "left"
                  ? {
                      right: 10
                    }
                  : {
                      left: 10
                    }
              ]}
            >
              <View
                style={styles.tooltipTextWrapper}
                onLayout={this.onTooltipContainerRender}
              >
                <Text style={[styles.tooltipText]}>{tooltipText}</Text>
                <TouchableOpacity
                  onPress={this.next}
                  style={[styles.gotIt, {}]}
                >
                  <Text weight="Bold" style={[styles.gotItText, {}]}>
                    {I18n.t("add_app_tour")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  border: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  borderTop: {
    top: 0,
    left: 0,
    right: 0
  },
  borderRight: {
    right: 0
  },
  borderBottom: {
    bottom: 0,
    width: "100%"
  },
  borderLeft: {
    left: 0
  },
  visibleArea: {
    position: "absolute"
  },
  tooltipContainer: {
    position: "absolute",
    width: 300,
    paddingVertical: 20
  },
  tooltipArrow: {
    position: "absolute",
    width: 20,
    height: 20,
    borderWidth: 10,
    borderColor: "transparent"
  },
  tooltipArrowTop: {
    top: 0,
    borderBottomColor: "#00C3E3"
  },
  tooltipArrowBottom: {
    bottom: 0,
    borderTopColor: "#00C3E3"
  },
  tooltipTextWrapper: {
    backgroundColor: "#00C3E3",
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
    borderRadius: 4
  },
  tooltipText: {
    color: "#fff",
    fontWeight: "500"
  },
  gotIt: {
    alignSelf: "flex-end",
    padding: 5,
    marginTop: 10
  },
  gotItText: {
    fontWeight: "900",
    color: "#fff"
  }
});
