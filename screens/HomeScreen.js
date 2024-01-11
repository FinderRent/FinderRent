import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  TouchableOpacity,
} from "react-native";
import Map from "../components/Map/Map";
import { useState } from "react";

import { Color } from "../constants/colors";
import HouseCard from "../components/House/HouseCard";
import ProfileLocation from "../components/ProfileLocation";
import { useDarkMode } from "../context/DarkModeContext";
import { StatusBar } from "expo-status-bar";
import MapModal from "../modals/MapModal";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

/**
 * TODO:
 * when press on the profile photo, go to profile page.
 * when press on the location, open a search new location option
 * make the cards dynamic data from the DB
 */

function HomeScreen({ navigation }) {
  const { isDarkMode } = useDarkMode();
  const [mapPress, setMapPress] = useState(false);

  const handleMapPress = () => {
    setMapPress(!mapPress);
  };

  const tabBarHeight = useBottomTabBarHeight();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "ios" ? 0 : 35,
        backgroundColor: isDarkMode ? Color.darkTheme : Color.white,
      }}
    >
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <ProfileLocation />
      <ScrollView style={{ flex: 1, marginBottom: tabBarHeight - 50 }}>
        {/* <Map handleMapPress={handleMapPress} />
        {mapPress && <MapModal handleMapPress={handleMapPress} />} */}

        <TouchableOpacity
          onPress={() => navigation.navigate("HouseDetailsScreen")}
        >
          <HouseCard navigation={navigation} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("HouseDetailsScreen")}
        >
          <HouseCard navigation={navigation} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("HouseDetailsScreen")}
        >
          <HouseCard navigation={navigation} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});

export default HomeScreen;
