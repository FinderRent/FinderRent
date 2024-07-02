import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import HomeScreen from "../screens/HomeScreen";
import HouseDetailsScreen from "../screens/HouseDetailsScreen";
import FilterScreen from "../screens/FilterScreen";
import StudentProfileScreen from "../screens/StudentProfileScreen";

const HomeStack = createNativeStackNavigator();

function HomeStackScreen({ navigation }) {
  const { isDarkMode } = useDarkMode();

  return (
    <HomeStack.Navigator
      screenOptions={{
        // headerShown: false,
        headerTitle: "",
      }}
    >
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name="HouseDetailsScreen"
        component={HouseDetailsScreen}
        options={{
          headerShown: true,
          headerRight: () => (
            <View style={{ marginLeft: -10 }}>
              <Ionicons.Button
                name="menu"
                size={25}
                color={Color.darkTheme}
                backgroundColor={isDarkMode ? Color.Brown700 : Color.Brown100}
                onPress={() => navigation.openDrawer()}
              />
            </View>
          ),
        }}
      />
      <HomeStack.Screen
        name="FilterScreen"
        component={FilterScreen}
        options={{
          presentation: "transparentModal",
          animation: "fade",
          headerTransparent: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                backgroundColor: isDarkMode
                  ? Color.buttomSheetDarkTheme
                  : Color.defaultTheme,
                borderColor: Color.gray,
                borderRadius: 20,
                borderWidth: 1,
                padding: 4,
              }}
            >
              <Ionicons
                name="close-outline"
                size={22}
                color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <HomeStack.Screen
        name="StudentProfileScreen"
        component={StudentProfileScreen}
        options={{
          headerShown: false,
          headerTintColor: isDarkMode ? Color.white : Color.darkTheme,
        }}
      />
    </HomeStack.Navigator>
  );
}

export default HomeStackScreen;
