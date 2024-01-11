import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  TouchableOpacity,
} from "react-native";
import Map from "../components/Map";
import { useState } from "react";

import { Color } from "../constants/colors";
import HouseCard from "../components/HouseCard";
import ProfileLocation from "../components/ProfileLocation";
import { useDarkMode } from "../context/DarkModeContext";
import { StatusBar } from "expo-status-bar";
import MapModal from "../modals/MapModal";

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
      <ScrollView style={{ flex: 1 }}>
        <Map handleMapPress={handleMapPress} />
        {mapPress && <MapModal handleMapPress={handleMapPress} />}

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
