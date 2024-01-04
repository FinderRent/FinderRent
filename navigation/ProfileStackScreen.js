import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import ProfileScreen from "../screens/ProfileScreen";
import EditProfileScreen from "../screens/EditProfileScreen";

const ProfileStack = createNativeStackNavigator();

function ProfileStackScreen({ navigation }) {
  const { isDarkMode } = useDarkMode();

  return (
    <ProfileStack.Navigator
      initialRouteName="StudentProfileScreen"
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: isDarkMode ? Color.Brown700 : Color.Brown100,
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
        name="פרופיל"
        component={ProfileScreen}
        options={{
          title: "",
          headerRight: () => (
            <View style={{ marginLeft: -10 }}>
              <Ionicons.Button
                name="ios-menu"
                size={25}
                color={Color.darkTheme}
                backgroundColor={isDarkMode ? Color.Brown700 : Color.Brown100}
                onPress={() => navigation.openDrawer()}
                // underlayColor="transparent"
              />
            </View>
          ),
          headerLeft: () => (
            <View style={{ marginRight: -10 }}>
              <MaterialCommunityIcons.Button
                name="account-edit"
                size={25}
                color={Color.darkTheme}
                backgroundColor={isDarkMode ? Color.Brown700 : Color.Brown100}
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
          headerTintColor: Color.darkTheme,
        }}
      />
    </ProfileStack.Navigator>
  );
}

export default ProfileStackScreen;
