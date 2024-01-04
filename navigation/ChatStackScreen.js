import { useLayoutEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Color } from '../constants/colors';
import { useDarkMode } from '../context/DarkModeContext';
import ChatListScreen from '../screens/ChatListScreen';
import ChatScreen from '../screens/ChatScreen';

const ChatStack = createNativeStackNavigator();

function ChatStackScreen({ navigation, route }) {
  const { isDarkMode } = useDarkMode();

  useLayoutEffect(() => {
    const tabHiddenRoutes = ['ChatScreen'];
    if (tabHiddenRoutes.includes(getFocusedRouteNameFromRoute(route))) {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.setOptions({
        tabBarStyle: {
          backgroundColor: isDarkMode ? Color.darkTheme : Color.white,
          borderTopColor: Color.Brown100,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 70 : 60,
          position: 'absolute',
          padding: Platform.OS === 'ios' ? 5 : 20,
        },
      });
    }
  });

  return (
    <ChatStack.Navigator
      initialRouteName="ChatListScreen"
      screenOptions={{
        headerStyle: {
          backgroundColor: isDarkMode
            ? Color.buttomSheetDarkTheme
            : Color.defaultTheme,
        },
        drawerContentStyle: {
          backgroundColor: isDarkMode ? Color.darkTheme : Color.defaultTheme,
        },
        headerTitle: '',
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
      }}
    >
      <ChatStack.Screen
        name="ChatListScreen"
        component={ChatListScreen}
        options={{
          headerTitle: 'ChatsList',
          headerTitleAlign: 'center',
          headerTintColor: isDarkMode ? Color.white : Color.darkTheme,
          headerTitleStyle: { fontFamily: 'varelaRound' },
          headerLeft: () => (
            <View style={{ marginLeft: -10 }}>
              <Ionicons.Button
                name="ios-menu"
                size={25}
                color={isDarkMode ? Color.white : Color.darkTheme}
                backgroundColor={
                  isDarkMode ? Color.buttomSheetDarkTheme : Color.defaultTheme
                }
                underlayColor="transparent"
                onPress={() => navigation.openDrawer()}
              />
            </View>
          ),
        }}
      />
      <ChatStack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          headerTintColor: Color.darkTheme,
          headerTitle: '',
          headerTitleStyle: { fontFamily: 'varelaRound' },
          headerBackVisible: false,
        }}
      />
    </ChatStack.Navigator>
  );
}

export default ChatStackScreen;
