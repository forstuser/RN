import React, { Component } from 'react';
import { View, Image } from 'react-native';
import moment from "moment";

import { Text } from '../../elements';
import { defaultStyles } from "../../theme";

class SingleTransaction extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.box, styles.box1]}>
                    {/* <Image style={styles.imageIcon} source={require('./icon.png')} /> */}
                    <Text
                    weight="Bold"
                    style={{ fontSize: 33, color: "#ababab", marginTop: -10 }}
                  >
                    {moment(this.props.date).format("DD")}
                  </Text>
                  <Text
                    weight="Bold"
                    style={{ fontSize: 15, color: "#ababab", marginTop: -5 }}
                  >
                    {moment(this.props.date).format("MMM")}
                  </Text>
                </View>
                <View style={[styles.box, styles.box2]}>
                    <Text weight="Bold" style={styles.info}>{this.props.description}</Text>
                    <Text style={styles.date}>{this.props.date}</Text>
                    <Text style={styles.id}>Transaction ID: {this.props.id}</Text>
                </View>
                <View style={[styles.box, styles.box3]}>
                    <Text weight="Bold" style={styles.price}>{this.props.price}</Text>
                </View>
            </View>
        );
    }
}

const styles = {
    container: {
        ...defaultStyles.card,
        flex: 1,
        flexDirection: 'row',
        borderRadius: 10,
        margin: 10      
    },
    box: {
        height: 100
    },
    box1: {
        flex: 2.5,
        alignItems: 'center',
        marginTop: 15    
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
