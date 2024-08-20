import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { Button } from "react-native-elements";
import { useTranslation } from "react-i18next";

import { Color } from "../../constants/colors";
import { useDarkMode } from "../../context/DarkModeContext";
import SignInModal from "../../modals/SignInModal";

const SignInHeader = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();
  const [showSignInModal, setShowSignInModal] = useState(false);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.midContainer}>
          <View>
            <Text style={styles.text}>{t("signInPrompt")}</Text>
          </View>
        </View>

        <View style={styles.midContainer}>
          <Button
            title={t("signInButton")}
            buttonStyle={
              isDarkMode
                ? { backgroundColor: Color.defaultTheme }
                : { backgroundColor: Color.darkTheme }
            }
            titleStyle={
              isDarkMode
                ? {
                    color: Color.darkTheme,
                  }
                : { color: Color.defaultTheme }
            }
            onPress={() => setShowSignInModal(true)}
          />
        </View>
      </View>
      {showSignInModal && (
        <SignInModal
          showVisible={(showVisible) => setShowSignInModal(showVisible)}
        />
      )}
      <View style={styles.line}></View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: "500",
  },
  midContainer: {
    paddingTop: 15,
    paddingHorizontal: 15,
    // marginRight: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  // line: {
  //   marginTop: 10,
  //   marginHorizontal: 10,
  //   borderBottomWidth: 1.5,
  //   borderBottomColor: Color.Blue500,
  // },
});

export default SignInHeader;
