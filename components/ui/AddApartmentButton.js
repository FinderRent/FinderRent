import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

import { Color } from "../../constants/colors";
import { useDarkMode } from "../../context/DarkModeContext";

const AddApartmentButton = (props) => {
  const { isDarkMode } = useDarkMode();
  const animation = useRef(new Animated.Value(0)).current;
  const [open, setOpen] = useState(props.isOpen);

  const handleAddButtonPress = () => {
    props.handleAddButtonPress();
    props.handleIsOpen();
    togglePage();
  };

  useEffect(() => {
    togglePage();
  }, [props.isOpen]);

  const togglePage = () => {
    const toValue = open ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      friction: 5,
      useNativeDriver: true,
    }).start();
    setOpen(!open);
  };

  const rotation = {
    transform: [
      {
        rotate: animation.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "45deg"],
        }),
      },
    ],
  };

  return (
    <View style={[styles.container, props.style]}>
      <TouchableWithoutFeedback onPress={handleAddButtonPress}>
        <Animated.View style={[styles.button, styles.menu, rotation]}>
          <AntDesign
            name="plus"
            size={24}
            color={isDarkMode ? Color.defaultTheme : Color.defaultTheme}
          />
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    position: "absolute",
  },
  button: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    alignItems: "center",
    shadowRadius: 10,
    shadowColor: Color.extraGray,
    shadowOpacity: 0.3,
    shadowOffset: { height: 10 },
    justifyContent: "center",
  },
  menu: {
    backgroundColor: Color.Blue500,
  },
});

export default AddApartmentButton;
