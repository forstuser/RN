import React from "react";
import { View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { Text, Image, Button } from "../../elements";
import { colors } from "../../theme";

export default class Statuses extends React.Component {
  render() {
    const statusDone = 0;
    const isStatusModified = false;

    let statuses = [
      {
        id: 1,
        text: "Order Placed"
      },

      {
        id: 2,
        text: "Accepted"
      }
    ];

    if (isStatusModified) {
      statuses = [
        ...statuses,
        {
          id: 3,
          text: "Order Modified"
        },
        {
          id: 4,
          text: "Modification Approved"
        }
      ];
    }

    return (
      <View style={{ padding: 16 }}>
        <Text weight="Bold" style={{ fontSize: 13.5 }}>
          Status
        </Text>
        <View>
          <View
            style={{
              position: "absolute",
              left: 10,
              top: 15,
              bottom: 15,
              width: 1,
              backgroundColor: "#cccccc"
            }}
          />
          {statuses.map((status, index) => {
            return (
              <View
                style={{ flexDirection: "row", paddingVertical: 12 }}
                key={status.id}
              >
                <View
                  style={{
                    width: 21,
                    height: 21,
                    borderRadius: 11,
                    borderWidth: 1,
                    borderColor:
                      index <= statusDone
                        ? colors.success
                        : colors.secondaryText,
                    backgroundColor: "#fff",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {index <= statusDone && (
                    <Icon name="md-checkmark" color={colors.success} />
                  )}
                </View>
                <Text
                  style={{
                    marginLeft: 18,
                    color:
                      index <= statusDone
                        ? colors.mainText
                        : colors.secondaryText
                  }}
                >
                  {status.text}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
}
