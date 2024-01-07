import React, { useEffect, useState } from "react";
import { Platform, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"; // Updated import
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  MD3LightTheme as DefaultTheme,
  MD3DarkTheme as DarkTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import { useUsers } from "../context/UserContext";
import HomeStackScreen from "./HomeStackScreen ";
import ProfileStackScreen from "./ProfileStackScreen";
import ChatStackScreen from "./ChatStackScreen";
import SignInModal from "../modals/SignInModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createBottomTabNavigator();

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    secondaryContainer: Color.darkTheme,
    text: Color.white,
  },
};

const CustomDefaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    secondaryContainer: Color.white,
    text: Color.black,
  },
};

function MainTabScreen() {
  const { userData } = useUsers();
  const { isDarkMode } = useDarkMode();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const theme = isDarkMode ? CustomDarkTheme : CustomDefaultTheme;

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem("token");

      if (storedToken) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }

    fetchToken();
  }, [userData]);

  return (
    <BottomSheetModalProvider>
      <PaperProvider theme={theme}>
        <Tab.Navigator
          initialRouteName="HomeStackScreen"
          screenOptions={{
            headerShown: false,
            // keyboardHidesTabBar: true,
            tabBarHideOnKeyboard: true,
            activeTintColor: isDarkMode ? Color.white : Color.black,
            inactiveTintColor: isDarkMode ? Color.white : Color.black,
            tabBarStyle: {
              backgroundColor: isDarkMode ? Color.darkTheme : Color.white,
              borderTopColor: Color.Brown100,
              borderTopWidth: 1,
              height: Platform.OS === "ios" ? "9.5%" : 55,
              position: "absolute",
              padding: Platform.OS === "ios" ? "6%" : 25,
            },
          }}
        >
          <Tab.Screen
            name="HomeStackScreen"
            component={HomeStackScreen}
            options={{
              tabBarLabel: "",
              tabBarIcon: ({ focused }) => (
                <View style={{ alignItems: "center" }}>
                  <MaterialCommunityIcons
                    name={focused ? "home" : "home-outline"}
                    style={{ marginTop: -10 }}
                    color={isDarkMode ? Color.white : Color.darkTheme}
                    size={26}
                  />
                  <Text
                    style={{
                      fontSize: 10,
                      color: isDarkMode ? Color.white : Color.black,
                    }}
                  >
                    Home
                  </Text>
                </View>
              ),
            }}
          />
          <Tab.Screen
            name="ProfileStackScreen"
            component={ProfileStackScreen}
            initialParams={{ isAuthenticated }}
            listeners={({ navigation }) => ({
              tabPress: (e) => {
                e.preventDefault();
                navigation.navigate("ProfileStackScreen", {
                  isAuthenticated,
                });
              },
            })}
            options={{
              tabBarLabel: "",
              tabBarIcon: ({ focused }) => (
                <View style={{ alignItems: "center" }}>
                  <MaterialCommunityIcons
                    name={focused ? "account" : "account-outline"}
                    style={{ marginTop: -10 }}
                    color={isDarkMode ? Color.white : Color.darkTheme}
                    size={26}
                  />
                  <Text
                    style={{
                      fontSize: 10,
                      color: isDarkMode ? Color.white : Color.black,
                    }}
                  >
                    Profile
                  </Text>
                </View>
              ),
            }}
          />
          <Tab.Screen
            name="ChatStackScreen"
            component={ChatStackScreen}
            initialParams={{ isAuthenticated }}
            listeners={({ navigation }) => ({
              tabPress: (e) => {
                e.preventDefault();
                navigation.navigate("ChatStackScreen", {
                  isAuthenticated,
                });
              },
            })}
            options={{
              tabBarLabel: "",
              tabBarIcon: ({ focused }) => (
                <View style={{ alignItems: "center" }}>
                  <MaterialCommunityIcons
                    name={focused ? "chat" : "chat-outline"}
                    style={{ marginTop: -10 }}
                    color={isDarkMode ? Color.white : Color.darkTheme}
                    size={26}
                  />
                  <Text
                    style={{
                      fontSize: 10,
                      color: isDarkMode ? Color.white : Color.black,
                    }}
                  >
                    Chats
                  </Text>
                </View>
              ),
            }}
          />
        </Tab.Navigator>
      </PaperProvider>
    </BottomSheetModalProvider>
  );
}

export default MainTabScreen;
