import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import SettingsScreen from "../screens/SettingsScreen";

const SettingsStack = createNativeStackNavigator();

function SettingsStackScreen({ navigation }) {
  const { isDarkMode } = useDarkMode();

  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: isDarkMode ? Color.Brown700 : Color.Brown100,
        },
        drawerContentStyle: {
          backgroundColor: isDarkMode ? Color.darkTheme : Color.defaultTheme,
        },
        headerTitle: "",
      }}
    >
      <SettingsStack.Screen name="SettingsScreen" component={SettingsScreen} />
    </SettingsStack.Navigator>
  );
}

export default SettingsStackScreen;
