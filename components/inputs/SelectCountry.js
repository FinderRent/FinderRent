import { useState } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { CountryPicker } from "react-native-country-codes-picker";
import { useTranslation } from "react-i18next";

import { Color } from "../../constants/colors";
import { useDarkMode } from "../../context/DarkModeContext";

const SelectCountry = ({ onCountryChange }) => {
  const { t, i18n } = useTranslation();
  const { isDarkMode } = useDarkMode();

  const lang = i18n.language;
  const [show, setShow] = useState(false);
  const [countryName, setCountryName] = useState("");

  const handleCountrySelect = (item) => {
    const selectedCountry = item.name[lang] || item.name.en;
    setCountryName(selectedCountry);
    setShow(false);
    if (onCountryChange) {
      onCountryChange(selectedCountry);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity
        onPress={() => setShow(true)}
        style={{
          backgroundColor: isDarkMode ? Color.darkTheme : Color.white,
          borderColor: isDarkMode ? Color.extraGray : Color.darkTheme,
          padding: 12,
          paddingHorizontal: 40,
          borderRadius: 5,
          borderWidth: 1,
        }}
      >
        <Text
          style={{ color: isDarkMode ? Color.defaultTheme : Color.darkTheme }}
        >
          {countryName || t("signUp.selectCountry")}
        </Text>
      </TouchableOpacity>

      <CountryPicker
        show={show}
        lang={lang}
        searchMessage={t("signUp.searchYourCountry")}
        pickerButtonOnPress={handleCountrySelect}
        onBackdropPress={() => setShow(false)}
        style={{
          modal: {
            height: 400,
            backgroundColor: isDarkMode ? Color.darkTheme : Color.defaultTheme,
          },
          line: {
            backgroundColor: Color.Blue100,
          },
          countryButtonStyles: {
            backgroundColor: isDarkMode ? Color.darkTheme : Color.defaultTheme,
          },
          itemsList: {
            backgroundColor: isDarkMode ? Color.darkTheme : Color.defaultTheme,
          },
          textInput: {
            backgroundColor: isDarkMode
              ? Color.buttomSheetDarkTheme
              : Color.white,
            color: isDarkMode ? Color.defaultTheme : Color.darkTheme,
          },
          countryButtonStyles: {
            backgroundColor: isDarkMode
              ? Color.buttomSheetDarkTheme
              : Color.white,
            height: 60,
          },
          dialCode: {
            color: isDarkMode ? Color.buttomSheetDarkTheme : Color.white,
            marginRight: -50,
          },
          countryName: {
            color: isDarkMode ? Color.defaultTheme : Color.darkTheme,
            marginRight: 50,
          },
        }}
      />
    </View>
  );
};

export default SelectCountry;
