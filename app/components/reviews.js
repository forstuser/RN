import React from "react";
import { View, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import StarRating from "react-native-star-rating";

import { API_BASE_URL } from "../api";
import { Text, Button } from "../elements";

import { colors, defaultStyles } from "../theme";

const Review = ({ imageUrl, name, ratings, reviewText }) => (
  <View style={{ flexDirection: "row", marginVertical: 3 }}>
    <View style={{ width: 35, marginRight: 10 }}>
      {imageUrl ? (
        <Image
          style={{ width: 35, height: 35, borderRadius: 18 }}
          source={{ uri: imageUrl }}
        />
      ) : (
        <View>
          <Icon name="md-contact" size={43} color={colors.secondaryText} />
        </View>
      )}
    </View>
    <View style={{ flex: 1 }}>
      <Text weight="Medium" style={{ fontSize: 11, marginTop: 5 }}>
        {name}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "baseline"
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
          ({ratings})
        </Text>
      </View>

      <Text style={{ fontSize: 12, marginTop: 3 }}>{reviewText}</Text>
    </View>
  </View>
);

export default ({ reviews }) => (
  <View>
    {reviews.map(review => (
      <Review
        key={review.id}
        imageUrl={
          review.user.image_name
            ? API_BASE_URL + `/customer/${review.user.id}/images`
            : null
        }
        name={review.user.name}
        ratings={review.review_ratings.toFixed(2)}
        reviewText={review.review_feedback}
      />
    ))}
  </View>
);
