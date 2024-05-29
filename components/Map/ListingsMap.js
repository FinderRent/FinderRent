import { memo, useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Marker } from "react-native-maps";
import { FontAwesome5 } from "@expo/vector-icons";
import MapView from "react-native-map-clustering";

import { Color } from "../../constants/colors";
import { useDarkMode } from "../../context/DarkModeContext";
import { useUsers } from "../../context/UserContext";

const ListingsMap = memo(({ listings, coordinates }) => {
  const { isDarkMode } = useDarkMode();
  const { userData } = useUsers();

  const mapRef = useRef();

  // Default INITIAL_REGION
  const DEFAULT_REGION = {
    latitude: 31.265058,
    longitude: 34.7839961,
    latitudeDelta: 7,
    longitudeDelta: 7,
  };

  // Conditional INITIAL_REGION based on the presence of token and coordinates
  const INITIAL_REGION =
    userData.token && coordinates
      ? {
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }
      : DEFAULT_REGION;

  useEffect(() => {
    if (userData.token && coordinates) {
      onLocateMe();
    }
  }, [userData.token, coordinates]);

  const onMarkerSelected = (event) => {
    console.log(event);
  };

  // Focus the map on the user's location
  const onLocateMe = () => {
    if (mapRef.current && coordinates) {
      const region = {
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };
      mapRef.current.animateToRegion(region);
    }
  };

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
          <Text style={{ color: "#000", textAlign: "center" }}>{points}</Text>
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
      {userData.token && (
        <TouchableOpacity
          style={
            isDarkMode
              ? { ...styles.locateBtn, backgroundColor: Color.darkTheme }
              : styles.locateBtn
          }
          onPress={onLocateMe}
        >
          <FontAwesome5
            name="crosshairs"
            size={24}
            color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
          />
        </TouchableOpacity>
      )}
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
