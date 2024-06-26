import React, { useRef } from "react";
import { Animated, StyleSheet, View, I18nManager } from "react-native";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import { FontAwesome6 } from "@expo/vector-icons";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";

const SwipeableRow = ({ children, onDelete }) => {
  const { isDarkMode } = useDarkMode();
  const swipeableRowRef = useRef(null);

  const close = () => {
    swipeableRowRef.current?.close();
    onDelete();
  };

  //   const renderRightAction = (_progress, dragX) => {
  //     const trans = dragX.interpolate({
  //       inputRange: [0, 50, 100, 101],
  //       outputRange: [-20, 0, 0, 1],
  //       extrapolate: "clamp",
  //     });
  //     return (
  //       <RectButton style={styles.leftAction} onPress={this.close}>
  //         <Animated.Text
  //           style={[
  //             styles.actionText,
  //             {
  //               transform: [{ translateX: trans }],
  //             },
  //           ]}
  //         >
  //           Archive
  //         </Animated.Text>
  //       </RectButton>
  //     );
  //   };

  const renderLeftAction = (icon, color, x, progress) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 1],
    });
    const pressHandler = () => {
      close();
    };

    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: color }]}
          onPress={pressHandler}
        >
          <FontAwesome6
            name={icon}
            size={24}
            color={isDarkMode ? Color.darkTheme : Color.defaultTheme}
          />
        </RectButton>
      </Animated.View>
    );
  };

  const renderLeftActions = (progress, _dragAnimatedValue) => (
    <View
      style={{
        width: 150,
        flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
      }}
    >
      {renderLeftAction(
        "trash",
        isDarkMode ? Color.defaultTheme : Color.darkTheme,
        0,
        progress
      )}
    </View>
  );

  return (
    <Swipeable
      ref={swipeableRowRef}
      friction={2}
      enableTrackpadTwoFingerGesture
      leftThreshold={30}
      rightThreshold={40}
      renderLeftActions={renderLeftActions}
      //   renderRightActions={renderRightAction}
      // onSwipeableOpen={(direction) => {
      //   console.log(`Opening swipeable from the ${direction}`);
      // }}
      // onSwipeableClose={(direction) => {
      //   console.log(`Closing swipeable to the ${direction}`);
      // }}
    >
      {children}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: "#497AFC",
    justifyContent: "center",
  },
  actionText: {
    color: "white",
    fontSize: 16,
    backgroundColor: "transparent",
    padding: 10,
  },
  rightAction: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    // borderBottomLeftRadius: 10,
    // borderTopLeftRadius: 10,
  },
});

export default SwipeableRow;
