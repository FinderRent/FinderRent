import * as NavigationBar from 'expo-navigation-bar';

import CustomDrawer from '../components/CustomDrawer';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Color } from '../constants/colors';
import { useDarkMode } from '../context/DarkModeContext';
import MainTabScreen from './MainTabScreen';
import ChatScreen from '../screens/ChatScreen';

const Drawer = createDrawerNavigator();

function DrawerScreens() {
  const { isDarkMode } = useDarkMode();

  NavigationBar.setBackgroundColorAsync(
    isDarkMode ? Color.darkTheme : Color.white
  );

  return (
    <Drawer.Navigator
      initialRouteName="MainTabScreen"
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
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
        swipeEdgeWidth: 300,
      }}
    >
      <Drawer.Screen
        name="בית"
        component={MainTabScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />
      {/* <Drawer.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            drawerIcon: ({ color }) => (
              <Ionicons name="person-outline" size={22} color={color} />
            ),
          }}
        /> */}
      <Drawer.Screen
        name="צאט"
        component={ChatScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="chatbox-ellipses-outline" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default DrawerScreens;
