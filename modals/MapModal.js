import React from "react";
import { View, StyleSheet, TouchableOpacity, Modal } from "react-native";
import MapView from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";

function MapModal(props) {
  const handleMapPress = () => {
    props.handleMapPress();
  };

  return (
    <Modal visible={true} transparent={true} animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <MapView style={styles.map} />
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
