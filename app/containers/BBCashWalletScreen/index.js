import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';

import { Text } from '../../elements';
import Header from './header';
import SingleTransaction from './singleTransaction';

class BBCashWalletScreen extends Component {
    static navigationOptions = {
        header: null
      };
    
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <Header />
                <Text style={styles.heading} weight="Bold">BBCash Transactions</Text>
                <ScrollView style={{ flex: 1, padding: 10 }}>
                    <SingleTransaction />
                    <SingleTransaction />
                    <SingleTransaction />
                    <SingleTransaction />
                    <SingleTransaction />
                    <SingleTransaction />
                </ScrollView>
            </View>
        );
    }
}

const styles = {
    heading: {
        fontSize: 14,
        marginTop: 10,
        marginLeft: 10
    },
};

export default BBCashWalletScreen;
