import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Animated,
} from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import MapModal from "../modals/MapModal";

/**
 *
 * TODO: when map expand, adjust the bottom view of the map.
 */

const Map = (props) => {
  const animation = useRef(new Animated.Value(200)).current;

  const handleMapPress = () => {
    props.handleMapPress();
  };

  return (
    <TouchableOpacity activeOpacity={1} style={styles.mapWindow}>
      <View style={styles.map}>
        <MapView style={{ flex: 1 }} onPress={handleMapPress} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mapWindow: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
    margin: 10,
  },

  map: {
    width: "100%",
    height: "80%",
    resizeMode: "cover",
  },
});

export default Map;
