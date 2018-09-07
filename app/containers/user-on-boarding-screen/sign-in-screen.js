import React, { Component } from 'react';
import { ScrollView, View, Image } from 'react-native';

import { Text, TextInput, Button } from '../../elements';
import { SCREENS } from '../../constants';

class SignInScreen extends Component {
    static navigationOptions = {
        header: null
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
                        />
                        <View style={{ marginTop: 20 }}>
                            <Button
                                text='Submit' 
                                onPress={() => this.props.navigation.navigate(SCREENS.BASIC_DETAILS_SCREEN_ONBOARDING)}
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
                        <Text style={{ textAlign: 'center' }}>By signing up you agree to our Terms and Conditions and Privacy Policy</Text>
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
        paddingRight: 10
    }
};

export default SignInScreen;