import React from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import MapView from "react-native-maps";
import { academicList } from "../../data/academic";
/**
 *
 * TODO: when map expand, adjust the bottom view of the map.
 */

const Map = (props) => {
  const handleMapPress = () => {
    props.handleMapPress();
  };

  const location = academicList.find(
    (item) => item.id === "מכללת סמי שמעון באר שבע"
  );

  var marker = {
    latitude: location.coordinates.lat,
    longitude: location.coordinates.lng,
    title: location.name,
  };

  return (
    <TouchableOpacity activeOpacity={1} style={styles.mapWindow}>
      <View style={styles.map}>
        <MapView
          style={{ flex: 1 }}
          onPress={handleMapPress}
          zoomEnabled={props.zoomEnabled}
          scrollEnabled={props.scrollEnabled}
          initialRegion={marker}
          // userLocationUpdateInterval={
          //   academicList.filter("מכללת סמי שמעון באר שבע").coordinates
          // }
        />
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
