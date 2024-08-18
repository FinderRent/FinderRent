import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import LottieView from "lottie-react-native";

import { useDarkMode } from "../../context/DarkModeContext";
import { Color } from "../../constants/colors";
import noApartmentsBlack from "../../assets/animations/noApartmentsBlack.json";
import noApartmentsWhite from "../../assets/animations/noApartmentsWhite.json";

const NoApartments = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();

  const getAnimations = (isDarkMode) => {
    return isDarkMode ? noApartmentsBlack : noApartmentsWhite;
  };

  return (
    <View style={styles.emptyContainer}>
      <LottieView
        source={getAnimations(isDarkMode)}
        autoPlay
        loop
        style={{ width: 400, height: 400 }}
      />
      <Text style={[styles.text, isDarkMode && { color: Color.Blue500 }]}>
        {t("addYourProperties")}
      </Text>
    </View>
  );
};

export default NoApartments;

const styles = StyleSheet.create({
  emptyContainer: {
    marginTop: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 28,
    fontWeight: "600",
    color: Color.Blue100,
    textAlign: "center",
    marginTop: -60,
  },
});
