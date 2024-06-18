import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import ProfileScreen from "../screens/ProfileScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import LoginScreen from "../screens/LoginScreen";
import SecurityScreen from "../screens/SecurityScreen";
import FavoritesScreen from "../screens/FavoritesScreen";

const ProfileStack = createNativeStackNavigator();

function ProfileStackScreen({ navigation, route }) {
  const { isDarkMode } = useDarkMode();

  const { isAuthenticated } = route.params;
  let Screen = null;

  if (isAuthenticated) {
    Screen = ProfileScreen;
  } else {
    Screen = LoginScreen;
  }

  return (
    <ProfileStack.Navigator
      initialRouteName="ProfileScreen"
      screenOptions={{
        headerStyle: {
          backgroundColor: isDarkMode
            ? Color.buttomSheetDarkTheme
            : Color.defaultTheme,
        },
        drawerContentStyle: {
          backgroundColor: isDarkMode ? Color.darkTheme : Color.defaultTheme,
        },
        headerTitle: "",
        drawerActiveTintColor: !isDarkMode
          ? Color.darkTheme
          : Color.defaultTheme,
        drawerInactiveTintColor: !isDarkMode
          ? Color.darkTheme
          : Color.defaultTheme,
        drawerActiveBackgroundColor: Color.Brown400,
        drawerLabelStyle: {
          marginLeft: -20,
          fontSize: 15,
        },
      }}
    >
      <ProfileStack.Screen
        name="ProfileScreen"
        component={Screen}
        options={{
          title: "",
          headerRight: () => (
            <View style={{ marginRight: -10 }}>
              <MaterialCommunityIcons.Button
                name="account-edit"
                size={25}
                color={isDarkMode ? Color.white : Color.darkTheme}
                backgroundColor={
                  isDarkMode ? Color.buttomSheetDarkTheme : Color.defaultTheme
                }
                underlayColor="transparent"
                onPress={() => navigation.navigate("EditProfileScreen")}
              />
            </View>
          ),
        }}
      />
      <ProfileStack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{
          headerTintColor: isDarkMode ? Color.white : Color.darkTheme,
        }}
      />
      <ProfileStack.Screen
        name="SecurityScreen"
        component={SecurityScreen}
        options={{
          headerTintColor: isDarkMode ? Color.white : Color.darkTheme,
          presentation: "modal",
          animation: "fade_from_bottom",
        }}
      />
      <ProfileStack.Screen
        name="FavoritesScreen"
        component={FavoritesScreen}
        options={{
          headerTintColor: isDarkMode ? Color.white : Color.darkTheme,
          headerTitle: "My Favorites",
          headerTitleAlign: "center",
          headerTintColor: isDarkMode ? Color.white : Color.darkTheme,
          headerTitleStyle: { fontFamily: "varelaRound" },
          presentation: "modal",
          animation: "fade_from_bottom",
        }}
      />
    </ProfileStack.Navigator>
  );
}

export default ProfileStackScreen;
