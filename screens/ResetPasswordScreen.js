import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import Toast from "react-native-toast-message";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import Spacer from "../components/ui/Spacer";
import PasswordInput from "../components/inputs/PasswordInput";
import SignInModal from "../modals/SignInModal";
import resetPassword from "../api/authentication/resetPassword";
import forgotPasswordEmail from "../api/emails/forgotPasswordEmail";
import ErrorMessage from "../components/ui/ErrorMessage";

function ResetPasswordScreen({ route }) {
  const { t } = useTranslation();
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
        text1: t("passwordChangedSuccess"),
      });
    },
  });

  const {
    mutate: mutateForgotPasswordEmail,
    isPending: isForgotPasswordEmailPanding,
  } = useMutation({
    mutationFn: ({ email }) => forgotPasswordEmail({ email }),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: t("emailSentSuccess"),
      });
    },
    onError: () => {
      Toast.show({
        type: "error",
        text1: t("emailSentError"),
      });
    },
  });

  const handleResetPassword = () => {
    mutateResetPassword({ otp, password, passwordConfirm });
  };

  const handleForgotPasswordEmail = () => {
    mutateForgotPasswordEmail({ email });
  };

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.text} variant="headlineSmall">
          {t("verificationCode")}
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
          onPress={handleForgotPasswordEmail}
          loading={isForgotPasswordEmailPanding}
        >
          {!isForgotPasswordEmailPanding && t("resendEmail")}
        </Button>

        <Text style={styles.text} variant="headlineSmall">
          {t("enterNewPassword")}
        </Text>
      </View>

      <View style={styles.textInput}>
        <PasswordInput
          mode="outlined"
          label={t("password")}
          onValueChange={(password) => setPassword(password)}
        />
        {password.length > 0 && password.length < 8 && (
          <Text
            style={
              isDarkMode
                ? { color: Color.error100, paddingRight: 10 }
                : { color: Color.errorText, paddingRight: 10 }
            }
          >
            {t("passwordError")}
          </Text>
        )}
        <PasswordInput
          mode="outlined"
          label={t("passwordConfirm")}
          onValueChange={(passwordConfirm) =>
            setPasswordConfirm(passwordConfirm)
          }
        />
      </View>

      {isResetPasswordError && (
        <ErrorMessage errorMessage={t(resetPasswordError.message)} />
      )}

      <Spacer>
        <Button
          style={{ marginHorizontal: 10, marginTop: 10 }}
          buttonColor={Color.Blue700}
          textColor={Color.defaultTheme}
          mode="contained"
          onPress={handleResetPassword}
          loading={isResetPasswordPending}
          disabled={isResetPasswordPending}
        >
          {!isResetPasswordPending && t("reset")}
        </Button>
      </Spacer>
      <TouchableOpacity
        style={{ marginHorizontal: 150 }}
        onPress={() => setShowSignInModal(true)}
      >
        <Text style={{ textAlign: "center" }}>{t("login")}</Text>
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
    color: Color.Blue700,
  },
  otp: {
    width: "85%",
    height: 85,
  },
  underlineStyleBase: {
    color: Color.Blue700,
    width: 40,
    height: 45,
    borderWidth: 1,
    borderBottomWidth: 4,
  },
  underlineStyleHighLighted: {
    borderColor: Color.Blue700,
  },
  textInput: {
    margin: 6,
    marginHorizontal: 10,
  },
});
