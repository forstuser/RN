import React, { Component } from 'react';
import { ScrollView, View, Image } from 'react-native';

import { Text, TextInput, Button } from '../../elements';
import { SCREENS } from '../../constants';
import Hyperlink from "react-native-hyperlink";
import { colors } from '../../theme';
import I18n from '../../i18n';
import { showSnackbar } from '../../utils/snackbar';

class SignInScreen extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            mobile: ''
        };
    }

    onSubmitPress = () => {
            this.props.navigation.navigate(SCREENS.BASIC_DETAILS_SCREEN_ONBOARDING)
    };

    render() {
        return (
            <ScrollView style={styles.container}>
                    <View style={[styles.box, styles.box1]}>
                        <Image 
                            style={styles.imageIcon} 
                            source={require('./icon.png')}
                            resizeMode='contain' 
                        />
                    </View>
                    <View style={[styles.box, styles.box2]}>
                        <TextInput
                            underlineColorAndroid='transparent'
                            placeholder='Enter Mobile Number'
                            style={styles.inputMobile}
                            maxLength={10}
                            keyboardType="phone-pad"
                            OnChangeText={mobile => this.setState({ mobile })}
                            value={this.state.mobile}
                        />
                        <View style={{ marginTop: 20 }}>
                            <Button
                                text='Submit' 
                                onPress={this.onSubmitPress}
                                color='secondary'
                                textStyle={{ fontSize: 20 }}
                            />
                        </View>
                        <Text style={{ textAlign: 'center', marginTop: 45 }}>--------OR INSTANT SIGN IN WITH--------</Text>
                    </View>
                    <View style={[styles.box, styles.box3]}>
                            <Button
                                text='facebook' 
                                onPress={() => alert('Facebook Pressed')}
                                color='primary'
                                textStyle={{ fontSize: 20 }}
                            />
                    </View>
                    <View style={[styles.box, styles.box4]}>
                        <Hyperlink
                            linkDefault={true}
                            linkStyle={{ color: colors.pinkishOrange, fontSize: 14 }}
                            linkText={url => {
                            if (url === "https://binbill.com/term") {
                                return "Terms & Conditions";
                            } else if (url === "https://binbill.com/privacy") {
                                return "Privacy Policy";
                            } else {
                                return url;
                            }
                            }}
                        >
                            <Text
                            style={{
                                fontSize: 14,
                                color: colors.secondaryText,
                                textAlign: "center"
                            }}
                            >
                            {`By signing up you agree to our \nhttps://binbill.com/term and https://binbill.com/privacy`}
                            </Text>
                        </Hyperlink>
                    </View>
            </ScrollView>
        );
    }
}

const styles = {
    imageIcon: {
        height: 135,
        width: 135
    },
    container: {
        flex: 1,
        flexDirection: 'column', 
        backgroundColor: '#fff'
    },
    box: {
        flex: 1,
        padding: 10
    },
    box1: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50    
    },
    box2: {
        flex: 4
    },
    box3: {
        flex: 2.5
    },
    box4: {
        flex: 0.5,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    inputMobile: {
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 24
    }
};

export default SignInScreen;