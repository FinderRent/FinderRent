import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Avatar } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";

import { Color } from "../../constants/colors";
import { useUsers } from "../../context/UserContext";
import { useDarkMode } from "../../context/DarkModeContext";

const LandlordHeader = () => {
  const { isDarkMode } = useDarkMode();
  const { userData } = useUsers();
  const { t } = useTranslation();

  return (
    <LinearGradient
      colors={[
        isDarkMode ? Color.darkTheme : Color.defaultTheme,
        Color.Blue700,
      ]}
      start={{ x: -0.5, y: 0 }}
      end={{ x: 1, y: -2 }}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        <View style={styles.leftContainer}>
          <Text style={styles.greeting}>
            {t("hello")},{" " + userData.firstName}
          </Text>
          <Text style={styles.properties}>{t("yourProperties")}</Text>
        </View>
        <View style={styles.rightContainer}>
          <Avatar.Image
            size={80}
            source={{ uri: userData.avatar?.url }}
            style={[
              styles.avatar,
              isDarkMode && { backgroundColor: Color.darkTheme },
            ]}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    // zIndex: 10, // Ensures the header stays above other elements
    paddingTop: "15%",
    paddingBottom: "5%",
    paddingHorizontal: 16,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftContainer: {
    flex: 1,
  },
  rightContainer: {
    alignItems: "center",
  },
  greeting: {
    fontSize: 24,
    color: Color.white,
    opacity: 0.8,
  },
  name: {
    fontSize: 34,
    fontWeight: "bold",
    color: Color.white,
  },
  properties: {
    fontSize: 34,
    fontWeight: "bold",
    color: Color.white,
  },
  avatar: {
    borderColor: Color.white,
    backgroundColor: Color.white,
  },
});

export default LandlordHeader;
