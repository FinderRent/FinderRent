import { View, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import MapView from "react-native-maps";

function MapModal(props) {
  const handleMapPress = () => {
    props.handleMapPress();
  };

  return (
    <Modal visible={true} transparent={true} animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <MapView
            initialRegion={{
              latitude: 31.2516416588409,
              longitude: 34.78916604217377,
              latitudeDelta: 0.0043,
              longitudeDelta: 0.0034,
            }}
            style={styles.map}
          />
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
    height: "85%", // adjust height as needed
    backgroundColor: "#fff", // change background color here
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
