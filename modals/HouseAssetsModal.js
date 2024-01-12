import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ListItem } from "react-native-elements";

function HouseAssetsModal(props) {
  const handleMapPress = () => {
    props.handleMapPress();
  };
  return (
    <Modal visible={true} transparent={true} animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.Header}>What this place offers</Text>
          <ScrollView>
            {props.Assets.map((l, i) => (
              <ListItem key={i} bottomDivider>
                <ListItem.Content>
                  <ListItem.Title>{l.name}</ListItem.Title>
                </ListItem.Content>
              </ListItem>
            ))}
          </ScrollView>
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
    padding: "5%",
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
  Header: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default HouseAssetsModal;
