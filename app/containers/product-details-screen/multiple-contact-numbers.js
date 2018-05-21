import React from "react";
import { Alert, View } from "react-native";
import call from "react-native-phone-call";
import { showSnackbar } from "../../utils/snackbar";

import { Text } from "../../elements";
import { colors } from "../../theme";

const MultipleContactNumbers = ({ contact = "" }) => {
  if (!contact || contact === "-")
    return (
      <Text weight="Medium" style={{ flex: 1, textAlign: "right" }}>
        -
      </Text>
    );

  //split by ',' or '/' or '\'
  let contactNumbers = contact.split(/,|\/|\\/);
  return (
    <View collapsable={false} 
      style={{
        flexDirection: "row",
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "flex-end",
        flexWrap: "wrap"
      }}
    >
      {contactNumbers.map(number => {
        if (!number) return null;
        return (
          <Text
            key={number}
            onPress={() =>
              call({ number: String(number) }).catch(e =>
                showSnackbar({
                  text: e.message
                })
              )
            }
            weight="Medium"
            style={{
              textDecorationLine: "underline",
              color: colors.tomato,
              textAlign: "right",
              marginLeft: 5
            }}
          >
            {number}
          </Text>
        );
      })}
    </View>
  );
};

export default MultipleContactNumbers;
