import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import { colors, defaultStyles } from "../../theme";

import ViewMoreBtn from "../../components/view-more-btn";
import ProductListItem from "../../components/product-list-item";
import { Text, Button } from "../../elements";

class RecentItems extends React.Component {
  state = {
    listHeight: "less"
  };

  toggleListHeight = () => {
    if (this.state.listHeight == "less") {
      this.setState({
        listHeight: "auto"
      });
    } else {
      this.setState({
        listHeight: "less"
      });
    }
  };

  render() {
    const { products, navigator } = this.props;
    const { listHeight } = this.state;
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.list,
            defaultStyles.card,
            listHeight == "less" ? styles.listLessHeight : {}
          ]}
        >
          {products.map((product, index) => {
            if (listHeight == "less" && index > 0) return null;
            return (
              <View
                key={index}
                style={{
                  borderBottomColor: "#efefef",
                  borderBottomWidth: 1
                }}
              >
                <ProductListItem
                  style={{
                    elevation: undefined,
                    shadowColor: "transparent",
                    marginBottom: 0
                  }}
                  product={product}
                  navigator={navigator}
                  hideViewBillBtn={true}
                  hideDirectionsAndCallBtns={true}
                />
              </View>
            );
          })}
        </View>
        {products.length > 1 && (
          <ViewMoreBtn height={listHeight} onPress={this.toggleListHeight} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center"
  },
  list: {
    width: "100%",
    minHeight: 50,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginBottom: 5
  },
  listLessHeight: {
    // maxHeight: 70
    height: "auto"
  },
  viewBtn: {
    alignItems: "center",
    marginTop: -20,
    elevation: 3
  }
});

export default RecentItems;
