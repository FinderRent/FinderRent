import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { useTranslation } from "react-i18next";

const HouseRoommates = (props) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.viewContainer}>
        {/* <Image
          style={styles.roommatePhoto}
          source={require("../../assets/images/roommate.png")}
        /> */}
        <Text style={styles.Text}>{t("bestFor")}</Text>
        <Text style={[styles.Text, styles.numberInfo]}>
          {props.totalCapacity}
        </Text>
        <Text style={styles.Text}>{t("roommates")}</Text>
      </View>
      <View style={styles.line}></View>
      <View style={styles.viewContainer}>
        <Text style={styles.Text}>{t("thereAre")}</Text>
        <Text style={[styles.Text, styles.numberInfo]}>
          {Math.max(0, props.totalCapacity - props.realTimeCapacity)}
        </Text>
        <Text style={styles.Text}>{t("availableRooms")}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 15,
    height: 100,
    marginVertical: 10,
    flexDirection: "row",
  },
  viewContainer: {
    justifyContent: "center",
    flex: 1,
  },
  roommatePhoto: {
    height: 70,
    width: 70,
    marginVertical: 10,
  },
  Text: {
    fontSize: 15,
    textAlign: "center",
  },
  numberInfo: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 3,
  },
  line: {
    borderWidth: 1,
    margin: 8,
    borderColor: "#ccc",
  },
});

export default HouseRoommates;
