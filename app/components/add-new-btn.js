import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { colors, defaultStyles } from '../theme';
import { Text } from "../elements";
import Icon from "react-native-vector-icons/Ionicons";

const AddNewBtn = ({ text, onPress }) => (
    <TouchableOpacity style={styles.addNewBtn} onPress={onPress}>
        <View style={styles.container}>
            <Icon
                name="md-add"
                size={20}
                color={colors.pinkishOrange}
            />
            <Text weight="Medium" style={{ color: '#9b9b9b' }}> {text}</Text>
        </View>
    </TouchableOpacity >
)
const styles = StyleSheet.create({
    addNewBtn: {
        ...defaultStyles.card,
        borderRadius: 4,
    },
    container: {
        flexDirection: 'row',
        padding: 12,
        justifyContent: 'center',
    }
});

export default AddNewBtn;