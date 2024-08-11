import { useEffect, useState } from "react";
import { StyleSheet, View, Keyboard, Platform } from "react-native";
import { Text, Divider, Button } from "react-native-paper";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { showMessage } from "react-native-flash-message";
import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import { updateEditedApartment } from "../utils/http";
import { useUsers } from "../context/UserContext";
import Input from "../components/inputs/Input";
import DropDown from "../components/inputs/DropDown";
import ErrorMessage from "../components/ui/ErrorMessage";
import NavLink from "../components/ui/NavLink";
import { useTranslation } from "react-i18next";

function EditApartmentScreen({ route, navigation }) {
  const { t } = useTranslation();

  const { isDarkMode } = useDarkMode();

  const { apartment } = route.params;

  const selectedFeatures = Object.keys(apartment.apartmentContent).filter(
    (key) => apartment.apartmentContent[key] === true
  );

  const { userData } = useUsers();
  const [country, setCountry] = useState(apartment?.address.country);
  const [city, setCity] = useState(apartment?.address.city);
  const [street, setStreet] = useState(apartment?.address.street);
  const [buildingNumber, setBuildingNumber] = useState(
    apartment?.address.buildingNumber.toString()
  );
  const [apartmentNumber, setApartmentNumber] = useState(
    apartment?.address.apartmentNumber.toString()
  );
  const [coordinates, setCoordinates] = useState({
    latitude: apartment?.address?.coordinates.latitude.toString(),
    longitude: apartment?.address?.coordinates.longitude.toString(),
  });
  const [floor, setFloor] = useState(apartment?.floor.toString());
  const [rooms, setRooms] = useState(apartment?.numberOfRooms.toString());
  const [price, setPrice] = useState(apartment?.price.toString());
  const [totalCapacity, setTotalCapacity] = useState(
    apartment?.totalCapacity.toString()
  );
  const [realTimeCapacity, setRealTimeCapacity] = useState(
    apartment?.realTimeCapacity.toString()
  );

  const [apartmentType, setApartmentType] = useState(apartment?.apartmentType);
  const [selected, setSelected] = useState([]); ///need to do
  const [about, setAbout] = useState(apartment?.about);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const apartmentTypeList = [
    { label: t("landHouse"), value: "Land House" },
    { label: t("housingUnit"), value: "Housing Unit" },
    { label: t("tower"), value: "Tower" },
    { label: t("penthouse"), value: "Penthouse" },
  ];

  const houseAssets = [
    { key: "TV", value: t("tv") },
    { key: "Balcony", value: t("balcony") },
    { key: "Beds", value: t("beds") },
    { key: "Wifi", value: t("wifi") },
    { key: "Oven", value: t("oven") },
    { key: "Microwave", value: t("microwave") },
    { key: "Couch", value: t("couch") },
    { key: "Coffee Table", value: t("coffeeTable") },
    { key: "Water Heater", value: t("waterHeater") },
    { key: "Washer", value: t("washer") },
    { key: "Dryer", value: t("dryer") },
    { key: "Iron", value: t("iron") },
    { key: "Refrigirator", value: t("refrigirator") },
    { key: "freezer", value: t("freezer") },
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
      street,
      city,
      country,
      buildingNumber:
        buildingNumber !== "" ? parseInt(buildingNumber) : undefined,
      apartmentNumber:
        apartmentNumber !== "" ? parseInt(apartmentNumber) : undefined,
      coordinates,
    },
    distanceFromAcademy: 20,
    totalCapacity: totalCapacity !== "" ? parseInt(totalCapacity) : undefined,
    realTimeCapacity:
      realTimeCapacity !== "" ? parseInt(realTimeCapacity) : undefined,
    about,
    numberOfRooms: rooms !== "" ? parseInt(rooms) : undefined,
    apartmentContent: createApartmentContent(selected),
    rating: 5,
    price: price !== "" ? parseInt(price) : undefined,
    // images: [5],
    floor: floor !== "" ? parseInt(floor) : undefined,
    owner: userData.id,
    apartmentType,
  };

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (apartmentData) => updateEditedApartment(apartmentData),
    onSuccess: () => {
      if (Platform.OS === "ios") {
        showMessage({
          message: "Success",
          description: "Apartment edited successfully!",
          type: "success",
        });
      } else {
        Toast.show({
          type: "success",
          text1: "Apartment edited successfully!",
        });
      }
      navigation.goBack();
      navigation.goBack();
    },
    onError: (err) => {
      console.log(err.message);
    },
  });

  const handleEditApartment = () => {
    mutate(apartmentData);
  };

  // const handleButtonPress = async () => {
  //   try {
  //     const data = await updateEditedApartment(apartmentData);
  //     showMessage({
  //       message: "Success",
  //       description: "Apartment edited successfully!",
  //       type: "success",
  //     });
  //     navigation.goBack();
  //     navigation.goBack();
  //   } catch (error) {
  //     showMessage({
  //       message: "Error",
  //       description: "Failed to edit apartment",
  //       type: "danger",
  //     });
  //   }
  // };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollViewContent}
      keyboardShouldPersistTaps="handled"
      // enableOnAndroid={true}
      extraScrollHeight={50}
      keyboardOpeningTime={0}
    >
      <View style={styles.container}>
        <Text style={styles.mainHeader}>{t("editYourApartment")}</Text>
        <View>
          <View>
            <Text style={styles.subHeader}>{t("address")}</Text>
            <View style={styles.line}>
              <Input
                mode="outlined"
                label={t("country")}
                defaultValue={country}
                value={country}
                onValueChange={(country) => setCountry(country)}
                style={styles.input}
              />
              <Input
                mode="outlined"
                label={t("city")}
                value={city}
                onValueChange={(city) => setCity(city)}
                style={styles.input}
              />
            </View>
            <View style={styles.line}>
              <Input
                mode="outlined"
                label={t("street")}
                value={street}
                onValueChange={(street) => setStreet(street)}
                style={styles.input}
              />
              <Input
                keyboardType="numeric"
                mode="outlined"
                label={t("buildingNumber")}
                value={buildingNumber}
                onValueChange={(buildingNumber) =>
                  setBuildingNumber(buildingNumber)
                }
                style={styles.input}
              />
            </View>
            <View style={styles.line}>
              <Input
                keyboardType="numeric"
                mode="outlined"
                label={t("apartmentNumber")}
                value={apartmentNumber}
                onValueChange={(apartmentNumber) =>
                  setApartmentNumber(apartmentNumber)
                }
                style={styles.input}
              />
              <Input
                keyboardType="numeric"
                mode="outlined"
                label={t("floor")}
                value={floor}
                onValueChange={(floor) => setFloor(floor)}
                style={styles.input}
              />
            </View>
            <View>
              <Text style={styles.subHeader}>
                {t("checkApartmentCoordinates")}
              </Text>
              <View style={styles.line}>
                <Input
                  keyboardType="numeric"
                  mode="outlined"
                  label={t("latitude")}
                  value={coordinates.latitude}
                  onValueChange={(latitude) =>
                    setCoordinates((prev) => ({ ...prev, latitude }))
                  }
                  style={styles.input}
                />
                <Input
                  keyboardType="numeric"
                  mode="outlined"
                  label={t("longitude")}
                  value={coordinates.longitude}
                  onValueChange={(longitude) =>
                    setCoordinates((prev) => ({ ...prev, longitude }))
                  }
                  style={styles.input}
                />
              </View>
            </View>
          </View>
          <View>
            <Text style={styles.subHeader}>{t("generalDetails")}</Text>
            <View style={styles.line}>
              <Input
                keyboardType="numeric"
                mode="outlined"
                label={t("numberOfRooms")}
                value={rooms}
                onValueChange={(rooms) => setRooms(rooms)}
                style={styles.input}
              />
              <Input
                keyboardType="numeric"
                mode="outlined"
                label={t("monthlyRent")}
                value={price}
                onValueChange={(price) => setPrice(price)}
                style={styles.input}
              />
            </View>
            <View style={styles.line}>
              <Input
                keyboardType="numeric"
                mode="outlined"
                label={t("totalCapacity")}
                value={totalCapacity}
                onValueChange={(totalCapacity) =>
                  setTotalCapacity(totalCapacity)
                }
                style={styles.input}
              />
              <Input
                keyboardType="numeric"
                mode="outlined"
                label={t("RealTimeCapacity")}
                value={realTimeCapacity}
                onValueChange={(realTimeCapacity) =>
                  setRealTimeCapacity(realTimeCapacity)
                }
                style={styles.input}
              />
            </View>
          </View>
          <View>
            <Text style={styles.subHeader}>{t("type")}</Text>
            <View>
              <DropDown
                style={styles.DropDown}
                dropDownDirection="TOP"
                list={apartmentTypeList}
                label={t("houseType")}
                placeholder={apartmentType}
                searchable={false}
                listMode="SCROLLVIEW"
                onValueChange={(apartmentType) =>
                  setApartmentType(apartmentType)
                }
              />
            </View>
          </View>
          <View>
            <Text style={styles.subHeader}>{t("houseAssetsHeader")}</Text>
            <View style={styles.MultipleSelectList}>
              <MultipleSelectList
                inputStyles={{
                  color: isDarkMode ? Color.defaultTheme : Color.darkTheme,
                }}
                dropdownTextStyles={{
                  color: isDarkMode ? Color.defaultTheme : Color.darkTheme,
                }}
                labelStyles={{
                  color: isDarkMode ? Color.defaultTheme : Color.darkTheme,
                }}
                dropdownShown={false}
                maxHeight={700}
                search={false}
                setSelected={(selected) => {
                  setSelected(selected);
                }}
                data={houseAssets}
                save="key"
                label={t("selectHouseAssets")}
              />
            </View>
          </View>

          <View>
            <Text style={styles.subHeader}>{t("about")}</Text>
            <View style={styles.paragraphContainer}>
              <Input
                id="paragraph"
                style={styles.paragraphInput}
                placeholder="Describe your apartment"
                multiline={true}
                numberOfLines={4}
                onValueChange={(about) => setAbout(about)}
                value={about}
                textAlignVertical="top"
                onFocus={() => handleFocus("about")}
                onBlur={handleBlur}
              />
            </View>
          </View>

          <Divider bold={true} style={{ margin: 5 }} />
          {isError && <ErrorMessage errorMessage={error.message} />}
          <Button
            style={{ marginTop: 10 }}
            buttonColor={"#74E291"}
            textColor={Color.defaultTheme}
            mode="contained"
            onPress={handleEditApartment}
            loading={isPending}
          >
            {!isPending && t("done")}
          </Button>
          <NavLink text={t("back")} style={{ fontSize: 14 }} />
          {/* <View>
            <TouchableOpacity
              onPress={handleEditApartment}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
          </View> */}
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
    // marginTop: "15%",
  },
  scrollViewContent: {
    paddingBottom: Platform.OS === "ios" ? 100 : 75,
  },
  mainHeader: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
    marginTop: Platform.OS === "ios" ? "15%" : 10,
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
