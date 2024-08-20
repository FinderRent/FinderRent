import React from "react";
import { View, StyleSheet } from "react-native";

const Separator = () => {
  return <View style={styles.separator} testID="separator-view"></View>;
};

const styles = StyleSheet.create({
  separator: {
    height: 2,
    width: "100%",
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
});

export default Separator;
