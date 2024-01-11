import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import Input from "../components/Input";
import ErrorMessage from "../components/ui/ErrorMessage";
import sendEmail from "../api/sendEmail";

function ForgotPasswordModal({ showVisible }) {
  const { isDarkMode } = useDarkMode();
  const navigation = useNavigation();

  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(true);
  const [email, setEmail] = useState();

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: ({ email }) => sendEmail({ email }),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Password reset code sent to email",
      });
      navigation.navigate("ResetPasswordScreen", { email });
    },
  });

  const handleSendEmail = () => {
    mutate({ email });
  };

  const handleCancel = () => {
    setForgotPasswordVisible(!forgotPasswordVisible);
    showVisible(!forgotPasswordVisible);
  };

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={forgotPasswordVisible}
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
              <Text style={styles.modalText}>
                Please enter an email to receive a password reset code
              </Text>
              <Pressable
                onPress={() => handleCancel()}
                style={{ position: "absolute", margin: 12 }}
              >
                <Image
                  source={require("../assets/images/close.png")}
                  style={{ height: 25, width: 25 }}
                />
              </Pressable>
              <View style={styles.textInput}>
                <Input
                  label="Email"
                  keyboardType="email-address"
                  mode="outlined"
                  onValueChange={(selectedMail) => setEmail(selectedMail)}
                />
              </View>

              {isError && <ErrorMessage errorMessage={error.message} />}

              <Button
                style={styles.button}
                mode="contained"
                textColor={Color.defaultTheme}
                onPress={handleSendEmail}
                loading={isPending}
              >
                {!isPending && "Send     "}
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
    fontSize: 11,
    color: Color.Blue700,
    fontFamily: "OrbitronMedium",
  },
  textInput: {
    fontSize: 15,
    margin: 5,
    justifyContent: "center",
    color: "#2196F3",
  },
  button: {
    elevation: 2,
    marginVertical: 5,
    backgroundColor: Color.Blue700,
  },
});
