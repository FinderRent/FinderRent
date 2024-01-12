import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Text } from "react-native-paper";

import { Color } from "../../constants/colors";
import { useDarkMode } from "../../context/DarkModeContext";

function Bubble({ name, type, time }) {
  const { isDarkMode } = useDarkMode();

  const bubbleStyle = { ...styles.container };
  const textStyle = { ...styles.text };
  const wrapperStyle = { ...styles.wrapperStyle };
  const timeStyle = { ...styles.timeStyle };

  switch (type) {
    case "system":
      textStyle.color = isDarkMode ? Color.white : Color.black;
      bubbleStyle.backgroundColor = Color.Brown300;
      bubbleStyle.alignItems = "center";
      bubbleStyle.marginTop = 12;
      bubbleStyle.opacity = 0.6;
      break;
    case "error":
      bubbleStyle.backgroundColor = Color.error;
      textStyle.color = Color.errorText;
      bubbleStyle.marginTop = 10;
      break;
    case "myMessage":
      wrapperStyle.justifyContent = "flex-end";
      bubbleStyle.backgroundColor = Color.Blue700;
      bubbleStyle.borderBottomRightRadius = 15;
      bubbleStyle.maxWidth = "80%";
      Container = TouchableWithoutFeedback;
      break;
    case "theirMessage":
      wrapperStyle.justifyContent = "flex-start";
      bubbleStyle.backgroundColor = isDarkMode ? Color.darkTheme : Color.white;
      bubbleStyle.borderBottomLeftRadius = 15;
      bubbleStyle.maxWidth = "80%";
      timeStyle.color = isDarkMode ? Color.Blue100 : Color.Brown900;
      Container = TouchableWithoutFeedback;
      break;
    default:
      break;
  }

  return (
    <View style={wrapperStyle}>
      <View style={bubbleStyle}>
        {name && <Text style={styles.name}>{name}</Text>}

        <View style={styles.timeContainer}>
          <Text style={timeStyle}>{time}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapperStyle: {
    flexDirection: "row",
    justifyContent: "center",
  },
  text: {
    fontWeight: "600",
    letterSpacing: 0.3,
    fontSize: 16,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 5,
    marginBottom: 2,
    marginTop: -2,
  },
  timeStyle: {
    fontFamily: "varelaRound",
    letterSpacing: 0.3,
    fontSize: 9,
    color: Color.Brown100,
  },
  name: {
    color: Color.Brown700,
    fontFamily: "medium",
    letterSpacing: 0.3,
  },
});

export default Bubble;
