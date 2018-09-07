import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';

import Header from './header';
import SignInScreen from './sign-in-screen';

class UserOnBoardingScreen extends Component {
    static navigationOptions = {
        header: null
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header navigation={this.props.navigation} />
                <SignInScreen navigation={this.props.navigation} />
            </View>
        );
    }
}

export default UserOnBoardingScreen;