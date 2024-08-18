import { StyleSheet, ScrollView, Platform } from "react-native";
import { Text } from "react-native-paper";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  withDelay,
} from "react-native-reanimated";
import { useEffect } from "react";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";

const AboutScreen = () => {
  const { isDarkMode } = useDarkMode();
  const { t } = useTranslation();
  const tabBarHeight = useBottomTabBarHeight();

  // Animation values
  const fadeIn = useSharedValue(0);
  const slideUp = useSharedValue(5);
  const scaleFooter = useSharedValue(1);

  // Animation effects
  useEffect(() => {
    fadeIn.value = withTiming(1, { duration: 1000 });
    slideUp.value = withDelay(500, withTiming(0, { duration: 1000 }));
  }, []);

  // Animated styles
  const animatedTitleStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
    transform: [{ translateY: slideUp.value }],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
  }));

  const animatedFooterStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleFooter.value }],
  }));

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingTop: Platform.OS === "ios" ? 0 : 15,
        marginBottom: Platform.OS === "ios" ? 0 : tabBarHeight,
        backgroundColor: isDarkMode ? Color.darkTheme : Color.white,
        padding: 15,
      }}
      onScroll={(event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        scaleFooter.value = interpolate(offsetY, [0, 150], [1, 1.2]);
      }}
      scrollEventThrottle={16}
    >
      <Animated.View style={[styles.line, animatedTextStyle]}></Animated.View>
      <Animated.Text style={[styles.title, animatedTitleStyle]}>
        {t("aboutApp.title")}
      </Animated.Text>
      <Animated.View style={[styles.line, animatedTextStyle]}></Animated.View>

      <Animated.Text
        style={[
          styles.paragraph,
          animatedTextStyle,
          isDarkMode && { color: Color.defaultTheme },
        ]}
      >
        {t("aboutApp.welcome")}
      </Animated.Text>
      <Animated.Text
        style={[
          styles.paragraph,
          animatedTextStyle,
          isDarkMode && { color: Color.defaultTheme },
        ]}
      >
        {t("aboutApp.platform")}
      </Animated.Text>
      <Animated.Text style={[styles.subtitle, animatedTextStyle]}>
        {t("aboutApp.features.title")}
      </Animated.Text>
      <Animated.Text
        style={[
          styles.bulletPoint,
          animatedTextStyle,
          isDarkMode && { color: Color.defaultTheme },
        ]}
      >
        • {t("aboutApp.features.centralized")}
      </Animated.Text>
      <Animated.Text
        style={[
          styles.bulletPoint,
          animatedTextStyle,
          isDarkMode && { color: Color.defaultTheme },
        ]}
      >
        • {t("aboutApp.features.location")}
      </Animated.Text>
      <Animated.Text
        style={[
          styles.bulletPoint,
          animatedTextStyle,
          isDarkMode && { color: Color.defaultTheme },
        ]}
      >
        • {t("aboutApp.features.preferences")}
      </Animated.Text>
      <Animated.Text
        style={[
          styles.bulletPoint,
          animatedTextStyle,
          isDarkMode && { color: Color.defaultTheme },
        ]}
      >
        • {t("aboutApp.features.interface")}
      </Animated.Text>
      <Animated.Text
        style={[
          styles.bulletPoint,
          animatedTextStyle,
          isDarkMode && { color: Color.defaultTheme },
        ]}
      >
        • {t("aboutApp.features.experience")}
      </Animated.Text>
      <Animated.Text
        style={[
          styles.paragraph,
          animatedTextStyle,
          isDarkMode && { color: Color.defaultTheme },
        ]}
      >
        {t("aboutApp.mission")}
      </Animated.Text>
      <Animated.View style={[styles.footer, animatedFooterStyle]}>
        <Text style={styles.footerText}>
          {/* Built with a lot of work and love by Amir Fukman and Maor Saadia. */}
        </Text>
        <Text
          style={{
            ...styles.footerText,
            marginTop: -55,
            fontFamily: "",
            fontSize: 14,
            color: isDarkMode ? Color.Brown100 : Color.Brown700,
          }}
        >
          {new Date().getFullYear()} &copy; {t("aboutApp.copyright")}
        </Text>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  line: {
    borderTopWidth: 2,
    borderColor: Color.Brown500,
    marginBottom: 10,
  },
  title: {
    marginBottom: 20,
    fontSize: 32,
    fontFamily: "DancingScript",
    color: Color.Blue500,
    textAlign: "center",
  },
  paragraph: {
    fontFamily: "Merienda",
    fontSize: 14,
    textAlign: "left",
    marginVertical: 5,
  },
  subtitle: {
    fontFamily: "OrbitronMedium",
    fontSize: 20,
    marginVertical: 10,
    color: Color.Blue500,
  },
  bulletPoint: {
    fontFamily: "Merienda",
    fontSize: 14,
    marginVertical: 5,
    marginLeft: 20,
  },
  footer: {
    marginTop: 20,
    padding: 10,
    borderTopWidth: 2,
    borderColor: Color.Brown500,
    alignItems: "center",
    marginBottom: 10,
  },
  footerText: {
    fontSize: 16,
    fontFamily: "OrbitronMedium",
    color: Color.Blue100,
    textAlign: "center",
    marginBottom: 40,
  },
});

export default AboutScreen;
