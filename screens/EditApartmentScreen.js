import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  Platform,
  TouchableOpacity,
  View,
  Keyboard,
  Button,
  KeyboardAvoidingView,
} from "react-native";
import { Text, TextInput, Divider } from "react-native-paper";
import DropDown from "../components/inputs/DropDown";
import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import { useUsers } from "../context/UserContext";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { updateEditedApartment } from "../utils/http";
import FlashMessage, { showMessage } from "react-native-flash-message";

function EditApartmentScreen({ route, navigation }) {
  const { apartment } = route.params;

  const { userData } = useUsers();
  const [country, setCountry] = useState(apartment.address.country);
  const [city, setCity] = useState(apartment.address.city);
  const [street, setStreet] = useState(apartment.address.street);
  const [buildingNumber, setBuildingNumber] = useState(
    apartment.address.buildingNumber.toString()
  );
  const [apartmentNumber, setApartmentNumber] = useState(
    apartment.address.apartmentNumber.toString()
  );
  const [floor, setFloor] = useState(apartment.floor.toString());
  const [rooms, setRooms] = useState(apartment.numberOfRooms.toString());
  const [price, setPrice] = useState(apartment.price.toString());
  const [totalCapacity, setTotalCapacity] = useState(
    apartment.totalCapacity.toString()
  );
  const [realTimeCapacity, setRealTimeCapacity] = useState(
    apartment.realTimeCapacity.toString()
  );
  const [houseType, setHouseType] = useState(""); /////not working
  const [selected, setSelected] = useState([]); ///need to do
  const [about, setAbout] = useState(apartment.about);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const houseTypeList = [
    { label: "Land House", value: "Year Land House" },
    { label: "Housing Unit", value: "Housing Unit" },
    { label: "Tower", value: "Tower" },
    { label: "Penthouse", value: "Penthouse" },
  ];
  const houseAssets = [
    { key: "TV", value: "TV" },
    { key: "Balcony", value: "Balcony" },
    { key: "Beds", value: "Beds" },
    { key: "Wifi", value: "Wifi" },
    { key: "Oven", value: "Oven" },
    { key: "Microwave", value: "Microwave" },
    { key: "Couch", value: "Couch" },
    { key: "Coffee Table", value: "Coffee Table" },
    { key: "Water Heater", value: "Water Heater" },
    { key: "Washer", value: "Washer" },
    { key: "Dryer", value: "Dryer" },
    { key: "Iron", value: "Iron" },
    { key: "Refrigirator", value: "Refrigirator" },
    { key: "freezer", value: "freezer" },
  ];

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleFocus = (input) => {
    setFocusedInput(input);
  };

  const handleBlur = () => {
    setFocusedInput(null);
  };

  function createApartmentContent(features) {
    // List of all possible features
    const allFeatures = [
      "tv",
      "balcony",
      "bed",
      "wifi",
      "oven",
      "microwave",
      "couch",
      "coffeeTable",
      "waterHeater",
      "washer",
      "dryer",
      "iron",
      "refrigerator",
      "freezer",
    ];

    // Initialize the apartment content object with all features set to false
    const apartmentContent = {};
    allFeatures.forEach((feature) => {
      apartmentContent[feature] = false;
    });

    // Mapping of input features to standardized features
    const featureMapping = {
      tv: "tv",
      television: "tv",
      beds: "bed",
      bed: "bed",
      wifi: "wifi",
      "wi-fi": "wifi",
      "wireless internet": "wifi",
      balcony: "balcony",
      oven: "oven",
      microwave: "microwave",
      couch: "couch",
      "coffee table": "coffeeTable",
      "water heater": "waterHeater",
      washer: "washer",
      dryer: "dryer",
      iron: "iron",
      refrigerator: "refrigerator",
      fridge: "refrigerator",
      freezer: "freezer",
    };

    // Set the features from the input array to true
    features.forEach((feature) => {
      const lowerCaseFeature = feature.toLowerCase();
      if (featureMapping.hasOwnProperty(lowerCaseFeature)) {
        const standardizedFeature = featureMapping[lowerCaseFeature];
        apartmentContent[standardizedFeature] = true;
      }
    });

    return apartmentContent;
  }

  //object to send to the backend
  const apartmentData = {
    id: apartment._id,
    address: {
      street: street,
      city: city,
      country: country,
      buildingNumber:
        buildingNumber !== "" ? parseInt(buildingNumber) : undefined,
      apartmentNumber:
        apartmentNumber !== "" ? parseInt(apartmentNumber) : undefined,
      coordinates: {
        latitude: 23.232323,
        longitude: 65.234556,
      },
    },
    distanceFromAcademy: 20,
    totalCapacity: totalCapacity !== "" ? parseInt(totalCapacity) : undefined,
    realTimeCapacity:
      realTimeCapacity !== "" ? parseInt(realTimeCapacity) : undefined,
    about: about,
    numberOfRooms: rooms !== "" ? parseInt(rooms) : undefined,
    apartmentContent: createApartmentContent(selected),
    rating: 5,
    price: price !== "" ? parseInt(price) : undefined,
    // images: [5],
    floor: floor !== "" ? parseInt(floor) : undefined,
    owner: userData.id,
    houseType: houseType,
  };

  const handleButtonPress = async () => {
    try {
      const data = await updateEditedApartment(apartmentData);
      showMessage({
        message: "Success",
        description: "Apartment edited successfully!",
        type: "success",
      });
      navigation.goBack();
      navigation.goBack();
    } catch (error) {
      showMessage({
        message: "Error",
        description: "Failed to edit apartment",
        type: "danger",
      });
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollViewContent}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={50} // Increased this value to move the text input further up
      keyboardOpeningTime={0}
    >
      <View style={styles.container}>
        <Text style={styles.mainHeader}>Edit Your Apartment</Text>
        <View>
          <View>
            <Text style={styles.subHeader}>Address</Text>
            <View style={styles.line}>
              <TextInput
                mode="outlined"
                label="Country"
                defaultValue={country}
                value={country}
                onChangeText={(country) => setCountry(country)}
                style={styles.input}
              />
              <TextInput
                mode="outlined"
                label="City"
                value={city}
                onChangeText={(city) => setCity(city)}
                style={styles.input}
              />
            </View>
            <View style={styles.line}>
              <TextInput
                mode="outlined"
                label="Street"
                value={street}
                onChangeText={(street) => setStreet(street)}
                style={styles.input}
              />
              <TextInput
                keyboardType="numeric"
                mode="outlined"
                label="Building Number"
                value={buildingNumber}
                onChangeText={(buildingNumber) =>
                  setBuildingNumber(buildingNumber)
                }
                style={styles.input}
              />
            </View>
            <View style={styles.line}>
              <TextInput
                keyboardType="numeric"
                mode="outlined"
                label="Apartment Number"
                value={apartmentNumber}
                onChangeText={(apartmentNumber) =>
                  setApartmentNumber(apartmentNumber)
                }
                style={styles.input}
              />
              <TextInput
                keyboardType="numeric"
                mode="outlined"
                label="Floor"
                value={floor}
                onChangeText={(floor) => setFloor(floor)}
                style={styles.input}
              />
            </View>
          </View>
          <View>
            <Text style={styles.subHeader}>General Details</Text>
            <View style={styles.line}>
              <TextInput
                keyboardType="numeric"
                mode="outlined"
                label="Number Of Rooms"
                value={rooms}
                onChangeText={(rooms) => setRooms(rooms)}
                style={styles.input}
              />
              <TextInput
                keyboardType="numeric"
                mode="outlined"
                label="Monthly Rent"
                value={price}
                onChangeText={(price) => setPrice(price)}
                style={styles.input}
              />
            </View>
            <View style={styles.line}>
              <TextInput
                keyboardType="numeric"
                mode="outlined"
                label="Total Capacity"
                value={totalCapacity}
                onChangeText={(totalCapacity) =>
                  setTotalCapacity(totalCapacity)
                }
                style={styles.input}
              />
              <TextInput
                keyboardType="numeric"
                mode="outlined"
                label="Real Time Capacity"
                value={realTimeCapacity}
                onChangeText={(realTimeCapacity) =>
                  setRealTimeCapacity(realTimeCapacity)
                }
                style={styles.input}
              />
            </View>
          </View>
          <View>
            <Text style={styles.subHeader}>Type</Text>
            <View>
              <DropDown
                style={styles.DropDown}
                dropDownDirection="TOP" // This will force the dropdown to always open to the top
                list={houseTypeList}
                label="House Type"
                placeholder={houseType}
                searchable={false}
                listMode="SCROLLVIEW"
                onValueChange={(houseType) => setHouseType(houseType)}
              />
            </View>
          </View>
          <View>
            <Text style={styles.subHeader}>House Assets</Text>
            <View style={styles.MultipleSelectList}>
              <MultipleSelectList
                dropdownShown={false}
                search={false}
                setSelected={(selected) => {
                  setSelected(selected);
                }}
                data={houseAssets}
                save="value"
                label="House Assets"
              />
            </View>
          </View>

          <View>
            <Text style={styles.subHeader}>About</Text>
            <View style={styles.paragraphContainer}>
              <TextInput
                id="paragraph"
                style={styles.paragraphInput}
                placeholder="Describe your apartment"
                multiline={true}
                numberOfLines={4}
                onChangeText={(about) => setAbout(about)}
                value={about}
                textAlignVertical="top"
                onFocus={() => handleFocus("about")}
                onBlur={handleBlur}
              />
            </View>
          </View>
          <View>
            <Text style={styles.subHeader}>Photos</Text>
          </View>
          <Divider bold={true} style={{ margin: 5 }} />
          <View>
            <TouchableOpacity onPress={handleButtonPress} style={styles.button}>
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

export default EditApartmentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: "5%",
    marginTop: "15%",
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
  mainHeader: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 5,
    marginTop: 15,
  },
  line: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    flex: 1,
    marginHorizontal: 5,
  },
  DropDown: {},
  MultipleSelectList: {
    marginTop: 5,
    marginHorizontal: 5,
  },
  paragraphContainer: {
    flex: 1,
    paddingBottom: 10,
  },
  paragraphInput: {
    // height: 150,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    margin: 5,
    backgroundColor: "#fff",
  },

  button: {
    backgroundColor: "#74E291",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    marginVertical: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
