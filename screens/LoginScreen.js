import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons';

import { Color } from '../constants/colors';
import { useUsers } from '../context/UserContext';
import SignInModal from '../modals/SignInModal';

function LoginScreen({ navigation, route }) {
  const { userData } = useUsers();

  const [showModal, setShowModal] = useState(false);
  const headerTitle = route.name;
  let screenName = null;

  if (headerTitle === 'Profile') {
    screenName = 'profile';
  }
  if (headerTitle === 'ChatListScreen') {
    screenName = 'chats';
  }

  useEffect(() => {
    if (userData.token === null) {
      navigation.setOptions({ headerShown: false });
    } else {
      navigation.setOptions({ headerShown: true });
    }
  }, [userData.token, navigation]);

  return (
    <View style={styles.container}>
      <FontAwesome5
        name="user-lock"
        size={100}
        color={Color.Blue200}
        style={styles.icon}
      />
      <Text style={styles.text}>Sign in to see the {screenName} screen.</Text>
      <Button
        style={{ margin: 20 }}
        buttonColor={Color.Blue700}
        textColor={Color.white}
        mode="elevated"
        onPress={() => setShowModal(true)}
      >
        SignIn
      </Button>
      {showModal && (
        <SignInModal showVisible={(showVisible) => setShowModal(showVisible)} />
      )}
    </View>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  icon: {
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
    color: Color.gray,
    fontFamily: 'varelaRound',
    fontSize: 17,
    letterSpacing: 0.3,
  },
});
