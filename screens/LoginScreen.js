import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { Color } from '../constants/colors';
import SignInModal from '../modals/SignInModal';

function LoginScreen() {
  const [showModal, setShowModal] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sign in to see</Text>
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
  },
  text: {
    textAlign: 'center',
  },
});
