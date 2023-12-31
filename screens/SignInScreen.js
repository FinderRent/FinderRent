import { useState } from 'react';
import { ImageBackground, StyleSheet, View, SafeAreaView } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { Color } from '../constants/colors';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';
import NavLink from '../components/NavLink';

function SignInScreen({ navigation }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
            style={{ color: Color.Blue50 }}
            text="שכחתי סיסמה"
            routeName="ForgotPasswordScreen"
          />

          <NavLink
            style={{ color: Color.Blue50 }}
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

          <Button
            style={{ margin: 20 }}
            buttonColor={Color.Brown500}
            textColor={Color.white}
            mode="elevated"
            onPress={() => navigation.navigate('DrawerScreens')}
          >
            עמוד הבית
          </Button>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0, 0.35)',
    opacity: 0.85,
  },
  image: {
    flex: 1,
  },
  text: {
    marginBottom: 20,
    alignItems: 'center',
  },
  textInput: {
    marginHorizontal: 15,
  },
});
