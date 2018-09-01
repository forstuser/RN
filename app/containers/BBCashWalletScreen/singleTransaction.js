import React, { Component } from 'react';
import { View, Image } from 'react-native';

import { Text } from '../../elements';

class SingleTransaction extends Component {
    
    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.box, styles.box1]}>
                    <Image style={styles.imageIcon} source={require('./icon.png')} />
                </View>
                <View style={[styles.box, styles.box2]}>
                    <Text weight="Bold" style={styles.info}>Redeemed at Paytm</Text>
                    <Text style={styles.date}>August 31, 2018</Text>
                    <Text style={styles.id}>Transaction ID: 1234567890</Text>
                </View>
                <View style={[styles.box, styles.box3]}>
                    <Text weight="Bold" style={styles.price}>100</Text>
                </View>
            </View>
        );
    }
}

const styles = {
    container: {
        flex: 1,
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: '#eee',
        borderRadius: 10,
        marginTop: 5      
    },
    box: {
        height: 100
    },
    box1: {
        flex: 2.5,    
    },
    box2: {
        flex: 5.5,
        marginLeft: 10
    },
    box3: {
        flex: 2,
    },
    info: {
        marginTop: 10
    },
    date: {
        marginTop: 10,
        color: '#aaa'
    },
    id: {
        marginTop: 5,
        fontSize: 10
    },
    price: {
        textAlign: 'right',
        marginRight: 20,
        marginTop: 10,
        fontSize: 18
    },
    imageIcon: {
        height: 80,
        width: 80,
        marginLeft: 10,
        marginTop: 10    
    }
};

export default SingleTransaction;
