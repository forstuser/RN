import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";
import call from "react-native-phone-call";
import StarRating from "react-native-star-rating";

import { API_BASE_URL } from "../../api";
import { Text, Button } from "../../elements";
import { defaultStyles, colors } from "../../theme";

export default class ReviewCard extends React.Component {
  render() {
    let { imageUrl, ratings, feedbackText, userName, onEditPress } = this.props;

    return (
      <View
        style={{
          ...defaultStyles.card,
          borderRadius: 5,
          marginTop: 10,
          marginBottom: 20
        }}
      >
        <View
          style={{
            flexDirection: "row"
          }}
        >
          <View style={{ padding: 12 }}>
            <View
              style={{
                width: 68,
                height: 68,
                borderRadius: 35,
                backgroundColor: "#eee"
              }}
            >
              <Image
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 35
                }}
                source={{
                  uri: imageUrl
                }}
              />
            </View>
          </View>
          <View style={{ padding: 12, paddingLeft: 0, flex: 1 }}>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1, justifyContent: "center" }}>
                <View style={{ flexDirection: "row" }}>
                  <Text weight="Bold" style={{ fontSize: 13, flex: 1 }}>
                    {userName}
                  </Text>
                  <TouchableOpacity onPress={onEditPress}>
                    <Icon name="md-open" size={20} />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "baseline",
                    marginVertical: 4
                  }}
                >
                  <StarRating
                    starColor={colors.yellow}
                    disabled={true}
                    maxStars={5}
                    rating={Number(ratings)}
                    halfStarEnabled={true}
                    starSize={11}
                    starStyle={{ marginHorizontal: 0 }}
                  />
                  <Text
                    weight="Medium"
                    style={{
                      fontSize: 10,
                      marginLeft: 2,
                      color: colors.secondaryText
                    }}
                  >
                    ({ratings || 0})
                  </Text>
                </View>
                <Text style={{ fontSize: 9 }}>{feedbackText}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
