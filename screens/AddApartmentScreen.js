import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Platform, View, Keyboard } from "react-native";
import { Text, Divider, Button, TextInput } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import { showMessage } from "react-native-flash-message";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import * as FileSystem from "expo-file-system";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Geocoder from "react-native-geocoding";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/MaterialIcons";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import { useUsers } from "../context/UserContext";
import { addApartment, fetchAllstudents } from "../utils/http";
import DropDown from "../components/inputs/DropDown";
import Input from "../components/inputs/Input";
import ErrorMessage from "../components/ui/ErrorMessage";
import ImagePickerMulti from "../components/ImagePickerMulti";

function AddApartmentScreen(props) {
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();

  const { userData } = useUsers();
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [buildingNumber, setBuildingNumber] = useState("");
  const [apartmentNumber, setApartmentNumber] = useState("");
  const [floor, setFloor] = useState("");
  const [rooms, setRooms] = useState("");
  const [price, setPrice] = useState("");
  const [totalCapacity, setTotalCapacity] = useState("");
  const [realTimeCapacity, setRealTimeCapacity] = useState("");
  const [apartmentType, setApartmentType] = useState("");
  const [selected, setSelected] = useState([]);
  const [selectTenants, setSelectTenants] = useState([]);
  const [about, setAbout] = useState("");
  const [coordinates, setCoordinates] = useState({
    latitude: "",
    longitude: "",
  });
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [apartmentImages, setApartmentImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // const [apartmentImage, setApartmentImage] = useState("");
  // const [publicImageURL, setPublicImageURL] = useState("");
  // const [publicImageURLs, setPublicImageURLs] = useState([]);

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

  const keyboardVerticalOffset = Platform.OS === "ios" ? 10 : 0;

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
  useEffect(() => {
    if (
      city &&
      street &&
      buildingNumber &&
      focusedInput !== "city" &&
      focusedInput !== "street" &&
      focusedInput !== "buildingNumber"
    ) {
      Geocoder.init("AIzaSyDYInyCvJ1WQjqJohhMx2OnxioXWAvy39s");
      const address = `${city} ${street} ${buildingNumber}`;
      // console.log(address);
      // console.log(coordinates);
      Geocoder.from(address)
        .then((json) => {
          const location = json.results[0].geometry.location;
          setCoordinates({
            latitude: JSON.stringify(location.lat),
            longitude: JSON.stringify(location.lng),
          });
        })
        .catch((error) => console.warn(error));
    }
  }, [city, street, buildingNumber, focusedInput]);

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

  // const handleImageUpload = async (image) => {
  //   console.log("upload image...");

  //   // Check if the file exists
  //   const fileInfo = await FileSystem.getInfoAsync(image);
  //   if (!fileInfo.exists) {
  //     throw new Error(`File does not exist at path: ${image}`);
  //   }

  //   // Convert the image to base64 format
  //   const base64Image = await FileSystem.readAsStringAsync(image, {
  //     encoding: FileSystem.EncodingType.Base64,
  //   });

  //   const data = new FormData();
  //   data.append("file", `data:image/jpeg;base64,${base64Image}`);
  //   data.append("upload_preset", "FindeRent");
  //   data.append("cloud_name", "finderent");
  //   data.append("folder", "Apartments");

  //   try {
  //     const response = await fetch(
  //       "https://api.cloudinary.com/v1_1/finderent/image/upload",
  //       {
  //         method: "post",
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //         body: data,
  //       }
  //     );

  //     const result = await response.json();
  //     console.log("image upload: ", result.url);
  //     setPublicImageURL(result.url);
  //     return result.url; // Return the image URL
  //   } catch (error) {
  //     console.error("Error uploading image: ", error);
  //     throw new Error("Failed to upload image");
  //   }
  // };

  const handleImageUpload = async (images) => {
    console.log("upload images...");

    const imageUrls = [];

    for (const image of images) {
      // Check if the file exists
      const fileInfo = await FileSystem.getInfoAsync(image);
      if (!fileInfo.exists) {
        throw new Error(`File does not exist at path: ${image}`);
      }

      // Convert the image to base64 format
      const base64Image = await FileSystem.readAsStringAsync(image, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const data = new FormData();
      data.append("file", `data:image/jpeg;base64,${base64Image}`);
      data.append("upload_preset", "FindeRent");
      data.append("cloud_name", "finderent");
      data.append("folder", "Apartments");

      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/finderent/image/upload",
          {
            method: "post",
            headers: {
              "Content-Type": "multipart/form-data",
            },
            body: data,
          }
        );

        const result = await response.json();
        console.log("image upload: ", result.url);
        imageUrls.push(result.url); // Add the image URL to the array
      } catch (error) {
        console.error("Error uploading image: ", error);
        throw new Error("Failed to upload image");
      }
    }

    return imageUrls; // Return the array of image URLs
  };
  ///------------------------

  // const localUri = apartmentImage;
  // const filename = localUri.split("/").pop();

  // const localUris = apartmentImages;
  // const filenames = localUris.map((uri) => uri.split("/").pop());

  // ///------------------------
  //object to send to the backend
  const apartmentData = {
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
    apartmentType,
    totalCapacity: totalCapacity !== "" ? parseInt(totalCapacity) : undefined,
    realTimeCapacity:
      realTimeCapacity !== "" ? parseInt(realTimeCapacity) : undefined,
    about,
    numberOfRooms: rooms !== "" ? parseInt(rooms) : undefined,
    apartmentContent: createApartmentContent(selected),
    tenants: selectTenants,
    // rating: 5,
    price: price !== "" ? parseInt(price) : undefined,
    floor: floor !== "" ? parseInt(floor) : undefined,
    owner: userData.id,
    apartmentType,
    // images: {
    //   public_id: publicImageURL,
    //   url: publicImageURL,
    // },
    images: [],
  };
  const resetForm = () => {
    setCountry("");
    setCity("");
    setStreet("");
    setBuildingNumber("");
    setApartmentNumber("");
    setFloor("");
    setRooms("");
    setPrice("");
    setTotalCapacity("");
    setRealTimeCapacity("");
    setApartmentType("");
    setAbout("");
    setSelected([]);
    setCoordinates({
      latitude: "",
      longitude: "",
    });
    setApartmentImages([]);
  };

  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(
    () => (Platform.OS === "ios" ? ["14%", "90%"] : ["3%", "77%"]),
    []
  );

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (apartmentData) => addApartment(apartmentData),
    onSuccess: () => {
      if (Platform.OS === "ios") {
        showMessage({
          message: "Success",
          description: "Apartment added successfully!",
          type: "success",
        });
      } else {
        Toast.show({
          type: "success",
          text1: "Apartment added successfully!",
        });
      }

      resetForm();
      props.handleAddButtonPress();
    },
    onError: (err) => {
      console.log(err.message);
    },
  });

  // const handleAddApartment = async () => {
  //   const imageUrl = await handleImageUpload(apartmentImage);
  //   const updatedApartmentData = {
  //     ...apartmentData,
  //     images: {
  //       public_id: imageUrl,
  //       url: imageUrl,
  //     },
  //   };
  //   mutate(updatedApartmentData);
  // };
  const handleAddApartment = async () => {
    try {
      setLoading(true);
      const imageUrls = await handleImageUpload(apartmentImages); // Upload multiple images

      // Ensure imageUrls is an array (in case handleImageUpload returns a comma-separated string)
      const imageUrlsArray =
        typeof imageUrls === "string" ? imageUrls.split(",") : imageUrls;

      const updatedApartmentData = {
        ...apartmentData,
        images: imageUrlsArray, // Assign the array of URLs directly to the images field
      };

      console.log(updatedApartmentData);
      mutate(updatedApartmentData); // Send the updated apartment data to the database
      setLoading(false);
    } catch (error) {
      console.error(
        "Error uploading images or updating apartment data: ",
        error
      );
      setLoading(false);
    }
  };

  const { data: students, isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: () =>
      fetchAllstudents({
        userType: "student",
      }),
  });

  let tenants = [];
  if (!isLoading) {
    students.users.forEach((student) => {
      tenants.push([student.firstName + " " + student.lastName, student._id]);
    });
  }
  // Transform tenants array to an array of objects with label and value
  const tenantOptions = tenants.map(([key, id]) => ({
    key: id,
    value: key,
  }));

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      onChange={props.handleIsOpen}
      index={props.bottomSheetIndex ? 1 : 0}
      backgroundStyle={{
        backgroundColor: isDarkMode ? Color.buttomSheetDarkTheme : Color.white,
      }}
      handleIndicatorStyle={
        isDarkMode
          ? { backgroundColor: Color.gray }
          : { backgroundColor: Color.darkTheme }
      }
    >
      <BottomSheetScrollView nestedScrollEnabled={true}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          // enableOnAndroid={true}
          extraScrollHeight={50} // Increased this value to move the text input further up
          keyboardOpeningTime={0}
        >
          <View style={styles.container}>
            <Text style={styles.mainHeader}>{t("addYourApartment")}</Text>
            <View>
              <View>
                <Text style={styles.subHeader}>{t("address")}</Text>
                <View style={styles.line}>
                  <Input
                    color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
                    mode="outlined"
                    label={t("country")}
                    value={country}
                    onValueChange={(country) => setCountry(country)}
                    style={styles.input}
                  />
                  <Input
                    color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
                    mode="outlined"
                    label={t("city")}
                    value={city}
                    onValueChange={(city) => setCity(city)}
                    onFocus={() => handleFocus("city")}
                    onBlur={handleBlur}
                    style={styles.input}
                  />
                </View>
                <View style={styles.line}>
                  <Input
                    color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
                    mode="outlined"
                    label={t("street")}
                    value={street}
                    onValueChange={(street) => setStreet(street)}
                    onFocus={() => handleFocus("street")}
                    onBlur={handleBlur}
                    style={styles.input}
                  />
                  <Input
                    color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
                    keyboardType="numeric"
                    mode="outlined"
                    label={t("buildingNumber")}
                    value={buildingNumber}
                    onValueChange={(buildingNumber) =>
                      setBuildingNumber(buildingNumber)
                    }
                    onFocus={() => handleFocus("buildingNumber")}
                    onBlur={handleBlur}
                    style={styles.input}
                  />
                </View>
                <View style={styles.line}>
                  <Input
                    color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
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
                    color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
                    keyboardType="numeric"
                    mode="outlined"
                    label={t("floor")}
                    value={floor}
                    onValueChange={(floor) => setFloor(floor)}
                    style={styles.input}
                  />
                </View>
                {city &&
                  street &&
                  buildingNumber &&
                  focusedInput !== "city" &&
                  focusedInput !== "street" &&
                  focusedInput !== "buildingNumber" && (
                    <View>
                      <Text style={styles.subHeader}>
                        {t("checkApartmentCoordinates")}
                      </Text>
                      <View style={styles.line}>
                        <Input
                          color={
                            isDarkMode ? Color.defaultTheme : Color.darkTheme
                          }
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
                          color={
                            isDarkMode ? Color.defaultTheme : Color.darkTheme
                          }
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
                  )}
              </View>
              <View>
                <Text style={styles.subHeader}>{t("generalDetails")}</Text>
                <View style={styles.line}>
                  <Input
                    color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
                    keyboardType="numeric"
                    mode="outlined"
                    label={t("numberOfRooms")}
                    value={rooms}
                    onValueChange={(rooms) => setRooms(rooms)}
                    style={styles.input}
                  />
                  <Input
                    color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
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
                    color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
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
                    color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
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
                    dropDownDirection="TOP" // This will force the dropdown to always open to the top
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
                    setSelected={(val) => {
                      setSelected(val);
                    }}
                    data={houseAssets}
                    save="key"
                    label={t("selectHouseAssets")}
                    placeholder={t("selectOption")}
                    checkBoxStyles={{
                      backgroundColor: Color.defaultTheme,
                    }}
                    arrowicon={
                      <Icon
                        name="arrow-drop-down"
                        size={20}
                        color={
                          isDarkMode ? Color.defaultTheme : Color.darkTheme
                        }
                      />
                    }
                  />
                </View>
              </View>

              <View>
                <Text style={styles.subHeader}>{t("pickYourTenants")}</Text>
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
                    dropdownItemStyles={{
                      color: isDarkMode ? Color.defaultTheme : Color.darkTheme,
                    }}
                    dropdownStyles={{
                      color: isDarkMode ? Color.defaultTheme : Color.darkTheme,
                    }}
                    searchPlaceholder={t("search")}
                    dropdownShown={false}
                    maxHeight={400}
                    search={true}
                    setSelected={(val) => {
                      setSelectTenants(val);
                    }}
                    data={tenantOptions}
                    save="key"
                    label={t("tenants")}
                    placeholder={t("selectOption")}
                    checkBoxStyles={{
                      backgroundColor: Color.defaultTheme,
                    }}
                    searchicon={
                      <Icon
                        name="search"
                        size={18}
                        color={
                          isDarkMode ? Color.defaultTheme : Color.darkTheme
                        }
                        style={{ paddingLeft: 5 }}
                      />
                    }
                    arrowicon={
                      <Icon
                        name="arrow-drop-down"
                        size={20}
                        color={
                          isDarkMode ? Color.defaultTheme : Color.darkTheme
                        }
                      />
                    }
                    closeicon={
                      <Icon
                        name="close"
                        size={20}
                        color={
                          isDarkMode ? Color.defaultTheme : Color.darkTheme
                        }
                      />
                    }
                  />
                </View>
              </View>

              <View>
                <Text style={styles.subHeader}>{t("about")}</Text>
                <View style={styles.paragraphContainer}>
                  <TextInput
                    id="paragraph"
                    style={
                      isDarkMode
                        ? {
                            ...styles.paragraphInput,
                            backgroundColor: Color.darkTheme,
                          }
                        : styles.paragraphInput
                    }
                    placeholder={t("describeYourApartment")}
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={(about) => setAbout(about)}
                    value={about}
                    textAlignVertical="top"
                    onFocus={() => handleFocus("about")}
                    onBlur={handleBlur}
                    activeUnderlineColor={
                      isDarkMode ? Color.defaultTheme : Color.darkTheme
                    }
                    activeOutlineColor={
                      isDarkMode ? Color.defaultTheme : Color.darkTheme
                    }
                  />
                </View>
              </View>
              <View>
                <Text style={[styles.subHeader, { marginBottom: 10 }]}>
                  {t("addPictures")}
                </Text>

                <View style={styles.images}>
                  <ImagePickerMulti
                    apartmentImages={apartmentImages}
                    setApartmentImages={setApartmentImages}
                  />
                </View>
              </View>
              <Divider
                bold={true}
                style={{
                  margin: 5,
                  backgroundColor: isDarkMode
                    ? Color.defaultTheme
                    : Color.darkTheme,
                }}
              />

              {isError && <ErrorMessage errorMessage={error.message} />}
              <Button
                style={{ marginTop: 10 }}
                buttonColor={isDarkMode ? Color.defaultTheme : Color.darkTheme}
                textColor={isDarkMode ? Color.darkTheme : Color.defaultTheme}
                mode="contained"
                onPress={handleAddApartment}
                loading={loading}
              >
                {!loading && t("add")}
              </Button>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

export default AddApartmentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: "5%",
  },
  scrollViewContent: {
    paddingBottom: Platform.OS === "ios" ? 100 : 50,
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
    borderRadius: 5,
    margin: 5,
    backgroundColor: Color.white,
  },
  button: {
    // backgroundColor: "#74E291",
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
  images: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
