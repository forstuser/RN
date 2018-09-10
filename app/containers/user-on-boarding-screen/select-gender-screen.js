import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Text, Image } from "../../elements";
import { colors } from "../../theme";

const manImage = require("../../images/man.png");
const womanImage = require("../../images/woman.png");
import { Button } from '../../elements';
import { SCREENS } from "../../constants";
import { updateProfile } from '../../api';
import LoadingOverlay from '../../components/loading-overlay';
import Snackbar from '../../utils/snackbar';

class SelectGenderScreen extends React.Component {
    static navigationOptions = {
        title: 'Select Gender'
    };

    constructor(props) {
        super(props);
        this.state = {
          gender: 0,  
          isLoading: false,
          error: null
        };
      }

    selectGender = (genderSelected) => {
        if(genderSelected === 'Male')   
            this.setState({
                gender: 1 
            });
        else
            this.setState({
                gender: 2
            });
    };

    onNextPress = async () => {
        //alert('Next Pressed');
        const { gender } = this.state;
        this.setState({
            isLoading: true
        });
        try {
            const res = await updateProfile({
                gender
              });
        } catch (e) {
            console.log("e: ", e);
      
            Snackbar.show({
              title: e.message,
              duration: Snackbar.LENGTH_SHORT
            });
          } finally {
            this.setState({ isLoading: false });
          }
        this.props.navigation.navigate(SCREENS.SELECT_CITIES_SCREEN_ONBOARDING);
    };

    render() {
        return (
            <View>
                <TouchableOpacity onPress={() => this.selectGender('Male')}>
                    <Image
                        style={styles.icon1} 
                        source={manImage}
                        resizeMode='contain' 
                    />
                    <Text weight='Bold' style={styles.iconHeading}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.selectGender('1')}>
                    <Image 
                        style={styles.icon2} 
                        source={womanImage} 
                        resizeMode='contain'
                    />
                    <Text weight='Bold' style={styles.iconHeading}>Female</Text>
                </TouchableOpacity>
                <Button
                        text='Next' 
                        onPress={this.onNextPress}
                        color='secondary'
                        textStyle={{ fontSize: 20 }}
                        style={styles.button}
                />
                <LoadingOverlay visible={this.state.isLoading} />
            </View>
        );
    }
}

const styles = {
    box: {
        flex: 1
    },
    box1: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 30
    },
    box2: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 30
    },
    icon1: {
        width: 72, 
        height: 92, 
        marginTop: 30,
        alignSelf: 'center'
    },
    icon2: {
        width: 72, 
        height: 92, 
        marginTop: 20,
        alignSelf: 'center'
    },
    iconHeading: {
        marginTop: 10,
        textAlign: 'center'
    },
    button: {
        marginTop: 30,
        padding: 20,
        height: 90
    }
};

export default SelectGenderScreen;
