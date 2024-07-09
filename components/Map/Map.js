import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

const Map = (props) => {
  const handleMapPress = () => {
    props?.handleMapPress();
  };

  const street = props?.apartment?.address?.street;
  const buildingNumber = props?.apartment?.address?.buildingNumber;
  const apartmentNumber = props?.apartment?.address?.apartmentNumber;

  return (
    <TouchableOpacity activeOpacity={1} style={styles.mapWindow}>
      <View style={styles.map}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          onPress={handleMapPress}
          zoomEnabled={props?.zoomEnabled}
          scrollEnabled={props?.scrollEnabled}
          initialRegion={{
            latitude: props?.coordinates?.latitude || 30,
            longitude: props?.coordinates?.longitude || 32,
            latitudeDelta: 0.002,
            longitudeDelta: 0.002,
          }}
        >
          {props?.coordinates && (
            <Marker
              coordinate={{
                latitude: props?.coordinates?.latitude,
                longitude: props?.coordinates?.longitude,
              }}
              title={street}
              description={`Apartment Number: ${buildingNumber}/${apartmentNumber}`}
            />
          )}
        </MapView>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mapWindow: {
    borderRadius: 12,
    overflow: "hidden",
    height: 200,
    marginVertical: 10,
  },
  map: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

export default Map;
