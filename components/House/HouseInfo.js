import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const HouseInfo = () => {
  return (
    <View style={styles.container}>
      <View style={styles.innerInfo}>
        <Text style={styles.numberInfo}>3</Text>
        <Text style={styles.headerInfo}>Rooms</Text>
      </View>
      <View style={styles.line}></View>
      <View style={styles.innerInfo}>
        <Text style={styles.numberInfo}>2</Text>
        <Text style={styles.headerInfo}>Floor</Text>
      </View>
      <View style={styles.line}></View>
      <View style={styles.innerInfo}>
        <Text style={styles.numberInfo}>4</Text>
        <Text style={styles.headerInfo}>Roommates</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 15,
    height: 75,
    marginVertical: 10,
    flexDirection: "row",
  },
  innerInfo: {
    flex: 1,
    margin: 4,
    flexDirection: "col",
    marginVertical: 10,
  },
  numberInfo: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerInfo: {
    textAlign: "center",
  },
  line: {
    borderWidth: 1,
    margin: 8,
    borderColor: "#ccc",
  },
});

export default HouseInfo;
