import { StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

function Loader({ color, size }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator animating={true} color={color} size={size} />
    </View>
  );
}

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
