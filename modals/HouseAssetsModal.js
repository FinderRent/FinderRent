import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ListItem } from "react-native-elements";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useDarkMode } from "../context/DarkModeContext";
import { Color } from "../constants/colors";
import { Text } from "react-native-paper";
import { iconName } from "../utils/features";

function HouseAssetsModal(props) {
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();

  const handleShowAllPress = () => {
    props.handleShowAllPress();
  };

  return (
    <Modal visible={true} transparent={true} animationType="fade">
      <View style={styles.modalBackground}>
        <View
          style={
            isDarkMode
              ? { ...styles.modalContainer, backgroundColor: Color.darkTheme }
              : styles.modalContainer
          }
        >
          <Text style={styles.Header}>{t("whatThisPlaceOffers")}</Text>
          <ScrollView>
            {props.apartmentContent.map((l, i) => (
              <ListItem
                containerStyle={
                  isDarkMode
                    ? { backgroundColor: Color.darkTheme }
                    : { backgroundColor: Color.white }
                }
                key={i}
                bottomDivider
              >
                <ListItem.Content>
                  <View style={styles.rowContainer}>
                    <MaterialCommunityIcons
                      color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
                      name={iconName(l)}
                      style={styles.rowIcon}
                      size={24}
                    />
                    <ListItem.Title
                      style={
                        isDarkMode
                          ? { color: Color.white }
                          : { color: Color.darkTheme }
                      }
                    >
                      {t(`houseAssets.${l}`)}
                    </ListItem.Title>
                  </View>
                </ListItem.Content>
              </ListItem>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleShowAllPress}
          >
            <MaterialIcons name={t("close")} size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "95%",
    height: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: "5%",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "red",
    borderRadius: 20,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  Header: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: -10,
  },
  rowIcon: {
    marginRight: 10,
  },
});

export default HouseAssetsModal;
