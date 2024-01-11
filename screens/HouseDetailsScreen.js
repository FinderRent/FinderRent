import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const DetailPage = ({ navigation, route }) => {
  return (
    <View>
      <Text>check</Text>
    </View>
  );
};

export default DetailPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  caption: {},
  image: {
    height: 450,
    width: null,
    marginBottom: 1,
    marginHorizontal: 16,
    borderRadius: 16,
  },
  bottomView: {
    alignItems: "center",
    flexDirection: "row",
    padding: 16,
  },
  content: {
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 16,
    paddingVertical: 8,
  },
  textContainer: {
    marginHorizontal: 16,
  },
  avatar: {
    height: 35,
    width: 35,
    borderRadius: 20,
  },
  rowView: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  icon: {
    marginHorizontal: 5,
  },
  text: {
    fontSize: 16,
  },
});
