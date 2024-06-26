import { StyleSheet, ScrollView, Platform, View } from "react-native";
import { Text } from "react-native-paper";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";

const AboutScreen = () => {
  const { isDarkMode } = useDarkMode();
  const tabBarHeight = useBottomTabBarHeight();
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingTop: Platform.OS === "ios" ? 0 : 15,
        marginBottom: Platform.OS === "ios" ? 0 : tabBarHeight,
        backgroundColor: isDarkMode ? Color.darkTheme : Color.white,
        padding: 15,
      }}
    >
      <View style={styles.line}></View>
      <Text style={styles.title}>About Our Application</Text>
      <View style={styles.line}></View>

      <Text style={styles.paragraph}>
        Welcome to our application, developed as part of our final project at
        the SCE College. Our innovative project is designed to revolutionize the
        way students find apartments for rent in academic areas. Our application
        addresses the challenges of traditional apartment search methods,
        replacing the cumbersome process of sifting through Facebook groups,
        social networks, and other outdated channels with a modern, efficient
        solution.
      </Text>
      <Text style={styles.paragraph}>
        Our platform is specifically tailored for students and apartment owners
        near academic institutions, offering a centralized hub where students
        can effortlessly connect with landlords. By leveraging advanced
        technologies such as geographic location services and personalized
        preferences, our application streamlines the apartment search process,
        making it easier and more intuitive.
      </Text>
      <Text style={styles.subtitle}>Key Features:</Text>
      <Text style={styles.bulletPoint}>
        • Centralized Platform: Bringing students and landlords together in one
        convenient place.
      </Text>
      <Text style={styles.bulletPoint}>
        • Geographic Location Services: Helping you find apartments based on
        proximity to your academic institution.
      </Text>
      <Text style={styles.bulletPoint}>
        • Personalized Preferences: Matching you with properties that meet your
        specific needs and preferences.
      </Text>
      <Text style={styles.bulletPoint}>
        • User-Friendly Interface: Ensuring a smooth and enjoyable search
        experience.
      </Text>
      <Text style={styles.bulletPoint}>
        • Comfortable User Experience: Simplifying the process of finding the
        perfect apartment.
      </Text>
      <Text style={styles.paragraph}>
        Our mission is to create a seamless and efficient apartment search
        experience for students, transforming a traditionally stressful process
        into a hassle-free journey. Join us and discover a better way to find
        your next home near your academic institution.
      </Text>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Built with a lot of work and love by Amir Fukman and Maor Saadia.
        </Text>
        <Text
          style={{
            ...styles.footerText,
            marginTop: -25,
            fontFamily: "",
            fontSize: 12,
            color: isDarkMode ? Color.Brown100 : Color.Brown700,
          }}
        >
          {new Date().getFullYear()} &copy; All Rights Reserved
        </Text>
      </View>
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
    textAlign: "justify",
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
