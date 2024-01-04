// import * as NavigationBar from "expo-navigation-bar";
import { useCallback } from "react";
import { DrawerActions, useFocusEffect } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Ionicons from "react-native-vector-icons/Ionicons";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import CustomDrawer from "../components/CustomDrawer";
import MainTabScreen from "./MainTabScreen";
import ChatStackScreen from "./ChatStackScreen";

const Drawer = createDrawerNavigator();

function DrawerScreens({ navigation }) {
  const { isDarkMode } = useDarkMode();

  useFocusEffect(
    useCallback(() => {
      const closeDrawer = () => {
        navigation.dispatch(DrawerActions.closeDrawer());
      };

      closeDrawer();
      return () => {};
    }, [navigation])
  );

  // NavigationBar.setBackgroundColorAsync(
  //   isDarkMode ? Color.darkTheme : Color.white
  // );

  return (
    <Drawer.Navigator
      initialRouteName="MainTabScreen"
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: isDarkMode
          ? Color.defaultTheme
          : Color.darkTheme,
        drawerInactiveTintColor: isDarkMode
          ? Color.defaultTheme
          : Color.darkTheme,
        drawerActiveBackgroundColor: Color.Brown400,
        drawerLabelStyle: {
          marginLeft: -20,
          fontSize: 15,
        },
        swipeEdgeWidth: 300,
      }}
    >
      <Drawer.Screen
        name="בית"
        component={MainTabScreen}
        options={{
          swipeEdgeWidth: 0,
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="צאט"
        component={ChatStackScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="chatbox-ellipses-outline" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default DrawerScreens;
