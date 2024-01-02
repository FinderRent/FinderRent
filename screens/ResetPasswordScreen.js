import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import OTPInputView from '@twotalltotems/react-native-otp-input';

import { Color } from '../constants/colors';
import { useDarkMode } from '../context/DarkModeContext';
import Spacer from '../components/ui/Spacer';
import NavLink from '../components/NavLink';
import PasswordInput from '../components/PasswordInput';

function ResetPasswordScreen({ route }) {
  const { isDarkMode } = useDarkMode();

  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.text} variant="headlineMedium">
          הכנס קוד אימות
        </Text>
        <OTPInputView
          style={styles.otp}
          pinCount={6}
          autoFocusOnLoad={false}
          codeInputFieldStyle={styles.underlineStyleBase}
          codeInputHighlightStyle={styles.underlineStyleHighLighted}
          onCodeFilled={(code) => {
            setOtp(code);
          }}
        />
        <Button
          mode="text"
          style={{ marginTop: -15 }}
          textColor={Color.Brown800}
        >
          שלח קוד מחדש
        </Button>

        <Text style={styles.text} variant="headlineMedium">
          מלא סיסמה חדשה
        </Text>
      </View>

      <View style={styles.textInput}>
        <PasswordInput
          mode="outlined"
          label="סיסמה"
          onValueChange={(password) => setPassword(password)}
        />
        {password.length > 0 && password.length < 6 && (
          <Text
            style={
              isDarkMode
                ? { color: Color.error100, paddingRight: 10 }
                : { color: Color.errorText, paddingRight: 10 }
            }
          >
            סיסמה צריכה להכיל 6 תווים לפחות
          </Text>
        )}
        <PasswordInput
          mode="outlined"
          label="אשר סיסמה"
          onValueChange={(passwordConfirm) =>
            setPasswordConfirm(passwordConfirm)
          }
        />
      </View>

      <Spacer>
        <Button
          style={{ marginHorizontal: 10 }}
          buttonColor={Color.Blue800}
          textColor={Color.defaultTheme}
          mode="contained"
        >
          אפס סיסמה
        </Button>
      </Spacer>
      <NavLink
        text="התחבר"
        routeName="SignInScreen"
        style={{ marginTop: -5, fontSize: 14 }}
      />
    </View>
  );
}

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 125,
  },
  text: {
    fontWeight: 'bold',
    color: Color.Blue800,
  },
  otp: {
    width: '85%',
    height: 100,
  },
  underlineStyleBase: {
    color: Color.Blue800,
    width: 40,
    height: 45,
    borderWidth: 1,
    borderBottomWidth: 4,
  },
  underlineStyleHighLighted: {
    borderColor: Color.Blue900,
  },
  textInput: {
    margin: 6,
    marginHorizontal: 10,
  },
});
