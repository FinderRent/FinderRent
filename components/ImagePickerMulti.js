// import React from "react";
// import {
//   View,
//   StyleSheet,
//   Alert,
//   Image,
//   TouchableOpacity,
//   Text,
// } from "react-native";
// import { ScrollView } from "react-native-gesture-handler";
// import { useTranslation } from "react-i18next";
// import * as ImagePicker from "expo-image-picker";

// import { Color } from "../constants/colors";
// import { useDarkMode } from "../context/DarkModeContext";

// const ImagePickerMulti = ({ apartmentImages, setApartmentImages }) => {
//   const { t } = useTranslation();
//   const { isDarkMode } = useDarkMode();

//   const requestPermission = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert(t("Permission to access media library is required!"));
//       return false;
//     }

//     const { status: cameraStatus } =
//       await ImagePicker.requestCameraPermissionsAsync();
//     if (cameraStatus !== "granted") {
//       Alert.alert(t("Permission to access camera is required!"));
//       return false;
//     }

//     return true;
//   };

//   const pickImages = async () => {
//     const hasPermission = await requestPermission();
//     if (!hasPermission) return;

//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsMultipleSelection: true,
//       quality: 1,
//     });

//     if (!result.canceled && result.assets) {
//       setApartmentImages(result.assets.map((asset) => asset.uri));
//     } else {
//       console.log("User cancelled image picker or no assets found");
//     }
//   };

//   const takePhoto = async () => {
//     const hasPermission = await requestPermission();
//     if (!hasPermission) return;

//     let result = await ImagePicker.launchCameraAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 1,
//     });

//     if (!result.canceled && result.assets) {
//       setApartmentImages([...apartmentImages, result.assets[0].uri]);
//     } else {
//       console.log("User cancelled image picker or no assets found");
//     }
//   };

//   const removeImage = (uri) => {
//     setApartmentImages(apartmentImages.filter((imageUri) => imageUri !== uri));
//   };

//   return (
//     <>
//       <View style={styles.container}>
//         <TouchableOpacity
//           style={
//             isDarkMode
//               ? { ...styles.button, backgroundColor: Color.defaultTheme }
//               : styles.button
//           }
//           onPress={pickImages}
//         >
//           <Text
//             style={
//               isDarkMode
//                 ? { ...styles.buttonText, color: "black" }
//                 : styles.buttonText
//             }
//           >
//             {t("Pick Images from Gallery")}
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={
//             isDarkMode
//               ? { ...styles.button, backgroundColor: Color.defaultTheme }
//               : styles.button
//           }
//           onPress={takePhoto}
//         >
//           <Text
//             style={
//               isDarkMode
//                 ? { ...styles.buttonText, color: "black" }
//                 : styles.buttonText
//             }
//           >
//             {t("Take Photo")}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <View>
//         <ScrollView
//           horizontal
//           style={styles.scrollView}
//           nestedScrollEnabled={true}
//         >
//           {apartmentImages.map((uri, index) => (
//             <View key={index} style={styles.imageContainer}>
//               <Image source={{ uri }} style={styles.image} />
//               <TouchableOpacity
//                 style={styles.removeButton}
//                 onPress={() => removeImage(uri)}
//               >
//                 <Text style={styles.removeButtonText}>X</Text>
//               </TouchableOpacity>
//             </View>
//           ))}
//         </ScrollView>
//       </View>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },
//   button: {
//     backgroundColor: Color.darkTheme,
//     borderRadius: 20,
//     marginTop: 30,
//     marginBottom: -15,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     marginHorizontal: 10,
//   },
//   buttonText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   scrollView: {
//     marginTop: 0,
//   },
//   imageContainer: {
//     position: "relative",
//     marginRight: 10,
//     marginTop: 30,
//     marginBottom: -20,
//   },
//   image: {
//     width: 100,
//     height: 100,
//   },
//   removeButton: {
//     position: "absolute",
//     top: "33%",
//     left: "50%",
//     transform: [{ translateX: 15 }, { translateY: -15 }],
//     backgroundColor: "rgba(128, 128, 128, 0.7)", // Slightly gray and transparent
//     borderRadius: 15,
//     width: 30,
//     height: 30,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   removeButtonText: {
//     color: "white",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
// });

// export default ImagePickerMulti;

import React from "react";
import {
  View,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  Text,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import { checkRtllanguages } from "../utils/features";

const ImagePickerMulti = ({ apartmentImages, setApartmentImages }) => {
  const { t, i18n } = useTranslation();
  const { isDarkMode } = useDarkMode();

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
      setApartmentImages([
        ...apartmentImages,
        ...result.assets.map((asset) => asset.uri),
      ]);
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
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={
            isDarkMode
              ? { ...styles.button, backgroundColor: Color.defaultTheme }
              : styles.button
          }
          onPress={pickImages}
        >
          <Text
            style={
              isDarkMode
                ? { ...styles.buttonText, color: "black" }
                : styles.buttonText
            }
          >
            {t("Pick Images from Gallery")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={
            isDarkMode
              ? { ...styles.button, backgroundColor: Color.defaultTheme }
              : styles.button
          }
          onPress={takePhoto}
        >
          <Text
            style={
              isDarkMode
                ? { ...styles.buttonText, color: "black" }
                : styles.buttonText
            }
          >
            {t("Take Photo")}
          </Text>
        </TouchableOpacity>
      </View>

      <View>
        <ScrollView
          horizontal
          style={styles.scrollView}
          nestedScrollEnabled={true}
        >
          {apartmentImages.map((uri, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri }} style={styles.image} />
              <TouchableOpacity
                style={[
                  styles.removeButton,
                  !checkRtllanguages(i18n.language) && { left: "20%" },
                ]}
                onPress={() => removeImage(uri)}
              >
                <Text style={styles.removeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: Color.darkTheme,
    borderRadius: 20,
    marginTop: 30,
    marginBottom: -15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
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
    marginTop: 30,
    marginBottom: -20,
  },
  image: {
    width: 100,
    height: 100,
  },
  removeButton: {
    position: "absolute",
    top: "33%",
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
