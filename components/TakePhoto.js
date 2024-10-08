import { StyleSheet, View, Platform } from "react-native";
import {
  launchCameraAsync,
  requestCameraPermissionsAsync,
} from "expo-image-picker";
import { Button } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { useDarkMode } from "../context/DarkModeContext";
import { Color } from "../constants/colors";

function TakePhoto({ onTakeImage }) {
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();

  async function takeImageHandler() {
    if (Platform.OS === "ios") {
      const { status } = await requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert(t("cameraPermissionError"));
        return;
      }
    }

    const image = await launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!image.canceled) {
      onTakeImage(image.assets[0].uri);
    }
  }

  return (
    <View>
      <Button
        style={styles.button}
        textColor={isDarkMode ? Color.buttomSheetDarkTheme : Color.defaultTheme}
        buttonColor={
          isDarkMode ? Color.defaultTheme : Color.buttomSheetDarkTheme
        }
        mode="contained"
        onPress={takeImageHandler}
      >
        {t("takePicture")}
      </Button>
    </View>
  );
}

export default TakePhoto;

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
  button: {
    marginBottom: 15,
  },
});
