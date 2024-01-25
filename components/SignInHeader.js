import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-elements";

import { Color } from "../constants/colors";
import SignInModal from "../modals/SignInModal";

const SignInHeader = () => {
  const [showSignInModal, setShowSignInModal] = useState(false);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.midContainer}>
          <View>
            <Text style={styles.text}>Sign in to see your Location</Text>
          </View>
        </View>

        <View style={styles.midContainer}>
          <Button
            title="Sign In"
            buttonStyle={{
              backgroundColor: Color.Blue500,
              borderRadius: 5,
            }}
            titleStyle={{ fontWeight: "bold", fontSize: 16 }}
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
  },
  text: {
    fontSize: 18,
    fontWeight: "500",
    color: Color.Blue500,
  },
  midContainer: {
    paddingTop: 15,
    paddingHorizontal: 15,
    marginRight: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  line: {
    marginTop: 10,
    marginHorizontal: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: Color.Blue500,
  },
});
export default SignInHeader;
