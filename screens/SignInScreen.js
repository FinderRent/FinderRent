import { useState } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { Color } from '../constants/colors';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';
import NavLink from '../components/NavLink';

function SignInScreen({ navigation }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  return (
    <ImageBackground
      source={require('../assets/images/home-background.jpg')}
      resizeMode="cover"
      style={styles.image}
    >
      <View style={styles.container}>
        <View style={styles.text}>
          <Text variant="displaySmall" style={{ color: Color.Blue100 }}>
            ─── התחברות ───
          </Text>
        </View>

        <View style={styles.textInput}>
          <Input
            label="אימייל"
            keyboardType="email-address"
            mode="outlined"
            onValueChange={(selectedMail) => setEmail(selectedMail)}
          />
          <PasswordInput
            mode="outlined"
            label="סיסמה"
            onValueChange={(password) => setPassword(password)}
          />
        </View>

        <NavLink
          style={{ color: Color.Blue100 }}
          text="שכחתי סיסמה"
          routeName="ForgotPasswordScreen"
        />

        <NavLink
          style={{ color: Color.Blue100 }}
          text="אין לך חשבון? לחץ כאן להירשם "
          routeName="SignUpScreen"
        />

        <Button
          style={styles.textInput}
          buttonColor={Color.Blue800}
          textColor={Color.defaultTheme}
          mode="contained"
          onPress={() => console.log('preesed')}
        >
          התחבר
        </Button>
      </View>
    </ImageBackground>
  );
}

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0, 0.25)',
    opacity: 0.9,
  },
  image: {
    flex: 1,
  },
  text: {
    marginBottom: 20,
    alignItems: 'center',
  },
  textInput: {
    marginHorizontal: 6,
  },
});
