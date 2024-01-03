import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Color } from '../constants/colors';
import { useDarkMode } from '../context/DarkModeContext';
import ChatListScreen from '../screens/ChatListScreen';
import ChatScreen from '../screens/ChatScreen';

const ChatStack = createNativeStackNavigator();

function ChatStackScreen({ navigation }) {
  const { isDarkMode } = useDarkMode();
  return (
    <ChatStack.Navigator
      initialRouteName="ChatListScreen"
      screenOptions={{
        headerStyle: {
          backgroundColor: isDarkMode ? Color.Brown700 : Color.Brown100,
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
          headerTitle: "צ'אטים",
          headerTitleAlign: 'center',
          headerTintColor: Color.darkTheme,
          // headerTitleStyle: { fontFamily: 'varelaRound' },
          headerRight: () => (
            <View style={{ marginLeft: -10 }}>
              <Ionicons.Button
                name="ios-menu"
                size={25}
                color={Color.darkTheme}
                backgroundColor={isDarkMode ? Color.Brown700 : Color.Brown100}
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
          // headerTitleStyle: { fontFamily: 'varelaRound' },
          headerBackVisible: false,
        }}
      />
    </ChatStack.Navigator>
  );
}

export default ChatStackScreen;
