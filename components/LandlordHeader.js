import React from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import { Text } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { Color } from "../constants/colors";
import { useUsers } from "../context/UserContext";

const LandlordHeader = () => {
  const { userData } = useUsers();
  const { t } = useTranslation();

  return (
    <View style={styles.profileLocationView}>
      <View style={styles.midContainer}>
        <Text style={styles.Name}>
          {t("hello")}, {userData.firstName}
        </Text>
      </View>

      <View style={styles.midContainer}>
        <ImageBackground
          style={{ height: 60, width: 60 }}
          imageStyle={styles.profileImage}
          source={{
            uri: userData.avatar?.url,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileLocationView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  Name: {
    fontSize: 30,
    fontWeight: "bold",
  },
  profileImage: {
    borderRadius: 50,
    borderWidth: 0.5,
    borderColor: Color.gray,
  },
  midContainer: {
    padding: 10,
    marginRight: 5,
    flexDirection: "row",
    alignItems: "center",
  },
});
export default LandlordHeader;
