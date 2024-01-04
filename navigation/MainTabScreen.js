import { Platform, Text, View } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  MD3LightTheme as DefaultTheme,
  MD3DarkTheme as DarkTheme,
  Provider as PaperProvider,
} from 'react-native-paper';

import { Color } from '../constants/colors';
import HomeStackScreen from './HomeStackScreen ';
import ProfileStackScreen from './ProfileStackScreen';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useDarkMode } from '../context/DarkModeContext';
import ChatStackScreen from './ChatStackScreen';
import SignInModal from '../modals/SignInModal';
import { useUsers } from '../context/UserContext';
import { useState } from 'react';

const Tab = createMaterialBottomTabNavigator();

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

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const theme = isDarkMode ? CustomDarkTheme : CustomDefaultTheme;

  if (userData.token !== null) {
    setIsLoggedIn(true);
  }

  return (
    <BottomSheetModalProvider>
      <PaperProvider theme={theme}>
        <Tab.Navigator
          initialRouteName="HomeStackScreen"
          activeColor={isDarkMode ? Color.white : Color.black}
          inactiveColor={isDarkMode ? Color.white : Color.black}
          barStyle={{
            backgroundColor: isDarkMode ? Color.darkTheme : Color.white,
            borderTopColor: Color.Brown100,
            borderTopWidth: 1,
            marginTop: 20,
            height: Platform.OS === 'ios' ? 70 : 55,
            position: 'absolute',
            padding: 5,
          }}
        >
          <Tab.Screen
            name="HomeStackScreen"
            component={HomeStackScreen}
            options={{
              tabBarLabel: '',
              tabBarIcon: ({ focused, color }) => (
                <View style={{ alignItems: 'center' }}>
                  <MaterialCommunityIcons
                    name={focused ? 'home' : 'home-outline'}
                    style={{ marginTop: -10 }}
                    color={color}
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
            name="ProfileScreen"
            component={ProfileStackScreen}
            options={{
              tabBarLabel: '',
              tabBarIcon: ({ focused, color }) => (
                <View style={{ alignItems: 'center' }}>
                  <MaterialCommunityIcons
                    name={focused ? 'account' : 'account-outline'}
                    style={{ marginTop: -10 }}
                    color={color}
                    size={26}
                  />
                  <Text
                    style={{
                      fontSize: 10,
                      color: isDarkMode ? Color.white : Color.black,
                    }}
                  >
                    {isLoggedIn ? 'Profile' : 'Login'}
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
