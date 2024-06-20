import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import LandlordHouseDetailsScreen from "../screens/LandlordHouseDetailsScreen";
import LandlordHomeScreen from "../screens/LandlordHomeScreen";
import EditApartmentScreen from "../screens/EditApartmentScreen";

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
      {/* <LandlordHomeStack.Screen name="HomeScreen" component={HomeScreen} /> */}
      <LandlordHomeStack.Screen
        name="LandlordHouseDetailsScreen"
        component={LandlordHouseDetailsScreen}
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
      <LandlordHomeStack.Screen
        name="EditApartmentScreen"
        component={EditApartmentScreen}
        options={{
          headerTintColor: isDarkMode ? Color.white : Color.darkTheme,
        }}
      />
    </LandlordHomeStack.Navigator>
  );
}

export default LandlordHomeStackScreen;
