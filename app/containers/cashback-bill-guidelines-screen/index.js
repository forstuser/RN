import React, { Component } from "react";
import { Dimensions, View, ScrollView, Image } from "react-native";
import { Text } from "../../elements";

import image1 from './images/1.png';
import image2 from './images/2.png';
import image3 from './images/3.png';
import image4 from './images/4.png';
import image5 from './images/5.png';
import image6 from './images/6.png';
import image7 from './images/7.png';
import image8 from './images/8.png';

const deviceWidth = Dimensions.get('window').width;

class CashbackBillGuidelines extends Component {
    static navigationOptions = {
        title: "Cashback Bill Guidelines"
      };
    
    state = {
        guidelines: [
            {
                'id': 1,
                'imageUrl': image1,
                'heading': 'Bills include grocery items'
            },
            {
                'id': 2,
                'imageUrl': image2,
                'heading': 'Purchase date & Bill upload date is same'
            },
            {
                'id': 3,
                'imageUrl': image3,
                'heading': 'Bills are un modified & unduplicated'
            },
            {
                'id': 4,
                'imageUrl': image4,
                'heading': 'Only printed Bills, not handwritten'
            },
            {
                'id': 5,
                'imageUrl': image5,
                'heading': 'Bill has Seller details'
            },
            {
                'id': 6,
                'imageUrl': image6,
                'heading': 'Use + sign to capture a long Bill in multiple images'
            },
            {
                'id': 7,
                'imageUrl': image7,
                'heading': 'Capture Bill edges within the frame'
            },
            {
                'id': 8,
                'imageUrl': image8,
                'heading': 'Bill is readable & in good condition'
            }
        ]
    }
    
    render() {
        return (
                <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
                    <Text weight='Bold' style={{ fontSize: 16, textAlign: 'center', marginTop: 10, marginLeft: 30, marginRight: 30 }}>
                        Ensure you follow this so that your Bills are not rejected and are verified faster
                    </Text>
                    <ScrollView style={{ flex: 1 }}>
                        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                            {this.state.guidelines.map(guideline => 
                                (
                                    <View 
                                        style = {styles.singleGuideline}
                                    >
                                        <Image
                                            style={styles.imageIcon}
                                            source={guideline.imageUrl}
                                            resizeMode='contain'
                                        />
                                        <Text style={{ fontSize: 14, textAlign: 'center', padding: 15 }}>{guideline.heading}</Text>
                                    </View>
                                ))
                            }
                        </View>  
                    </ScrollView>
            </ScrollView>        
        );
    }
}

const styles = {
    imageIcon: {
        height: 90,
        width: 90,
        borderRadius: 90,
        borderWidth: 1,    
    },
    singleGuideline: {
        width: deviceWidth/2, 
        height: deviceWidth/2, 
        justifyContent: 'center', 
        alignItems: 'center',
    }
};

export default CashbackBillGuidelines;