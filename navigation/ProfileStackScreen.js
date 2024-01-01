import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Color } from '../constants/colors';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

const ProfileStack = createNativeStackNavigator();

function ProfileStackScreen({ navigation }) {
  return (
    <ProfileStack.Navigator
      initialRouteName="StudentProfileScreen"
      screenOptions={{
        headerStyle: {
          backgroundColor: Color.Brown100,
        },
        drawerContentStyle: {
          backgroundColor: Color.defaultTheme,
        },
        headerTitle: '',
        drawerActiveTintColor: Color.defaultTheme,
        drawerInactiveTintColor: Color.defaultTheme,
        drawerActiveBackgroundColor: Color.Brown400,
        drawerLabelStyle: {
          marginLeft: -20,
          fontSize: 15,
        },
      }}
    >
      <ProfileStack.Screen
        name="פרופיל"
        component={ProfileScreen}
        options={{
          title: '',
          headerRight: () => (
            <View style={{ marginLeft: -10 }}>
              <Ionicons.Button
                name="ios-menu"
                size={25}
                color={Color.darkTheme}
                backgroundColor={Color.Brown100}
                onPress={() => navigation.openDrawer()}
                // underlayColor="transparent"
              />
            </View>
          ),
          headerLeft: () => (
            <View style={{ marginRight: -10 }}>
              <MaterialCommunityIcons.Button
                name="account-edit"
                size={25}
                color={Color.darkTheme}
                backgroundColor={Color.Brown100}
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
