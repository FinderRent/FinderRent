import { StyleSheet, View } from "react-native";

function Indicators({ images, currentIndex }) {
  return (
    <View style={styles.indicatorContainer}>
      {images.map((_, index) => (
        <View
          key={index}
          style={[
            styles.indicator,
            currentIndex === index ? styles.activeIndicator : {},
          ]}
        />
      ))}
    </View>
  );
}

export default Indicators;

const styles = StyleSheet.create({
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 10,
    width: "100%",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: "#ccc",
    margin: 3,
  },
  activeIndicator: {
    backgroundColor: "#333",
  },
});
