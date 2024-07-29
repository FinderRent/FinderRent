import { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  I18nManager,
} from "react-native";
import { Switch, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { version as app_version } from "../package.json";
import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import ThemeModal from "../modals/ThemeModal";
import i18next from "../services/i18next";
import ChangeLanguage from "../modals/ChangeLanguage";

const SECTIONS = [
  {
    header: "preferences",
    items: [
      { id: "language", icon: "earth", label: "language", type: "select" },
      { id: "theme", icon: "theme-light-dark", label: "theme", type: "link" },
      {
        id: "notifications",
        icon: "bell-outline",
        label: "allowNotifications",
        type: "toggle",
      },
    ],
  },
  {
    header: "help",
    items: [
      {
        id: "about",
        icon: "information-outline",
        label: "about",
        type: "link",
      },
      {
        id: "contact",
        icon: "email-outline",
        label: "contactUs",
        type: "link",
      },
    ],
  },
];

function SettingsScreen() {
  const { isDarkMode, handleTheme, theme } = useDarkMode();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const [form, setForm] = useState({
    language: "",
    notifications: true,
  });

  useEffect(() => {
    let newLang = "";

    switch (i18next.language) {
      case "en":
        newLang = "English";
        break;
      case "he":
        newLang = "עברית";
        break;
      case "ru":
        newLang = "русский";
        break;
      case "ar":
        newLang = "العربية";
        break;
    }

    setForm((prevForm) => ({
      ...prevForm,
      language: newLang,
    }));
  }, [i18next.language]);

  const handlePress = (id) => {
    switch (id) {
      case "language":
        setShowLanguageModal(true);
        break;
      case "about":
        navigation.navigate("AboutScreen");
        break;
      case "contact":
        navigation.navigate("ContactUsScreen");
        break;
      case "theme":
        setShowThemeModal(true);
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView
      style={
        isDarkMode
          ? { flex: 1, backgroundColor: Color.darkTheme }
          : { flex: 1, backgroundColor: Color.defaultTheme }
      }
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("settings")}</Text>
        </View>

        {SECTIONS.map(({ header, items }) => (
          <View style={styles.section} key={header}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{t(header)}</Text>
            </View>
            <View style={styles.sectionBody}>
              {items.map(({ id, label, icon, type, value }, index) => {
                return (
                  <View
                    key={id}
                    style={
                      isDarkMode
                        ? {
                            ...styles.rowWrapper,
                            backgroundColor: Color.buttomSheetDarkTheme,
                          }
                        : styles.rowWrapper
                    }
                  >
                    {type === "toggle" ? (
                      <TouchableWithoutFeedback>
                        <View style={styles.row}>
                          <MaterialCommunityIcons
                            color={Color.extraGray}
                            name={icon}
                            style={styles.rowIcon}
                            size={22}
                          />
                          <Text style={styles.rowLabel}>{t(label)}</Text>
                          <View style={styles.rowSpacer} />
                          <Switch
                            color={Color.Blue100}
                            onChange={() =>
                              setForm((prevForm) => ({
                                ...prevForm,
                                notifications: !prevForm.notifications,
                              }))
                            }
                            value={form.notifications}
                          />
                        </View>
                      </TouchableWithoutFeedback>
                    ) : (
                      <TouchableOpacity onPress={() => handlePress(id)}>
                        <View style={styles.row}>
                          <MaterialCommunityIcons
                            color={Color.extraGray}
                            name={icon}
                            style={styles.rowIcon}
                            size={22}
                          />
                          <Text style={styles.rowLabel}>{t(label)}</Text>
                          <View style={styles.rowSpacer} />
                          {type === "select" && (
                            <Text style={styles.rowValue}>{form[id]}</Text>
                          )}
                          {(type === "select" || type === "link") && (
                            <MaterialCommunityIcons
                              color={Color.extraGray}
                              name={
                                I18nManager.isRTL
                                  ? "chevron-left"
                                  : "chevron-right"
                              }
                              size={22}
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        ))}
        {showThemeModal && (
          <ThemeModal
            showVisible={(showVisible) => setShowThemeModal(showVisible)}
            handleTheme={handleTheme}
            appTheme={theme}
          />
        )}
        {showLanguageModal && (
          <ChangeLanguage
            showVisible={(showVisible) => setShowLanguageModal(showVisible)}
            // handleTheme={handleTheme}
            // appTheme={theme}
          />
        )}
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.name}>FindeRent</Text>
        <Text style={styles.version}>
          {t("version")}: {app_version}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: "20%",
  },
  section: {
    paddingTop: 12,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: Color.extraGray,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  sectionBody: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Color.gray,
  },
  header: {
    paddingLeft: 24,
    paddingRight: 24,
    marginBottom: 12,
  },
  title: {
    // fontFamily: "OrbitronMedium",
    // color: Color.Blue500,
    // textAlign: "center",
    fontSize: 34,
    fontWeight: "700",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingRight: 24,
    height: 50,
  },
  rowWrapper: {
    paddingLeft: 24,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: Color.gray,
  },
  rowIcon: {
    marginRight: 12,
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: "500",
  },
  rowValue: {
    fontSize: 17,
    color: Color.extraGray,
    marginRight: 4,
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  footer: {
    marginBottom: 70,
    alignItems: "center",
  },
  name: {
    color: Color.Blue700,
    fontSize: 30,
    fontFamily: "DancingScript",
    letterSpacing: 0.6,
  },
  version: {
    marginTop: -5,
    fontSize: 13,
    fontFamily: "Merienda",
    color: Color.extraGray,
  },
});

export default SettingsScreen;
