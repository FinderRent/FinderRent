import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import HouseDetailsScreen from "../screens/HouseDetailsScreen";
import LandlordHomeScreen from "../screens/LandlordHomeScreen";

const LandlordHomeStack = createNativeStackNavigator();

function LandlordHomeStackScreen({ navigation }) {
  const { isDarkMode } = useDarkMode();

  return (
    <LandlordHomeStack.Navigator
      screenOptions={{
        headerShown: false,
        headerTitle: "",
      }}
    >
      <LandlordHomeStack.Screen
        name="LandlordHomeScreen"
        component={LandlordHomeScreen}
        options={{
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
      {/* <LandlordHomeStack.Screen
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
      /> */}
    </LandlordHomeStack.Navigator>
  );
}

export default LandlordHomeStackScreen;
