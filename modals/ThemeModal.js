import { useState } from "react";
import {
  View,
  Modal,
  Pressable,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { RadioButton, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";

function ThemeModal({ showVisible, appTheme, handleThemeChange }) {
  const { isDarkMode, handleTheme } = useDarkMode();
  const { t } = useTranslation();

  const [themeVisible, setThemeVisible] = useState(true);
  const [theme, setTheme] = useState(appTheme);

  const handleCancel = () => {
    setThemeVisible(!themeVisible);
    showVisible(!themeVisible);
  };

  const handleAppTheme = (theme) => {
    console.log(theme);
    setTheme(theme);
    handleTheme(theme);
    handleThemeChange(theme);
  };

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={themeVisible}
        onRequestClose={() => {
          showVisible(!themeVisible);
        }}
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
            <Pressable
              onPress={() => handleCancel()}
              style={{ position: "absolute", margin: 12 }}
            >
              <Image
                source={require("../assets/images/close.png")}
                style={{ height: 25, width: 25 }}
              />
            </Pressable>

            <Text style={styles.modalText}>{t("choose_theme")}</Text>
            <View style={styles.radioButtom}>
              <RadioButton
                color={Color.Blue500}
                status={theme === "SystemDefault" ? "checked" : "unchecked"}
                onPress={() => handleAppTheme("SystemDefault")}
              />
              <Text style={styles.textRadio}>{t("SystemDefault")}</Text>
            </View>
            <View style={styles.radioButtom}>
              <RadioButton
                color={Color.Blue500}
                status={theme === "Bright" ? "checked" : "unchecked"}
                onPress={() => handleAppTheme("Bright")}
              />
              <Text style={styles.textRadio}>{t("Bright")}</Text>
            </View>
            <View style={styles.radioButtom}>
              <RadioButton
                color={Color.Blue500}
                status={theme === "Dark" ? "checked" : "unchecked"}
                onPress={() => handleAppTheme("Dark")}
              />
              <Text style={styles.textRadio}>{t("Dark")}</Text>
            </View>
            <View style={styles.confirmation}>
              {/* <TouchableOpacity style={{ right: 30 }} onPress={handleCancel}>
                <Text style={{ color: Color.Blue500 }}>Cancel</Text>
              </TouchableOpacity> */}
              <TouchableOpacity onPress={() => showVisible(false)}>
                <Text style={{ color: Color.Blue500 }}>{t("confirm")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default ThemeModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
  },
  modalView: {
    margin: 20,
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
  modalText: {
    marginTop: 10,
    marginHorizontal: -5,
    fontSize: 24,
    fontWeight: "900",
    color: Color.Blue700,
  },
  radioButtom: {
    paddingTop: 10,
    marginHorizontal: -5,
    flexDirection: "row",
  },
  textRadio: {
    paddingTop: 10,
  },
  confirmation: {
    flexDirection: "row",
    marginTop: 25,
    justifyContent: "flex-end",
  },
});
