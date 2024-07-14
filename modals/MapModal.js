import { View, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

function MapModal(props) {
  const handleMapPress = () => {
    props.handleMapPress();
  };

  const street = props?.apartment?.address?.street;
  const buildingNumber = props?.apartment?.address?.buildingNumber;
  const apartmentNumber = props?.apartment?.address?.apartmentNumber;

  return (
    <Modal visible={true} transparent={true} animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: props?.coordinates?.latitude,
              longitude: props?.coordinates?.longitude,
              latitudeDelta: 0.001,
              longitudeDelta: 0.001,
            }}
            style={styles.map}
          >
            <Marker
              coordinate={{
                latitude: props?.coordinates.latitude,
                longitude: props?.coordinates.longitude,
              }}
              title={street}
              description={`Apartment Number: ${buildingNumber}/${apartmentNumber}`}
            />
          </MapView>

          <TouchableOpacity style={styles.closeButton} onPress={handleMapPress}>
            <MaterialIcons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "95%",
    height: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 12,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "red",
    borderRadius: 20,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
});

export default MapModal;
