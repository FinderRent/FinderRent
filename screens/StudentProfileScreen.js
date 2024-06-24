import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  Platform,
  TouchableOpacity,
  View,
  Keyboard,
  Image,
  Linking,
} from "react-native";
import { Text } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../utils/http";
import { ScrollView } from "react-native-gesture-handler";
import Loader from "../components/ui/Loader";
import Icon from "react-native-vector-icons/Ionicons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

function StudentProfileScreen(props) {
  const userID = props.route.params.tenant;
  const tabBarHeight = useBottomTabBarHeight();

  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    status: statusUser,
  } = useQuery({
    queryKey: ["User", userID],
    queryFn: () => fetchUser(userID),
  });

  if (isLoadingUser) return <Loader />;
  if (isErrorUser) return <Text>Error loading user</Text>;

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: user.avatar?.url,
              }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.name}>{user.firstName}</Text>
            <Text style={styles.role}>Student</Text>
          </View>
        </View>
        <View style={styles.detailsContainer}>
          <Icon name="school" size={35} />
          <Text style={styles.funFactText}>{user.academic}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Icon name="today" size={35} />
          <Text style={styles.funFactText}>{user.department}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Icon name="body-sharp" size={35} />
          <Text style={styles.funFactText}>Age: {user.age}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Icon name="game-controller-sharp" size={35} />
          <Text style={styles.funFactText}>
            Hobbies: {user.hobbies ? user.hobbies : "Empty"}
          </Text>
        </View>
        <View style={styles.detailsContainer}>
          <Icon name="beer" size={35} />
          <Text style={styles.funFactText}>
            Fun Fact: {user.funFact ? user.funFact : "Empty"}
          </Text>
        </View>

        {/* Social Links Section */}
        <View style={styles.socialLinksContainer}>
          <Text style={styles.socialLinksTitle}>Connect with me</Text>
          <View style={styles.socialLinks}>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  "https://www.facebook.com/amir.fukman.1?mibextid=LQQJ4d"
                )
              }
            >
              <Icon name="logo-facebook" size={35} color="#3b5998" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  "https://www.instagram.com/amir_fukman?igsh=MWhlamhxcm0zcmk1MQ%3D%3D&utm_source=qr"
                )
              }
            >
              <Icon name="logo-instagram" size={35} color="#C13584" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  "https://www.linkedin.com/in/amir-fukman-9093b019a/"
                )
              }
            >
              <Icon name="logo-linkedin" size={35} color="#0A66C2" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.footer, { height: tabBarHeight + 10 }]}></View>
      </View>
    </ScrollView>
  );
}

export default StudentProfileScreen;

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 10,
  },
  card: {
    width: "90%",
    aspectRatio: 1.2, // Ensures the card maintains a square shape
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: "20%", // Adjust as needed to control the spacing from the top
    marginBottom: 10,
  },
  imageContainer: {
    width: "60%",
    aspectRatio: 1,
    borderRadius: 100,
    overflow: "hidden",
    marginBottom: 5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    alignItems: "center",
  },
  name: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 5,
  },
  role: {
    fontSize: 16,
    color: "#373A40",
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  funFactText: {
    marginLeft: 10,
    fontSize: 20,
    color: "#373A40",
    paddingRight: "12%",
  },
  socialLinksContainer: {
    marginTop: 10,
    alignItems: "center",
    width: "100%",
  },
  socialLinksTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 40,
    textAlign: "center",
  },
  socialLinks: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "80%",
  },
});
