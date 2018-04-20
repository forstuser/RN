import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

import { Text } from "../elements";
import { defaultStyles, colors } from '../theme';

class EasyLifeItem extends React.Component {
    render() {
        const { text, rightText, bottomText, showCheckbox = true, isChecked, imageUri, onPress } = this.props;
        return <TouchableOpacity style={[styles.container, (bottomText || imageUri) ? styles.bigContainer : {}]} onPress={onPress}>
            {showCheckbox && <View style={styles.checkbox}>
                {isChecked && <Icon name='ios-checkmark' color={colors.pinkishOrange} size={30} />}
            </View>}
            {!showCheckbox && <View style={[styles.selectBox, isChecked ? styles.selectedBox : {}]}>
                {isChecked && <Icon name='ios-checkmark' color={'#fff'} size={30} />}
            </View>}
            <View style={styles.texts}>
                <Text weight='Medium' style={styles.text} numberOfLines={1}>{text}</Text>
                {bottomText ? <Text style={styles.subText}>{bottomText}</Text> : null}
            </View>
            {rightText ? <Text style={styles.subText}>{rightText}</Text> : null}
            {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} /> : null}
        </TouchableOpacity>
    }
}

const styles = StyleSheet.create({
    container: {
        height: 45,
        flexDirection: 'row',
        ...defaultStyles.card,
        borderRadius: 5,
        alignItems: 'center',
        paddingLeft: 14
    },
    bigContainer: {
        height: 70,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: colors.pinkishOrange,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectBox: {
        width: 26,
        height: 26,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee',
        borderRadius: 15
    },
    selectedBox: {
        backgroundColor: colors.success
    },
    texts: {
        flex: 1,
        marginHorizontal: 10,
    },
    text: {},
    subText: {
        fontSize: 10,
        color: colors.secondaryText,
        marginRight: 10
    },
    image: {
        width: 80,
        height: 70,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
    }
})

export default EasyLifeItem;