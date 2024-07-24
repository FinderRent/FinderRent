import { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  View,
  FlatList,
  Pressable,
  Image,
} from "react-native";
import { Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from "expo-updates";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import i18next, { languageResources } from "../services/i18next";
import languagesList from "../services/languagesList.json";

const ChangeLanguage = ({ showVisible }) => {
  const { isDarkMode } = useDarkMode();
  const { t } = useTranslation();

  const [visible, setVisible] = useState(true);
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [lng, setLng] = useState(i18next.language);

  const handleRestart = async () => {
    i18next.changeLanguage(lng);
    setSelectedLanguage(lng);
    await Updates.reloadAsync();
  };

  const changeLng = async (lng) => {
    setLng(lng);
    await AsyncStorage.setItem("appLanguage", lng);
    setShowRestartModal(true);
  };

  const handleCancel = () => {
    showVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        visible={visible}
        onRequestClose={() => setVisible(false)}
        transparent={true}
      >
        <View
          style={
            isDarkMode
              ? { ...styles.modalContent, backgroundColor: Color.darkTheme }
              : styles.modalContent
          }
        >
          <Pressable onPress={handleCancel} style={styles.closeButton}>
            <Image
              source={require("../assets/images/close.png")}
              style={styles.closeIcon}
            />
          </Pressable>
          <View style={styles.languagesList}>
            <FlatList
              data={Object.keys(languageResources)}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={
                    isDarkMode
                      ? [styles.languageButtonWhite]
                      : [styles.languageButtonDark]
                  }
                  onPress={() => changeLng(item)}
                >
                  <Text style={styles.lngName}>
                    {languagesList[item].nativeName}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showRestartModal}
        onRequestClose={() => setShowRestartModal(false)}
      >
        <View style={styles.centeredView}>
          <View
            style={
              isDarkMode
                ? {
                    ...styles.modalView,
                    backgroundColor: Color.buttomSheetDarkTheme,
                  }
                : styles.modalView
            }
          >
            <Text style={styles.modalText}>{t("language_change_message")}</Text>
            <View style={styles.confirmation}>
              <TouchableOpacity
                style={{ right: 30 }}
                onPress={() => showVisible(false)}
              >
                <Text style={{ color: Color.Blue500 }}>{t("cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleRestart}>
                <Text style={{ color: Color.Blue500 }}>{t("confirm")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.white,
    padding: 60,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  closeIcon: {
    height: 35,
    width: 35,
  },
  languagesList: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  languageButtonDark: {
    padding: 10,
    borderBottomColor: Color.darkTheme,
    borderBottomWidth: 1,
  },
  languageButtonWhite: {
    padding: 10,
    borderBottomColor: Color.defaultTheme,
    borderBottomWidth: 1,
  },
  selectedLanguageButtonWhite: {
    backgroundColor: Color.defaultTheme,
  },
  selectedLanguageButtonDark: {
    backgroundColor: Color.darkTheme,
  },
  lngName: {
    fontSize: 16,
    textAlign: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: Color.Blue300,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  confirmation: {
    flexDirection: "row",
    marginTop: 25,
    justifyContent: "flex-end",
  },
});

export default ChangeLanguage;
