import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { ListItem } from "react-native-elements";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Color } from "../../constants/colors";
import { useDarkMode } from "../../context/DarkModeContext";
import { iconName } from "../../utils/features";

const HouseAssets = (props) => {
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();

  const handleShowAllPress = () => {
    props.handleShowAllPress();
  };

  // Extract the first six objects that are true
  const trueKeys = Object.keys(props.apartmentContent).filter(
    (key) => props.apartmentContent[key]
  );
  const apartmentContent = trueKeys.slice(0, 6).filter((key) => key !== "_id");

  return (
    <View style={styles.seperator}>
      <Text style={styles.Header}>{t("whatThisPlaceOffers")}</Text>
      <View>
        {/* If more than 6 items */}
        {apartmentContent.length >= 6 &&
          apartmentContent.map((l, i) => (
            <ListItem
              containerStyle={
                isDarkMode
                  ? { backgroundColor: Color.darkTheme }
                  : { backgroundColor: Color.white }
              }
              key={i}
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
        {apartmentContent.length >= 6 && (
          <TouchableOpacity style={styles.Button} onPress={handleShowAllPress}>
            <Text style={styles.text}>{t("showAll")}</Text>
          </TouchableOpacity>
        )}
        {/* If fewer than 6 items */}
        {apartmentContent.length < 6 &&
          apartmentContent.map((l, i) => (
            <ListItem
              containerStyle={
                isDarkMode
                  ? { backgroundColor: Color.darkTheme }
                  : { backgroundColor: Color.white }
              }
              key={i}
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Header: {
    fontSize: 25,
    fontWeight: "bold",
  },
  Button: {
    fontSize: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ccc",
    marginVertical: 7,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
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

export default HouseAssets;
