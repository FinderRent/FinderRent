import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { MenuOption } from "react-native-popup-menu";
import { Feather } from "@expo/vector-icons";

import { Color } from "../../constants/colors";
import { useDarkMode } from "../../context/DarkModeContext";

function MenuItem({ text, icon, iconPack, onSelect }) {
  const { isDarkMode } = useDarkMode();

  const Icon = iconPack ?? Feather;
  return (
    <MenuOption onSelect={onSelect}>
      <View style={styles.menuItemContainer}>
        <Text
          style={
            isDarkMode
              ? { ...styles.menuText, color: Color.white }
              : { ...styles.menuText }
          }
        >
          {text}
        </Text>
        <Icon
          name={icon}
          size={18}
          color={isDarkMode ? Color.white : Color.darkTheme}
        />
      </View>
    </MenuOption>
  );
}

export default MenuItem;

const styles = StyleSheet.create({
  menuItemContainer: {
    flexDirection: "row",
    padding: 5,
  },
  menuText: {
    flex: 1,
    fontFamily: "regular",
    letterSpacing: 0.3,
    fontSize: 16,
  },
});
