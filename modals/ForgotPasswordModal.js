import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Fontisto } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import Input from "../components/inputs/Input";
import ErrorMessage from "../components/ui/ErrorMessage";
import forgotPasswordEmail from "../api/emails/forgotPasswordEmail";

function ForgotPasswordModal({ showVisible }) {
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();
  const navigation = useNavigation();

  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(true);
  const [email, setEmail] = useState();

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: ({ email }) => forgotPasswordEmail({ email }),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: t("forgotPassword.toast.success"),
      });
      navigation.navigate("ResetPasswordScreen", { email });
    },
  });

  const handleForgotPasswordEmail = () => {
    mutate({ email });
  };

  const handleCancel = () => {
    setForgotPasswordVisible(!forgotPasswordVisible);
    showVisible(!forgotPasswordVisible);
  };

  return (
    <View>
      <Modal
        // animationType="slide"
        transparent={true}
        visible={forgotPasswordVisible}
        onRequestClose={() => {
          showVisible(!forgotPasswordVisible);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.centeredView}>
            <View
              style={
                isDarkMode
                  ? {
                      ...styles.modalView,
                      backgroundColor: Color.buttomSheetDarkTheme,
                    }
                  : styles.modalView
              }
            >
              <Text
                style={[
                  styles.modalText,
                  isDarkMode && { color: Color.defaultTheme },
                ]}
              >
                {t("forgotPassword.enterEmail")}
              </Text>
              <Pressable
                onPress={() => handleCancel()}
                style={{ position: "absolute", margin: 15 }}
              >
                <Fontisto
                  name="close-a"
                  size={28}
                  color={isDarkMode ? "white" : "black"}
                />
              </Pressable>
              <View style={styles.textInput}>
                <Input
                  label={t("forgotPassword.email")}
                  keyboardType="email-address"
                  mode="outlined"
                  color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
                  onValueChange={(selectedMail) => setEmail(selectedMail)}
                />
              </View>

              {isError && <ErrorMessage errorMessage={t(error.message)} />}

              <Button
                style={[
                  styles.button,
                  isDarkMode && { backgroundColor: Color.defaultTheme },
                ]}
                mode="contained"
                onPress={handleForgotPasswordEmail}
                loading={isPending}
                // disabled={isPending}
                textColor={isDarkMode ? Color.darkTheme : Color.defaultTheme}
              >
                {!isPending && t("forgotPassword.send")}
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

export default ForgotPasswordModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
  },
  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 0,
    marginTop: 15,
    textAlign: "center",
    fontSize: 13,
    color: Color.darkTheme,
    // fontFamily: "OrbitronMedium",
  },
  textInput: {
    fontSize: 15,
    // marginHorizontal: 5,
    margin: 2,
    justifyContent: "center",
    color: Color.darkTheme,
  },
  button: {
    elevation: 2,
    marginVertical: 5,
    backgroundColor: Color.darkTheme,
  },
});
