import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import HomeScreen from "../screens/HomeScreen";
import HouseDetailsScreen from "../screens/HouseDetailsScreen";

const HomeStack = createNativeStackNavigator();

function HomeStackScreen({ navigation }) {
  const { isDarkMode } = useDarkMode();

  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        headerTitle: "",
      }}
    >
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
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
    </HomeStack.Navigator>
  );
}

export default HomeStackScreen;
