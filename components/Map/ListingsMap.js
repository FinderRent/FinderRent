import * as Location from "expo-location";
import { memo, useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Marker } from "react-native-maps";
import { FontAwesome5 } from "@expo/vector-icons";
import MapView from "react-native-map-clustering";

import { Color } from "../../constants/colors";
import { useDarkMode } from "../../context/DarkModeContext";

const ListingsMap = memo(({ listings }) => {
  const { isDarkMode } = useDarkMode();

  const mapRef = useRef();

  // When the component mounts, locate the user
  // useEffect(() => {
  //   onLocateMe();
  // }, []);

  const INITIAL_REGION = {
    latitude: 31.2516416588409,
    longitude: 34.78916604217377,
    latitudeDelta: 0.009,
    longitudeDelta: 0.009,
  };

  // When a marker is selected, navigate to the listing page
  const onMarkerSelected = (event) => {
    console.log(event);
  };

  // Focus the map on the user's location
  // const onLocateMe = async () => {
  //   let { status } = await Location.requestForegroundPermissionsAsync();
  //   if (status !== "granted") {
  //     return;
  //   }

  //   let location = await Location.getCurrentPositionAsync({});
  //   // console.log("Location:", location);

  //   const region = {
  //     latitude: location.coords.latitude,
  //     longitude: location.coords.longitude,
  //     latitudeDelta: 7,
  //     longitudeDelta: 7,
  //   };

  //   // console.log(region);

  //   mapRef.current?.animateToRegion(region);
  // };

  // Overwrite the renderCluster function to customize the cluster markers
  const renderCluster = (cluster) => {
    const { id, geometry, onPress, properties } = cluster;

    const points = properties.point_count;
    return (
      <Marker
        key={`cluster-${id}`}
        coordinate={{
          longitude: geometry.coordinates[0],
          latitude: geometry.coordinates[1],
        }}
        onPress={onPress}
      >
        <View style={styles.marker}>
          <Text
            style={{
              color: "#000",
              textAlign: "center",
            }}
          >
            {points}
          </Text>
        </View>
      </Marker>
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        animationEnabled={false}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        clusterColor="#fff"
        clusterTextColor="#000"
        renderCluster={renderCluster}
      >
        {listings.features.map((item) => (
          <Marker
            coordinate={{
              latitude: +item.properties.latitude,
              longitude: +item.properties.longitude,
            }}
            key={item.properties.id}
            onPress={() => onMarkerSelected(item)}
          >
            <View style={styles.marker}>
              <Text style={styles.markerText}>$ {item.properties.price}</Text>
            </View>
          </Marker>
        ))}
      </MapView>
      <TouchableOpacity
        style={
          isDarkMode
            ? { ...styles.locateBtn, backgroundColor: Color.darkTheme }
            : styles.locateBtn
        }
        // onPress={onLocateMe}
      >
        <FontAwesome5
          name="crosshairs"
          size={24}
          color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
        />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 4,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  marker: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    elevation: 5,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
  markerText: {
    fontSize: 14,
  },
  locateBtn: {
    position: "absolute",
    top: "85%",
    right: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
});

export default ListingsMap;
