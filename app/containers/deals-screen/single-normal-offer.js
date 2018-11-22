import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import moment from "moment";

import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";

import { Text, Image, Button } from "../../elements";
import { defaultStyles, colors } from "../../theme";
import Analytics from "../../analytics";

import QuantityPlusMinus from "../../components/quantity-plus-minus";
import LoadingOverlay from "../../components/loading-overlay";
import { API_BASE_URL } from "../../api";

export default class SingleNormalOffer extends React.Component {
  render() {
    const { item, skuOffersLength } = this.props;
    return (
      <View
        style={{
          ...defaultStyles.card,
          margin: 10,
          borderRadius: 5,
          height: skuOffersLength > 0 ? 350 : 175,
          width: 300
        }}
      >
        <Image
          style={{ height: 100, width: 300 }}
          source={{
            uri:
              API_BASE_URL +
              `/offer/${item.id}/images/${item.document_details.index || 0}`
          }}
        />
        <View style={{ padding: 10 }}>
          <Text weight="Medium" style={{ fontSize: 19 }}>
            {item.title}
          </Text>
          {/* <Text style={{ fontSize: 15 }}>{item.description}</Text> */}
          <Text style={{ fontSize: 15, color: colors.mainBlue }}>
            Expiring on: {moment(item.end_date).format("DD MMM, YYYY")}
          </Text>
        </View>
      </View>
    );
  }
}

// const SingleNormalOffer = ({
//   key,
//   id,
//   title,
//   description,
//   end_date,
//   document_details
// }) => (
//   <View
//     style={{
//       ...defaultStyles.card,
//       margin: 10,
//       height: 100,
//       width: 200,
//       borderRadius: 5,
//       flex: 1
//     }}
//   >
//     <Image
//       style={{ height: 20, flex: 1, width: null }}
//       source={{
//         uri: API_BASE_URL + `/offer/${id}/images/${document_details || 0}`
//       }}
//     />
//     <View style={{ padding: 10 }}>
//       <Text weight="Medium" style={{ fontSize: 19 }}>
//         {title}
//       </Text>
//       <Text style={{ fontSize: 15 }}>{description}</Text>
//       <Text style={{ fontSize: 15, color: colors.mainBlue }}>
//         Expiring on: {moment(end_date).format("DD MMM, YYYY")}
//       </Text>
//     </View>
//   </View>
// );

// export default SingleNormalOffer;
