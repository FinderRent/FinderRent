import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Color } from '../constants/colors';
import { useDarkMode } from '../context/DarkModeContext';
import { useUsers } from '../context/UserContext';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import LoginScreen from '../screens/LoginScreen';

const ProfileStack = createNativeStackNavigator();

function ProfileStackScreen({ navigation }) {
  const { userData } = useUsers();
  const { isDarkMode } = useDarkMode();

  // const [isLoggedIn, setIsLoggedIn] = useState();
  let Screen = null;

  if (userData.token === null) {
    Screen = LoginScreen;
  } else {
    Screen = ProfileScreen;
  }

  return (
    <ProfileStack.Navigator
      initialRouteName="StudentProfileScreen"
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
      }}
    >
      <ProfileStack.Screen
        name="פרופיל"
        component={Screen}
        options={{
          title: '',
          headerLeft: () => (
            <View style={{ marginLeft: -10 }}>
              <Ionicons.Button
                name="ios-menu"
                size={25}
                color={isDarkMode ? Color.white : Color.darkTheme}
                backgroundColor={
                  isDarkMode ? Color.buttomSheetDarkTheme : Color.defaultTheme
                }
                onPress={() => navigation.openDrawer()}
                // underlayColor="transparent"
              />
            </View>
          ),
          headerRight: () => (
            <View style={{ marginRight: -10 }}>
              <MaterialCommunityIcons.Button
                name="account-edit"
                size={25}
                color={isDarkMode ? Color.white : Color.darkTheme}
                backgroundColor={
                  isDarkMode ? Color.buttomSheetDarkTheme : Color.defaultTheme
                }
                underlayColor="transparent"
                onPress={() => navigation.navigate('EditProfileScreen')}
              />
            </View>
          ),
        }}
      />
      <ProfileStack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{
          headerTintColor: Color.darkTheme,
        }}
      />
    </ProfileStack.Navigator>
  );
}

export default ProfileStackScreen;
