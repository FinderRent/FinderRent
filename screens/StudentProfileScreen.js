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
} from "react-native";
import { Text } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../utils/http";
import { ScrollView } from "react-native-gesture-handler";

function StudentProfileScreen(props) {
  const userID = props.route.params.tenant;

  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    status: statusUser,
  } = useQuery({
    queryKey: ["User", userID],
    queryFn: () => fetchUser(userID),
  });

  if (isLoadingUser) return <Text>Loading...</Text>;
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
    marginTop: "15%", // Adjust as needed to control the spacing from the top
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
});
