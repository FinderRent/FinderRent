import { memo, useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { Text } from "react-native-paper";
import { Marker } from "react-native-maps";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PROVIDER_GOOGLE, PROVIDER_DEFAULT } from "react-native-maps";
import { useQuery } from "@tanstack/react-query";
import MapView from "react-native-map-clustering";

import { Color } from "../../constants/colors";
import { useDarkMode } from "../../context/DarkModeContext";
import { useUsers } from "../../context/UserContext";
import { useCurrency } from "../../context/CurrencyContext";
import { getDistances } from "../../utils/http";
import { convertCurrency } from "../../utils/features";

const type = [
  {
    name: "Land House",
    icon: "home",
  },
  {
    name: "Houseing Unit",
    icon: "home-city",
  },
  {
    name: "Tower",
    icon: "city",
  },
  {
    name: "Penthouse",
    icon: "city-variant",
  },
];

const ListingsMap = memo(({ navigation, listings, coordinates }) => {
  // console.log(listings[1]?.address.coordinates);

  const { isDarkMode } = useDarkMode();
  const { userData } = useUsers();
  const { currency } = useCurrency();

  const mapRef = useRef();
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
          longitude: geometry?.coordinates[0],
          latitude: geometry?.coordinates[1],
        }}
        onPress={onPress}
      >
        <View
          style={
            isDarkMode
              ? {
                  ...styles.marker,
                  backgroundColor: Color.buttomSheetDarkTheme,
                }
              : {
                  ...styles.marker,
                }
          }
        >
          <Text style={{ textAlign: "center" }}>{points}</Text>
        </View>
      </Marker>
    );
  };

  // Function to get the icon name based on apartment type
  const getIconName = (apartmentType) => {
    const typeObject = type.find((t) => t.name === apartmentType);
    return typeObject ? typeObject.icon : "home";
  };

  const {
    data: distances,
    // refetch: refetchDistance,
    // isFetching: isFetchingDistance,
  } = useQuery({
    queryKey: ["distances", coordinates],
    queryFn: () => getDistances(coordinates),
    enabled: !!coordinates,
  });

  const handleNavigation = (apartment) => {
    let distanceData = null;
    distances?.data.forEach((d) => {
      if (d._id === apartment._id) {
        distanceData = d;
      }
    });

    const apartmentWithDistance = {
      ...apartment,
      distance: distanceData ? distanceData.distance.toFixed(2) : null,
    };
    navigation.navigate("HouseDetailsScreen", { apartmentWithDistance });
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={Platform.OS === "ios" ? PROVIDER_DEFAULT : PROVIDER_GOOGLE}
        ref={mapRef}
        animationEnabled={false}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        clusterColor={isDarkMode ? Color.buttomSheetDarkTheme : Color.white}
        clusterTextColor={isDarkMode ? Color.defaultTheme : Color.darkTheme}
        renderCluster={renderCluster}
      >
        {listings?.map((apartment) => (
          <Marker
            coordinate={{
              latitude: +apartment.address?.coordinates?.latitude,
              longitude: +apartment.address?.coordinates?.longitude,
            }}
            key={apartment._id}
            onPress={() => handleNavigation(apartment)}
          >
            <View
              style={
                isDarkMode
                  ? {
                      ...styles.marker,
                      backgroundColor: Color.buttomSheetDarkTheme,
                    }
                  : {
                      ...styles.marker,
                    }
              }
            >
              <MaterialCommunityIcons
                name={getIconName(apartment?.apartmentType)}
                size={24}
                color={Color.gray}
              />
              <Text style={styles.markerText}>
                {" "}
                {currency?.symbol || apartment?.currency?.symbol}
                {convertCurrency(
                  apartment?.currency?.currency,
                  currency?.code,
                  apartment?.price
                )}
              </Text>
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
    padding: 4,
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
    fontSize: 12,
  },
  locateBtn: {
    position: "absolute",
    top: Platform.OS === "android" ? "85%" : "75%",
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
