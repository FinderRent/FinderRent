import { useLayoutEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Color } from '../constants/colors';
import { useDarkMode } from '../context/DarkModeContext';
import { useUsers } from '../context/UserContext';
import ChatListScreen from '../screens/ChatListScreen';
import ChatScreen from '../screens/ChatScreen';
import LoginScreen from '../screens/LoginScreen';

const ChatStack = createNativeStackNavigator();

function ChatStackScreen({ navigation, route }) {
  const { userData } = useUsers();
  const { isDarkMode } = useDarkMode();

  let Screen = null;

  if (userData.token === null) {
    Screen = LoginScreen;
  } else {
    Screen = ChatListScreen;
  }
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
          height: Platform.OS === 'ios' ? 70 : 55,
          position: 'absolute',
          padding: Platform.OS === 'ios' ? 5 : 25,
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
        component={Screen}
        options={{
          headerTitle: 'Chats',
          headerTitleAlign: 'center',
          headerTintColor: isDarkMode ? Color.white : Color.darkTheme,
          headerTitleStyle: { fontFamily: 'varelaRound' },
          // headerLeft: () => (
          //   <View style={{ marginLeft: -10 }}>
          //     <Ionicons.Button
          //       name="ios-menu"
          //       size={25}
          //       color={isDarkMode ? Color.white : Color.darkTheme}
          //       backgroundColor={
          //         isDarkMode ? Color.buttomSheetDarkTheme : Color.defaultTheme
          //       }
          //       underlayColor="transparent"
          //       onPress={() => navigation.openDrawer()}
          //     />
          //   </View>
          // ),
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
