import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import SettingsScreen from "../screens/SettingsScreen";
import ContactUsScreen from "../screens/ContactUsScreen";

const SettingsStack = createNativeStackNavigator();

function SettingsStackScreen() {
  const { isDarkMode } = useDarkMode();

  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: isDarkMode ? Color.darkTheme : Color.defaultTheme,
        },
        headerTitleAlign: "center",
      }}
    >
      <SettingsStack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          headerShown: false,
        }}
      />
      <SettingsStack.Screen
        name="ContactUsScreen"
        component={ContactUsScreen}
        options={{
          headerStyle: {
            backgroundColor: isDarkMode
              ? Color.buttomSheetDarkTheme
              : Color.defaultTheme,
          },
          title: "ContactUs",
          headerTitleStyle: {
            fontFamily: "DancingScript",
            fontSize: 32,
            color: Color.Blue700,
          },
          headerTintColor: Color.Blue700,
          animation: "simple_push",
        }}
      />
    </SettingsStack.Navigator>
  );
}

export default SettingsStackScreen;
