import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { FontAwesome5 } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import { useUsers } from "../context/UserContext";
import SignInModal from "../modals/SignInModal";

function LoginScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();
  const { userData } = useUsers();

  const [showSignInModal, setShowSignInModal] = useState(false);

  const headerTitle = route.name;
  let screenName = null;

  if (headerTitle === "ProfileScreen") {
    screenName = t("profile");
  }
  if (headerTitle === "ChatListScreen") {
    screenName = t("chats");
  }

  useEffect(() => {
    if (userData.token === null) {
      navigation.setOptions({ headerShown: false });
    } else {
      navigation.setOptions({ headerShown: true });
    }
  }, [userData.token, navigation]);

  return (
    <View style={styles.container}>
      <FontAwesome5
        name="user-lock"
        size={100}
        color={isDarkMode ? Color.defaultTheme : Color.buttomSheetDarkTheme}
        style={styles.icon}
      />
      <Text style={styles.text}>{t("loginPrompt", { screenName })}</Text>

      <Button
        style={styles.button}
        buttonColor={
          isDarkMode ? Color.defaultTheme : Color.buttomSheetDarkTheme
        }
        textColor={isDarkMode ? Color.buttomSheetDarkTheme : Color.defaultTheme}
        mode="elevated"
        onPress={() => setShowSignInModal(true)}
      >
        {t("signInButton")}
      </Button>

      {showSignInModal && (
        <SignInModal
          showVisible={(showVisible) => setShowSignInModal(showVisible)}
        />
      )}
    </View>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  icon: {
    textAlign: "center",
  },
  text: {
    textAlign: "center",
    color: Color.gray,
    fontFamily: "varelaRound",
    fontSize: 17,
    letterSpacing: 0.3,
  },
  button: {
    margin: 10,
    marginHorizontal: 20,
  },
});
