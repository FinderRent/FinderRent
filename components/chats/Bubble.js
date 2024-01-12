import { useRef } from "react";
import {
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import { Menu, MenuTrigger, MenuOptions } from "react-native-popup-menu";
import uuid from "react-native-uuid";
import * as Clipboard from "expo-clipboard";

import { Color } from "../../constants/colors";
import { useDarkMode } from "../../context/DarkModeContext";
import MenuItem from "./MenuItem";

function Bubble({
  senderId,
  title,
  name,
  text,
  type,
  time,
  setReply,
  replyingTo,
  imageUrl,
}) {
  const { isDarkMode } = useDarkMode();

  const bubbleStyle = { ...styles.container };
  const textStyle = { ...styles.text };
  const wrapperStyle = { ...styles.wrapperStyle };
  const timeStyle = { ...styles.timeStyle };
  const image = { ...styles.image };

  const menuRef = useRef(null);
  const id = useRef(uuid.v4());
  let Container = View;

  const copyToClipboard = async (text) => {
    try {
      await Clipboard.setStringAsync(text);
    } catch (err) {
      console.log(err.message);
    }
  };

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
      bubbleStyle.backgroundColor = Color.Blue500;
      bubbleStyle.borderBottomRightRadius = 15;
      bubbleStyle.maxWidth = "80%";
      Container = TouchableWithoutFeedback;
      break;
    case "theirMessage":
      wrapperStyle.justifyContent = "flex-start";
      bubbleStyle.backgroundColor = isDarkMode ? Color.darkTheme : Color.white;
      bubbleStyle.borderBottomLeftRadius = 15;
      bubbleStyle.maxWidth = "80%";
      timeStyle.color = isDarkMode ? Color.Brown100 : Color.Brown900;
      Container = TouchableWithoutFeedback;
      break;
    case "reply":
      bubbleStyle.backgroundColor = isDarkMode
        ? Color.buttomSheetDarkTheme
        : Color.defaultTheme;
      image.height = 125;
      image.width = "95%";
      image.margin = 10;
      break;
    default:
      break;
  }

  return (
    <View style={wrapperStyle}>
      <Container
        onLongPress={() =>
          menuRef.current.props.ctx.menuActions.openMenu(id.current)
        }
        style={{ width: "100%" }}
      >
        <View style={bubbleStyle}>
          {name && <Text style={styles.name}>{name}</Text>}

          {replyingTo && (
            <Bubble
              type="reply"
              text={replyingTo.messageText}
              imageUrl={replyingTo?.image?.url}
              name={replyingTo.senderId === senderId ? "את/ה" : title}
            />
          )}

          {!imageUrl && <Text style={textStyle}>{text}</Text>}
          {imageUrl && <Image source={{ uri: imageUrl }} style={image} />}
          <View style={styles.timeContainer}>
            <Text style={timeStyle}>{time}</Text>
          </View>
          <Menu name={id.current} ref={menuRef}>
            <MenuTrigger />
            <MenuOptions
              customStyles={{
                optionsContainer: {
                  width: 130,
                  margin: 10,
                },
              }}
              optionsContainerStyle={{
                backgroundColor: isDarkMode ? Color.darkTheme : Color.white,
              }}
            >
              <MenuItem
                text="Copy to Clipboard"
                icon={"copy"}
                onSelect={() => copyToClipboard(text)}
              />
              <MenuItem
                text="Repley"
                icon="arrow-left-circle"
                onSelect={setReply}
              />
            </MenuOptions>
          </Menu>
        </View>
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapperStyle: {
    flexDirection: "row",
    justifyContent: "center",
  },
  container: {
    backgroundColor: "white",
    borderRadius: 6,
    paddingTop: 5,
    paddingHorizontal: 7,
    marginBottom: 10,
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
  image: {
    width: 250,
    height: 180,
    marginBottom: 5,
    marginLeft: 5,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: Color.Blue500,
  },
});

export default Bubble;
