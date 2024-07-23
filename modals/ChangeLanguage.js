import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  View,
  FlatList,
  Pressable,
  Image,
  Alert,
} from "react-native";
import { Text } from "react-native-paper";
import RNRestart from "react-native-restart";

// import { useTranslation } from "react-i18next";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import i18next, { languageResources } from "../services/i18next";
import languagesList from "../services/languagesList.json";

const ChangeLanguage = ({ showVisible }) => {
  const { isDarkMode } = useDarkMode();
  const [visible, setVisible] = useState(true);
  //   const { t } = useTranslation();

  const changeLng = (lng) => {
    if (lng === "he") {
      Alert.alert(
        "Restart Required",
        "The app needs to restart to apply RTL layout changes. Would you like to restart now?",
        [
          {
            text: "Restart",
            onPress: () => RNRestart.Restart(),
          },
          {
            text: "Later",
            style: "cancel",
          },
        ]
      );
    }
    i18next.changeLanguage(lng);
    showVisible(false);
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
        <View style={styles.modalContent}>
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
                  style={styles.languageButton}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.white,
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
  languageButton: {
    padding: 10,
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
  },
  lngName: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default ChangeLanguage;
