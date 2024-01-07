import React from 'react';
import { Platform, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Updated import
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

  const theme = isDarkMode ? CustomDarkTheme : CustomDefaultTheme;

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
              height: Platform.OS === 'ios' ? 70 : 55,
              position: 'absolute',
              padding: Platform.OS === 'ios' ? 5 : 25,
            },
          }}
        >
          <Tab.Screen
            name="HomeStackScreen"
            component={HomeStackScreen}
            options={{
              tabBarLabel: '',
              tabBarIcon: ({ focused }) => (
                <View style={{ alignItems: 'center' }}>
                  <MaterialCommunityIcons
                    name={focused ? 'home' : 'home-outline'}
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
            name="ProfileScreen"
            component={ProfileStackScreen}
            options={{
              tabBarLabel: '',
              tabBarIcon: ({ focused }) => (
                <View style={{ alignItems: 'center' }}>
                  <MaterialCommunityIcons
                    name={focused ? 'account' : 'account-outline'}
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
            options={{
              tabBarLabel: '',
              tabBarIcon: ({ focused }) => (
                <View style={{ alignItems: 'center' }}>
                  <MaterialCommunityIcons
                    name={focused ? 'chat' : 'chat-outline'}
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
