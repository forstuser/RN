import React, { Component } from 'react';
import { View } from 'react-native';

import { Text, TextInput, Button } from '../../elements';

class VerifyMobileScreen extends Component {
    static navigationOptions = {
        title: 'Verify Mobile Number'
    };

    render() {
        return (
            <View style={styles.container}>
                <Text weight='Medium' style={{ textAlign: 'center', fontSize: 18, padding: 20, marginTop: 10 }}>Please enter the OTP sent on the number you have provided</Text>
                <Button
                    style={{ marginTop: 20 }}
                    text='Submit'
                    onPress={() => alert('OTP')}
                    color='secondary'
                    textStyle={{ fontSize: 20 }}
                />
                <Text weight='Medium' style={{ textAlign: 'center', textDecorationLine: 'underline', color: '#009ee5', fontSize: 16, marginTop: 30 }} onPress={() => alert('Resend OTP')} >RESEND OTP</Text>
            </View>
        );
    }
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20
    }
};

export default VerifyMobileScreen;