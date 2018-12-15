import React, { Component } from "react";
import { View, Image } from "react-native";
import moment from "moment";

import { Text } from "../../elements";
import { defaultStyles, colors } from "../../theme";
import { ORDER_STATUS_TYPES, CASHBACK_SOURCE } from "../../constants";

class SingleTransaction extends Component {
  render() {
    const { transaction } = this.props;
    let price = null;
    let description = null;
    let id = (
      <Text style={{ color: colors.mainBlue }}>
        {transaction.id !== null ? transaction.id : null}
      </Text>
    );

    if (transaction.status_type === ORDER_STATUS_TYPES.APPROVED) {
      price = (
        <Text weight="Bold" style={styles.price1}>
          {transaction.price !== 0 ? `+ ` + transaction.price : 0}
        </Text>
      );
      if (transaction.cashback_source === CASHBACK_SOURCE.DEFAULT) {
        description = (
          <Text weight="Bold" style={styles.info}>
            {transaction.title}
          </Text>
        );
      } else if (transaction.cashback_source === CASHBACK_SOURCE.DELAYED) {
        description = (
          <Text weight="Bold" style={styles.info}>
            Late Response Compensation
          </Text>
        );
      } else {
        if (transaction.is_paytm === true) {
          description = (
            <Text weight="Bold" style={styles.info}>
              Credited from Paytm
            </Text>
          );
        }
        if (transaction.is_paytm === false) {
          description = (
            <Text weight="Bold" style={styles.info}>
              Received from BinBill
            </Text>
          );
        }
      }
    }

    if (
      transaction.status_type === ORDER_STATUS_TYPES.REDEEMED ||
      transaction.status_type === ORDER_STATUS_TYPES.PENDING
    ) {
      price = (
        <Text weight="Bold" style={styles.price2}>
          {transaction.price !== 0
            ? `- ` + transaction.price
            : transaction.price}
        </Text>
      );
      if (transaction.cashback_source === CASHBACK_SOURCE.DEFAULT) {
        description = (
          <Text weight="Bold" style={styles.info}>
            {transaction.title}
          </Text>
        );
      } else if (transaction.cashback_source === CASHBACK_SOURCE.DELAYED) {
        description = (
          <Text weight="Bold" style={styles.info}>
            Late Response Compensation
          </Text>
        );
      } else {
        if (
          transaction.is_paytm === true &&
          transaction.status_type === ORDER_STATUS_TYPES.REDEEMED
        ) {
          description = (
            <Text weight="Bold" style={styles.info}>
              Redeemed at Paytm
            </Text>
          );
        }
        if (
          transaction.is_paytm === true &&
          transaction.status_type === ORDER_STATUS_TYPES.PENDING
        ) {
          description = (
            <Text weight="Bold" style={styles.info}>
              Pending at Paytm
            </Text>
          );
        }
        if (transaction.is_paytm === false) {
          description = (
            <Text weight="Bold" style={styles.info}>
              Redeemed at Seller
            </Text>
          );
        }
      }
    }

    return (
      <View style={styles.container}>
        <View style={[styles.box, styles.box1]}>
          {/* <Image style={styles.imageIcon} source={require("./icon.png")} /> */}
          <Text
            weight="Bold"
            style={{ fontSize: 33, color: "#ababab", marginTop: -10 }}
          >
            {moment(transaction.date).format("DD")}
          </Text>
          <Text
            weight="Bold"
            style={{ fontSize: 15, color: "#ababab", marginTop: -5 }}
          >
            {moment(transaction.date).format("MMM")}
          </Text>
        </View>
        <View style={[styles.box, styles.box2]}>
          {description}
          <Text style={styles.date}>{transaction.date}</Text>
          <Text style={styles.id}>Transaction ID: {id}</Text>
        </View>
        <View style={[styles.box, styles.box3]}>{price}</View>
      </View>
    );
  }
}

const styles = {
  container: {
    ...defaultStyles.card,
    flex: 1,
    flexDirection: "row",
    borderRadius: 10,
    margin: 10
  },
  box: {
    height: 100
  },
  box1: {
    flex: 2.5,
    alignItems: "center",
    marginTop: 15
  },
  box2: {
    flex: 5,
    marginLeft: 10
  },
  box3: {
    flex: 2.5
  },
  info: {
    marginTop: 10,
    fontSize: 14
  },
  date: {
    marginTop: 10,
    color: "#aaa",
    fontSize: 13
  },
  id: {
    marginTop: 5,
    fontSize: 14
  },
  price1: {
    textAlign: "right",
    marginRight: 15,
    marginTop: 10,
    fontSize: 18,
    color: colors.success
  },
  price2: {
    textAlign: "right",
    marginRight: 15,
    marginTop: 10,
    fontSize: 18,
    color: colors.danger
  },
  imageIcon: {
    height: 80,
    width: 80,
    marginLeft: 10,
    marginTop: 10
  }
};

export default SingleTransaction;
