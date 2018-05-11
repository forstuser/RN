import React from "react";
import {
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    Platform
} from "react-native";
import { Text } from "../../../elements";
import { colors, defaultStyles } from "../../../theme";
import Eicon from "react-native-vector-icons/EvilIcons";
import Icon from "react-native-vector-icons/Ionicons";

class PriceEditInput extends React.Component {
    constructor(props) {
        super(props);
        this.input = null
        this.state = {
            value: "",
            isInputFocused: false,
            correctIcon: false
        };
    }

    componentDidMount() {
        if (this.props.price) {
            this.setState({ value: JSON.stringify(this.props.price) });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value) {
            this.setState({ value: nextProps.value });
        }
    }

    onChangeText = newValue => {
        if (typeof this.props.onChangeText == "function") {
            this.props.onChangeText(newValue);
        }
        this.setState({
            value: newValue
        });
    };
    onInputFocus = () => {
        this.setState({
            isInputFocused: true
        });
        if (this.state.correctIcon == false)
            this.setState({
                correctIcon: true
            });
    };
    onInputBlur = () => {
        this.setState({
            isInputFocused: false
        });
    };

    focus = () => {
        this.input.focus();
    };

    toggleIcon = () => {
        if (this.state.correctIcon == false)
            this.setState({
                correctIcon: true
            });
        else {
            this.setState({
                correctIcon: false
            });
        }
    }
    updateAmount = () => {
        console.log("updated amount sent it to parent", this.state.value)
    }

    render() {
        const {
            name,
            date,
            price,
        } = this.props;
        const { value, isInputFocused, correctIcon } = this.state;


        return (
            <View style={styles.container}>
                <View style={{ flex: 1.5, marginTop: 10 }}>
                    <Text weight="Regular">
                        {name}{date}
                    </Text>
                </View>
                <View style={styles.innerContainer}>
                    <View style={styles.textInput}>
                        <TextInput
                            ref={ref => (this.input = ref)}
                            // style={correctIcon ? styles.grey : styles.white}
                            underlineColorAndroid="transparent"
                            value={value}
                            onFocus={this.onInputFocus}
                            onBlur={this.onInputBlur}
                            onChangeText={text => this.onChangeText(text)}
                            maxLength={10}
                        />
                    </View>
                    <View style={styles.icon}>
                        {!correctIcon && <TouchableOpacity style={{ marginTop: 5 }} onPress={(event) => { this.input.focus(), this.toggleIcon() }}>
                            <Eicon name="pencil" size={30} color={colors.mainBlue} />
                        </TouchableOpacity>}
                        {correctIcon && <TouchableOpacity style={{ marginTop: 4 }} onPress={(event) => { this.toggleIcon(), this.updateAmount() }}>
                            <Icon name="ios-checkmark-circle" size={30} color={colors.mainBlue} />
                        </TouchableOpacity>}
                    </View>
                </View>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: "100%",
        height: 45,
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: '#fefefe',
    },
    innerContainer: {
        flex: 1,
        flexDirection: 'row',
        marginRight: 5,
        justifyContent: 'flex-end',
    },
    textInput: {
        flex: 2,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    icon: {
        flex: 1,
        justifyContent: 'flex-start'
    },
    grey: {
        backgroundColor: colors.secondaryText,
    },
    white: {
        backgroundColor: 'transparent'
    }
});

export default PriceEditInput;
