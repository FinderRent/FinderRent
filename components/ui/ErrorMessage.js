import { View, Text, StyleSheet } from "react-native";

import { Color } from "../../constants/colors";

function ErrorMessage({ errorMessage }) {
  // Remove "Error:" from the beginning of the error message
  const message = errorMessage.replace(/^Error:\s*/i, "");

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: "#f8d7da",
    borderColor: "#f5c6cb",
  },
  text: {
    color: Color.errorText,
    fontSize: 16,
  },
});

export default ErrorMessage;
