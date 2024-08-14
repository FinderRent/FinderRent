import React, { useEffect } from "react";
import { Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";

export const MovingText = ({ text, animationThreshold, style }) => {
  const translateX = useSharedValue(0);
  const shouldAnimate = text.length >= animationThreshold;
  const textWidth = text.length * 12; // Adjust this value based on your font size
  const screenWidth = 100; // Adjust this value based on your screen width or get it dynamically

  useEffect(() => {
    if (!shouldAnimate) return;

    translateX.value = screenWidth;
    translateX.value = withRepeat(
      withTiming(-textWidth, {
        duration: 10000, // Adjust the duration as needed
        easing: Easing.linear,
      }),
      -1,
      false
    );

    return () => {
      cancelAnimation(translateX);
    };
  }, [
    translateX,
    text,
    animationThreshold,
    shouldAnimate,
    textWidth,
    screenWidth,
  ]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  if (!shouldAnimate) {
    return <Text style={style}>{text}</Text>;
  }

  return (
    <Animated.View style={{ overflow: "hidden", width: "100%" }}>
      <Animated.Text
        numberOfLines={1}
        style={[
          style,
          animatedStyle,
          {
            width: textWidth,
            paddingRight: 40, // Add some padding to the end
          },
        ]}
      >
        {text}
      </Animated.Text>
    </Animated.View>
  );
};
