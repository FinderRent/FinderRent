import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";

import { Color } from "../constants/colors";
import { useUsers } from "../context/UserContext";
import Spacer from "../components/ui/Spacer";
import PasswordInput from "../components/inputs/PasswordInput";
import NavLink from "../components/ui/NavLink";
import ErrorMessage from "../components/ui/ErrorMessage";
import changePassword from "../api/authentication/changePassword";

function SecurityScreen() {
  const { t } = useTranslation();
  const { userData } = useUsers();
  const token = userData.token;

  const [passwordCurrent, setPasswordCurrent] = useState();
  const [password, setPassword] = useState();
  const [passwordConfirm, setPasswordConfirm] = useState();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: ({ passwordCurrent, password, passwordConfirm, token }) =>
      changePassword({
        passwordCurrent,
        password,
        passwordConfirm,
        token,
      }),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Password successfully updated",
      });
    },
  });

  const handleChangePassword = () => {
    mutate({ passwordCurrent, password, passwordConfirm, token });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ScrollView>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={100}
          >
            <Text style={styles.title} variant="headlineSmall">
              {t("changePassword")}
            </Text>
            <View style={{ marginTop: 25 }}>
              <Text style={styles.text} variant="titleMedium">
                {t("enterCurrentPassword")}
              </Text>

              <PasswordInput
                mode="outlined"
                onValueChange={(passwordCurrent) =>
                  setPasswordCurrent(passwordCurrent)
                }
              />
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.text} variant="titleMedium">
                {t("enterNewPassword")}
              </Text>
            </View>
            <PasswordInput
              mode="outlined"
              onValueChange={(password) => setPassword(password)}
            />
            <Text style={styles.text} variant="titleMedium">
              {t("confirmPassword")}
            </Text>
            <PasswordInput
              mode="outlined"
              onValueChange={(passwordConfirm) =>
                setPasswordConfirm(passwordConfirm)
              }
            />
            {isError && <ErrorMessage errorMessage={t(error.message)} />}

            <Spacer>
              <Button
                style={{ marginTop: 20 }}
                buttonColor={Color.Blue700}
                textColor={Color.defaultTheme}
                mode="contained"
                onPress={handleChangePassword}
                loading={isPending}
                disabled={isPending}
              >
                {!isPending && t("updatePassword")}
              </Button>
            </Spacer>
            <NavLink text={t("back")} style={{ marginTop: -5, fontSize: 14 }} />
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default SecurityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    marginTop: 50,
    marginHorizontal: 10,
  },
  title: {
    margin: 25,
    textAlign: "center",
    fontFamily: "OrbitronMedium",
    // fontWeight: "bold",
    borderBottomWidth: 0.4,
    borderBottomColor: Color.Blue500,
    color: Color.Blue700,
  },
  text: {
    marginLeft: 2,
    marginBottom: 5,
    fontWeight: "bold",
    color: Color.Blue700,
  },
});
