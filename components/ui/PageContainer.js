import { StyleSheet, View } from "react-native";

function PageContainer({ style, children }) {
  return <View style={{ ...styles.container, ...style }}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: "white",
  },
});

export default PageContainer;
