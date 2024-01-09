import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import OTPInputView from '@twotalltotems/react-native-otp-input';

import { Color } from '../constants/colors';
import { useDarkMode } from '../context/DarkModeContext';
import Spacer from '../components/ui/Spacer';
import PasswordInput from '../components/PasswordInput';
import SignInModal from '../modals/SignInModal';

function ResetPasswordScreen() {
  const { isDarkMode } = useDarkMode();

  const [showSignInModal, setShowSignInModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.text} variant="headlineSmall">
          Verification Code
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
          onPress={() => console.log('pressed')}
        >
          Resend Email
        </Button>

        <Text style={styles.text} variant="headlineSmall">
          Enter New Password
        </Text>
      </View>

      <View style={styles.textInput}>
        <PasswordInput
          mode="outlined"
          label="Password"
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
            Password must contain at least 6 characters
          </Text>
        )}
        <PasswordInput
          mode="outlined"
          label="Password Confirm"
          onValueChange={(passwordConfirm) =>
            setPasswordConfirm(passwordConfirm)
          }
        />
      </View>

      <Spacer>
        <Button
          style={{ marginHorizontal: 10, marginTop: 10 }}
          buttonColor={Color.Blue800}
          textColor={Color.defaultTheme}
          mode="contained"
          onPress={() => console.log('pressed')}
        >
          Reset Password
        </Button>
      </Spacer>
      <TouchableOpacity
        style={{ marginHorizontal: 150 }}
        onPress={() => setShowSignInModal(true)}
      >
        <Text style={{ textAlign: 'center' }}>Login</Text>
      </TouchableOpacity>

      {showSignInModal && (
        <SignInModal
          showVisible={(showVisible) => setShowSignInModal(showVisible)}
        />
      )}
    </View>
  );
}

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 100,
  },
  text: {
    fontFamily: 'OrbitronMedium',
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
