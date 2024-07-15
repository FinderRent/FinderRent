import { useLayoutEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import ChatListScreen from "../screens/ChatListScreen";
import ChatScreen from "../screens/ChatScreen";
import LoginScreen from "../screens/LoginScreen";
import { Platform } from "react-native";

const ChatStack = createNativeStackNavigator();

function ChatStackScreen({ navigation, route }) {
  const { isDarkMode } = useDarkMode();

  const { isAuthenticated } = route.params;
  let Screen = null;

  if (isAuthenticated) {
    Screen = ChatListScreen;
  } else {
    Screen = LoginScreen;
  }

  useLayoutEffect(() => {
    const tabHiddenRoutes = ["ChatScreen"];
    if (tabHiddenRoutes.includes(getFocusedRouteNameFromRoute(route))) {
      navigation.setOptions({ tabBarStyle: { display: "none" } });
    } else {
      navigation.setOptions({
        tabBarStyle: {
          backgroundColor: isDarkMode ? Color.darkTheme : Color.white,
          borderTopColor: Color.Brown100,
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? "9.5%" : "7%",
          position: "absolute",
          padding: Platform.OS === "ios" ? "6%" : "6%",
        },
      });
    }
  });

  return (
    <ChatStack.Navigator
      initialRouteName="ChatListScreen"
      screenOptions={{
        headerStyle: {
          backgroundColor: isDarkMode
            ? Color.buttomSheetDarkTheme
            : Color.defaultTheme,
        },
      }}
    >
      <ChatStack.Screen
        name="ChatListScreen"
        component={Screen}
        options={{
          headerTitle: "Chats",
          headerTitleAlign: "center",
          headerTintColor: isDarkMode ? Color.white : Color.darkTheme,
          headerTitleStyle: { fontFamily: "varelaRound" },
          headerBackVisible: false,
          headerSearchBarOptions: {
            // headerIconColor: isDarkMode ? Color.defaultTheme : Color.darkTheme,
            // textColor: isDarkMode ? Color.defaultTheme : Color.darkTheme,
          },
        }}
      />
      <ChatStack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          headerTintColor: Color.darkTheme,
          headerTitle: "",
          headerTitleStyle: { fontFamily: "varelaRound" },
          headerBackVisible: false,
        }}
      />
    </ChatStack.Navigator>
  );
}

export default ChatStackScreen;
