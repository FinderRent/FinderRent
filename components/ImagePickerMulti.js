import React from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useTranslation } from "react-i18next";

const ImagePickerMulti = ({ apartmentImages, setApartmentImages }) => {
  const { t } = useTranslation();

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(t("Permission to access media library is required!"));
      return false;
    }

    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    if (cameraStatus !== "granted") {
      Alert.alert(t("Permission to access camera is required!"));
      return false;
    }

    return true;
  };

  const pickImages = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setApartmentImages(result.assets.map((asset) => asset.uri));
    } else {
      console.log("User cancelled image picker or no assets found");
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setApartmentImages([...apartmentImages, result.assets[0].uri]);
    } else {
      console.log("User cancelled image picker or no assets found");
    }
  };

  const removeImage = (uri) => {
    setApartmentImages(apartmentImages.filter((imageUri) => imageUri !== uri));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickImages}>
        <Text style={styles.buttonText}>{t("Pick Images from Gallery")}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Text style={styles.buttonText}>{t("Take Photo")}</Text>
      </TouchableOpacity>
      <ScrollView horizontal style={styles.scrollView}>
        {apartmentImages.map((uri, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeImage(uri)}
            >
              <Text style={styles.removeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "gray",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  scrollView: {
    marginTop: 0,
  },
  imageContainer: {
    position: "relative",
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
  },
  removeButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: 15 }, { translateY: -15 }],
    backgroundColor: "rgba(128, 128, 128, 0.7)", // Slightly gray and transparent
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ImagePickerMulti;
