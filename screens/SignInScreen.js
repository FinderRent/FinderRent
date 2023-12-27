import { useState } from 'react';
import { ImageBackground, StyleSheet, View, SafeAreaView } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { Color } from '../constants/colors';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';
import NavLink from '../components/NavLink';

function SignInScreen({ navigation, route }) {
  const { userType } = route.params;

  // console.log(userType);

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/images/Zinc.jpg')}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.container}>
          <View style={styles.text}>
            <Text variant="displaySmall" style={{ color: Color.Blue800 }}>
              התחברות
            </Text>
          </View>

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

          <NavLink
            text="שכחתי סיסמה"
            routeName="ForgotPasswordScreen"
            props={{ userType: userType }}
          />

          {userType === 'student' ? (
            <NavLink
              text="אין לך חשבון? לחץ כאן להירשם "
              props={{ userType: userType }}
              routeName="SignUpScreen"
            />
          ) : (
            <NavLink
              text="אין לך חשבון? לחץ כאן להירשם "
              props={{ userType: userType }}
              routeName="LandlordSignUpScreen"
            />
          )}

          <Button
            buttonColor={Color.Blue800}
            textColor={Color.defaultTheme}
            mode="contained"
            onPress={() => console.log('preesed')}
          >
            התחבר
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
    margin: 10,
    justifyContent: 'center',
  },
  image: {
    flex: 1,
  },
  text: {
    alignItems: 'center',
  },
});
