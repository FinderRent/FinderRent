import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { Button } from "react-native-elements";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import SignInModal from "../modals/SignInModal";

const SignInHeader = () => {
  const { isDarkMode } = useDarkMode();
  const [showSignInModal, setShowSignInModal] = useState(false);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.midContainer}>
          <View>
            <Text style={styles.text}>SignIn to see your location</Text>
          </View>
        </View>

        <View style={styles.midContainer}>
          <Button
            title="SignIn"
            buttonStyle={
              isDarkMode
                ? { backgroundColor: Color.defaultTheme }
                : { backgroundColor: Color.darkTheme }
            }
            titleStyle={
              isDarkMode
                ? {
                    color: Color.darkTheme,
                  }
                : { color: Color.defaultTheme }
            }
            onPress={() => setShowSignInModal(true)}
          />
        </View>
      </View>
      {showSignInModal && (
        <SignInModal
          showVisible={(showVisible) => setShowSignInModal(showVisible)}
        />
      )}
      <View style={styles.line}></View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: "500",
    // color: Color.Blue500,
  },
  midContainer: {
    paddingTop: 15,
    paddingHorizontal: 15,
    marginRight: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  // line: {
  //   marginTop: 10,
  //   marginHorizontal: 10,
  //   borderBottomWidth: 1.5,
  //   borderBottomColor: Color.Blue500,
  // },
});
export default SignInHeader;
