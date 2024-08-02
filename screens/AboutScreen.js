import { StyleSheet, ScrollView, Platform, View } from "react-native";
import { Text } from "react-native-paper";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";

const AboutScreen = () => {
  const { isDarkMode } = useDarkMode();
  const tabBarHeight = useBottomTabBarHeight();
  const { t } = useTranslation();

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingTop: Platform.OS === "ios" ? 0 : 15,
        marginBottom: Platform.OS === "ios" ? 0 : tabBarHeight,
        backgroundColor: isDarkMode ? Color.darkTheme : Color.white,
        padding: 15,
      }}
    >
      <View style={styles.line}></View>
      <Text style={styles.title}>{t("aboutApp.title")}</Text>
      <View style={styles.line}></View>

      <Text style={styles.paragraph}>{t("aboutApp.welcome")}</Text>
      <Text style={styles.paragraph}>{t("aboutApp.platform")}</Text>
      <Text style={styles.subtitle}>{t("aboutApp.features.title")}</Text>
      <Text style={styles.bulletPoint}>
        • {t("aboutApp.features.centralized")}
      </Text>
      <Text style={styles.bulletPoint}>
        • {t("aboutApp.features.location")}
      </Text>
      <Text style={styles.bulletPoint}>
        • {t("aboutApp.features.preferences")}
      </Text>
      <Text style={styles.bulletPoint}>
        • {t("aboutApp.features.interface")}
      </Text>
      <Text style={styles.bulletPoint}>
        • {t("aboutApp.features.experience")}
      </Text>
      <Text style={styles.paragraph}>{t("aboutApp.mission")}</Text>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {/* Built with a lot of work and love by Amir Fukman and Maor Saadia. */}
        </Text>
        <Text
          style={{
            ...styles.footerText,
            marginTop: -55,
            fontFamily: "",
            fontSize: 14,
            color: isDarkMode ? Color.Brown100 : Color.Brown700,
          }}
        >
          {new Date().getFullYear()} &copy; {t("aboutApp.copyright")}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  line: {
    borderTopWidth: 2,
    borderColor: Color.Brown500,
    marginBottom: 10,
  },
  title: {
    marginBottom: 20,
    fontSize: 32,
    fontFamily: "DancingScript",
    color: Color.Blue500,
    textAlign: "center",
  },
  paragraph: {
    fontFamily: "Merienda",
    fontSize: 14,
    textAlign: "left",
  },
  subtitle: {
    fontFamily: "OrbitronMedium",
    fontSize: 20,
    marginVertical: 10,
    color: Color.Blue500,
  },
  bulletPoint: {
    fontFamily: "Merienda",
    fontSize: 14,
    marginVertical: 5,
    marginLeft: 20,
  },
  footer: {
    marginTop: 20,
    padding: 10,
    borderTopWidth: 2,
    borderColor: Color.Brown500,
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    fontFamily: "OrbitronMedium",
    color: Color.Blue100,
    textAlign: "center",
    marginBottom: 40,
  },
});

export default AboutScreen;
