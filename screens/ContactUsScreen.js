import { useState } from "react";
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import Input from "../components/inputs/Input";
import Spacer from "../components/ui/Spacer";
import contactUsEmail from "../api/emails/contactUsEmail";
import ErrorMessage from "../components/ui/ErrorMessage";

function ContactUsScreen() {
  const { isDarkMode } = useDarkMode();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: ({ firstName, lastName, email, subject, message }) =>
      contactUsEmail({ firstName, lastName, email, subject, message }),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Your message has been sent successfully",
      });

      setFirstName("");
      setLastName("");
      setEmail("");
      setSubject("");
      setMessage("");
    },
  });

  const handleContactUsEmail = () => {
    mutate({ firstName, lastName, email, subject, message });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require("../assets/images/home-background.jpg")}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        <ScrollView
          style={
            isDarkMode
              ? { backgroundColor: "rgba(0,0,0, 0.50)" }
              : { backgroundColor: "rgba(0,0,0, 0.10)" }
          }
        >
          <View style={styles.container}>
            <View style={{ marginBottom: "10%" }}>
              <View style={styles.line} />
              <Text style={styles.subTitle}>
                Reach Us Out for Support Inquiries or Feedback
              </Text>
              <View style={styles.line} />
            </View>

            <View style={styles.inputsRow}>
              <Input
                style={{ flex: 1, marginRight: 10 }}
                value={firstName}
                label="First Name"
                mode="outlined"
                onValueChange={(firstName) => setFirstName(firstName)}
              />
              <Input
                style={{ flex: 1, marginLeft: 10 }}
                value={lastName}
                label="Last Name"
                mode="outlined"
                onValueChange={(lastName) => setLastName(lastName)}
              />
            </View>
            <Input
              style={styles.textInput}
              value={email}
              label="Email"
              keyboardType="email-address"
              mode="outlined"
              onValueChange={(email) => setEmail(email)}
            />
            <Input
              style={styles.textInput}
              value={subject}
              label="Subject"
              keyboardType="email-address"
              mode="outlined"
              onValueChange={(subject) => setSubject(subject)}
            />
            <Input
              style={styles.textInput}
              value={message}
              label="Message"
              multiline
              numberOfLines={7}
              onChangeText={(text) => setMessage(text)}
              mode="outlined"
              onValueChange={(message) => setMessage(message)}
            />
            <View style={{ marginHorizontal: 10 }}>
              {isError && <ErrorMessage errorMessage={error.message} />}
            </View>

            <Spacer>
              <Button
                style={{ marginLeft: "50%", margin: 10 }}
                buttonColor={Color.Blue700}
                textColor={Color.defaultTheme}
                mode="contained-tonal"
                onPress={handleContactUsEmail}
                loading={isPending}
              >
                {!isPending && "Send Message"}
              </Button>
            </Spacer>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

export default ContactUsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "10%",
    justifyContent: "center",
    opacity: 0.8,
  },
  line: {
    height: 1.5,
    backgroundColor: Color.Blue700,
    marginHorizontal: 20,
  },
  subTitle: {
    marginBottom: 5,
    textAlign: "center",
    fontSize: 21,
    marginHorizontal: 10,
    fontFamily: "Merienda",
    color: Color.Blue900,
  },
  inputsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    marginHorizontal: 10,
  },
  textInput: {
    margin: 5,
    marginHorizontal: 10,
  },
});
