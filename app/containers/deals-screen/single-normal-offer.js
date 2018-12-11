import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions
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

const deviceWidth = Dimensions.get("window").width;

export default class SingleNormalOffer extends React.Component {
  render() {
    const { item } = this.props;
    return (
      <View
        style={{
          ...defaultStyles.card,
          margin: 5,
          marginLeft: 10,
          borderRadius: 5,
          height: 185,
          width: deviceWidth
        }}
      >
        <Image
          style={{ height: 130, width: deviceWidth - 40 }}
          source={{
            uri:
              API_BASE_URL +
              `/offer/${item.id}/images/${item.document_details.index || 0}`
          }}
          resizeMode="stretch"
        />
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 16, marginTop: -3 }}>{item.title}</Text>
          {/* <Text style={{ fontSize: 15 }}>{item.description}</Text> */}
          <Text style={{ fontSize: 14, color: colors.mainBlue }}>
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
