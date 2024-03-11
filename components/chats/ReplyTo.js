import { StyleSheet, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Text } from "react-native-paper";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";

import { Color } from "../../constants/colors";
import { useDarkMode } from "../../context/DarkModeContext";

function ReplyTo({ text, name, onCancel }) {
  const { isDarkMode } = useDarkMode();

  return (
    <Animated.View
      entering={FadeInDown}
      exiting={FadeOutDown}
      style={
        isDarkMode
          ? { ...styles.container, backgroundColor: Color.darkTheme }
          : { ...styles.container, backgroundColor: Color.white }
      }
    >
      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={styles.name}>
          {name}
        </Text>
        <Text numberOfLines={1}>{text}</Text>
      </View>

      <TouchableOpacity
        onPress={onCancel}
        hitSlop={{ top: 20, bottom: 20, left: 50, right: 100 }}
      >
        <AntDesign name="closecircleo" size={26} color={Color.Blue500} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 5,
    borderLeftColor: Color.Blue700,
    marginHorizontal: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  textContainer: {
    flex: 1,
    marginRight: 5,
  },
  name: {
    fontFamily: "varelaRound",
    color: Color.Blue500,
    letterSpacing: 0.3,
  },
});

export default ReplyTo;
