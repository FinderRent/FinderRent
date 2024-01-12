import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Button, Text } from "react-native-paper";
import { ListItem } from "react-native-elements";

const HouseAssets = (props) => {
  const handleShowAllPress = () => {
    props.handleShowAllPress();
  };
  const slicedAssets = props.Assets.slice(0, 6);

  return (
    <View style={styles.seperator}>
      <Text style={styles.Header}>What this place offers</Text>
      <View>
        {/* if bigger than 6 items */}
        {props.Assets.length > 6 &&
          slicedAssets.map((l, i) => (
            <ListItem key={i}>
              <ListItem.Content>
                <ListItem.Title>{l.name}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}
        {props.Assets.length > 6 && (
          <TouchableOpacity style={styles.Button} onPress={handleShowAllPress}>
            <Text style={styles.text}>Show all</Text>
          </TouchableOpacity>
        )}
        {/* if shorter than 6 items */}
        {props.Assets.length < 6 &&
          props.Assets.map((l, i) => (
            <ListItem key={i}>
              <ListItem.Content>
                <ListItem.Title>{l.name}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Header: {
    fontSize: 25,
    fontWeight: "bold",
  },
  Button: {
    fontSize: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    elevation: 3,
    borderWidth: 2,
    borderColor: "#ccc",
    marginVertical: 7,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
  },
});

export default HouseAssets;
