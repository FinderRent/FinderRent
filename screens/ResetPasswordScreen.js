import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useMutation } from "@tanstack/react-query";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import Toast from "react-native-toast-message";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import Spacer from "../components/ui/Spacer";
import PasswordInput from "../components/PasswordInput";
import SignInModal from "../modals/SignInModal";
import resetPassword from "../api/authentication/resetPassword";
import sendEmail from "../api/sendEmail";
import ErrorMessage from "../components/ui/ErrorMessage";

function ResetPasswordScreen({ route }) {
  const { isDarkMode } = useDarkMode();

  const { email } = route.params;
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const {
    mutate: mutateResetPassword,
    isPending: isResetPasswordPending,
    error: resetPasswordError,
    isError: isResetPasswordError,
  } = useMutation({
    mutationFn: ({ userType, otp, password, passwordConfirm }) =>
      resetPassword({ userType, otp, password, passwordConfirm }),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Password changed successfully",
      });
    },
  });

  const { mutate: mutateSendEmail, isPending: isSendEmailPanding } =
    useMutation({
      mutationFn: ({ email }) => sendEmail({ email }),
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Password reset code sent to email",
        });
      },
      onError: () => {
        Toast.show({
          type: "error",
          text1: "Error while sending the email",
        });
      },
    });

  const handleResetPassword = () => {
    mutateResetPassword({ otp, password, passwordConfirm });
  };
  const handleSendEmail = () => {
    mutateSendEmail({ email });
  };

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
          onPress={handleSendEmail}
          loading={isSendEmailPanding}
        >
          {!isSendEmailPanding && "Resend Email   "}
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

      {isResetPasswordError && (
        <ErrorMessage errorMessage={resetPasswordError.message} />
      )}

      <Spacer>
        <Button
          style={{ marginHorizontal: 10, marginTop: 10 }}
          buttonColor={Color.Blue800}
          textColor={Color.defaultTheme}
          mode="contained"
          onPress={handleResetPassword}
          loading={isResetPasswordPending}
        >
          {!isResetPasswordPending && "Reset    "}
        </Button>
      </Spacer>
      <TouchableOpacity
        style={{ marginHorizontal: 150 }}
        onPress={() => setShowSignInModal(true)}
      >
        <Text style={{ textAlign: "center" }}>Login</Text>
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
    alignItems: "center",
    marginTop: 100,
  },
  text: {
    fontFamily: "OrbitronMedium",
    color: Color.Blue800,
  },
  otp: {
    width: "85%",
    height: 85,
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
