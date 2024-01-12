import React from "react";
import { View, StyleSheet } from "react-native";

const seperator = () => {
  return <View style={styles.seperator}></View>;
};

const styles = StyleSheet.create({
  seperator: {
    height: 2,
    width: "100%",
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
});

export default seperator;
