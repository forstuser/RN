import React, { Component } from 'react';
import { View, FlatList } from 'react-native';

import { Text } from '../../elements';
import SelectSellerHeader from './select-seller-header';
import SingleSeller from './single-seller';

class SelectSellerScreen extends Component {
    static navigationOptions = {
        header: null
      };
      constructor(props) {
        super(props);
        this.state = {
            selectedSeller: null,
            error: null,
            isFetchingData: true,
            sellerInfo: [
                {
                    'description': 'Zop Now',
                    'price': 1000
                },
                {
                    'description': 'Dilli Grocery',
                    'price': 500
                },
                {
                    'description': 'Zop Now',
                    'price': 1000
                },
                {
                    'description': 'Dilli Grocery',
                    'price': 500
                },
                {
                    'description': 'Zop Now',
                    'price': 1000
                },
                {
                    'description': 'Dilli Grocery',
                    'price': 500
                }              
            ],
        };
    }

    onSellerPressedHandler = (seller) => {
        this.setState({
            selectedSeller: seller
        });
    };

    renderSellers = ({item:seller, index}) => {
        return <SingleSeller 
            seller={seller}
            selectedSeller={this.state.selectedSeller}
            onSellerPressed={this.onSellerPressedHandler}
        />;
    };

    render() {
        return (
            <View style={{ backgroundColor: '#fff' }}>
                <SelectSellerHeader navigation={this.props.navigation} />
                <FlatList
                    data={this.state.sellerInfo}
                    renderItem={this.renderSellers}
                    extraData={this.state.selectedSeller}
                />
            </View>
        );
    }
}

export default SelectSellerScreen;