import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { ListItem, Avatar } from "react-native-elements";

import { useDarkMode } from "../../context/DarkModeContext";
import { Color } from "../../constants/colors";

const RoommatesInfo = (props) => {
  const { isDarkMode } = useDarkMode();

  return (
    <View style={styles.seperator}>
      <Text style={styles.Header}>You will live with</Text>
      <View>
        {props.Roommates.map((l, i) => (
          <ListItem
            containerStyle={
              isDarkMode
                ? { backgroundColor: Color.darkTheme }
                : { backgroundColor: Color.white }
            }
            key={i}
          >
            <Avatar
              source={{
                //fix it to be dynamic
                url: "https://thumbs.dreamstime.com/z/unknown-male-avatar-profile-image-businessman-vector-unknown-male-avatar-profile-image-businessman-vector-profile-179373829.jpg?w=768",
              }}
            />
            <ListItem.Content>
              <ListItem.Title
                style={
                  isDarkMode
                    ? { color: Color.white }
                    : { color: Color.darkTheme }
                }
              >
                {l.name}
              </ListItem.Title>
              <ListItem.Subtitle
                style={
                  isDarkMode
                    ? { color: Color.white }
                    : { color: Color.darkTheme }
                }
              >
                {l.subtitle}
              </ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Header: {
    fontSize: 25,
    fontWeight: "bold",
  },
  Button: {
    fontSize: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    elevation: 3,
    borderWidth: 2,
    borderColor: "#ccc",
    marginVertical: 7,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
  },
});

export default RoommatesInfo;
