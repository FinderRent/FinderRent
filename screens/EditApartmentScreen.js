import { useEffect, useState } from "react";
import { StyleSheet, View, Keyboard, Platform } from "react-native";
import { Text, Divider, Button, TextInput } from "react-native-paper";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { showMessage } from "react-native-flash-message";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import { updateEditedApartment } from "../utils/http";
import { useUsers } from "../context/UserContext";
import { ensureHttps, fullName } from "../utils/features";
import Input from "../components/inputs/Input";
import DropDown from "../components/inputs/DropDown";
import ErrorMessage from "../components/ui/ErrorMessage";
import NavLink from "../components/ui/NavLink";
import ImagePickerMulti from "../components/ImagePickerMulti";

function EditApartmentScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();
  const { apartment } = route.params;

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
  const [apartmentImages, setApartmentImages] = useState(apartment?.images);
  const [selectTenants, setSelectTenants] = useState([]);
  const [loading, setLoading] = useState(false);
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

  // const selectedFeatures = Object.keys(apartment.apartmentContent).filter(
  //   (key) => apartment.apartmentContent[key] === true
  // );

  // const findHouseAsset = (feature) => {
  //   return houseAssets?.find(
  //     (asset) => asset.key.toLowerCase() === feature.toLowerCase()
  //   );
  // };

  // const defaultOptions = selectedFeatures
  //   .map((feature) => {
  //     const asset = findHouseAsset(feature);
  //     return asset ? { key: asset.key, value: asset.value } : null;
  //   })
  //   .filter(Boolean);

  // console.log(defaultOptions);

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
    totalCapacity: totalCapacity !== "" ? parseInt(totalCapacity) : undefined,
    realTimeCapacity:
      realTimeCapacity !== "" ? parseInt(realTimeCapacity) : undefined,
    about,
    numberOfRooms: rooms !== "" ? parseInt(rooms) : undefined,
    apartmentContent: createApartmentContent(selected),
    tenants: selectTenants,
    price: price !== "" ? parseInt(price) : undefined,
    floor: floor !== "" ? parseInt(floor) : undefined,
    owner: userData.id,
    apartmentType,
    apartmentImages,
  };

  // const { mutate, isPending, isError, error } = useMutation({
  //   mutationFn: (apartmentData) => updateEditedApartment(apartmentData),
  //   onSuccess: () => {
  //     if (Platform.OS === "ios") {
  //       showMessage({
  //         message: "Success",
  //         description: "Apartment edited successfully!",
  //         type: "success",
  //       });
  //     } else {
  //       Toast.show({
  //         type: "success",
  //         text1: "Apartment edited successfully!",
  //       });
  //     }

  //     navigation.goBack();
  //     navigation.goBack();
  //   },
  //   onError: (err) => {
  //     console.log(err.message);
  //   },
  // });

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (apartmentData) => updateEditedApartment(apartmentData),
    onSuccess: async () => {
      try {
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

        // Set the flag to indicate the edit was successful
        await AsyncStorage.setItem("needsRefetch", "true");

        // Navigate back after setting the flag
        navigation.goBack();
        navigation.goBack();
      } catch (error) {
        console.error("Error setting refetch flag:", error);
      }
    },
    onError: (err) => {
      console.log(err.message);
    },
  });

  // const handleImageUpload = async (images) => {
  //   const imageUrls = [];

  //   for (const image of images) {
  //     // Check if the file exists
  //     const fileInfo = await FileSystem.getInfoAsync(image);
  //     if (!fileInfo.exists) {
  //       throw new Error(`File does not exist at path: ${image}`);
  //     }

  //     // Convert the image to base64 format
  //     const base64Image = await FileSystem.readAsStringAsync(image, {
  //       encoding: FileSystem.EncodingType.Base64,
  //     });

  //     const data = new FormData();
  //     data.append("file", `data:image/jpeg;base64,${base64Image}`);
  //     data.append("upload_preset", "FindeRent");
  //     data.append("cloud_name", "finderent");
  //     data.append("folder", "Apartments");

  //     try {
  //       const response = await fetch(
  //         "https://api.cloudinary.com/v1_1/finderent/image/upload",
  //         {
  //           method: "post",
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //           },
  //           body: data,
  //         }
  //       );

  //       const result = await response.json();
  //       console.log("image upload: ", result.url);
  //       imageUrls.push(result.url); // Add the image URL to the array
  //     } catch (error) {
  //       console.error("Error uploading image: ", error);
  //       throw new Error("Failed to upload image");
  //     }
  //   }

  //   return imageUrls; // Return the array of image URLs
  // };

  const handleImageUpload = async (images) => {
    const imageUrls = [];

    for (const image of images) {
      // Check if the image is a local file URI or a remote URL
      if (image.startsWith("http")) {
        // Skip uploading for remote URLs and add them directly to the array
        imageUrls.push(image);
        continue;
      }

      try {
        // FileSystem.getInfoAsync only works for local file URIs, not for URLs
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
        const secureImageUrl = ensureHttps(result.url);
        imageUrls.push(secureImageUrl); // Add the image URL to the array
      } catch (error) {
        console.error("Error uploading image: ", error);
        throw new Error("Failed to upload image");
      }
    }

    return imageUrls; // Return the array of image URLs
  };

  // const handleEditApartment = async () => {
  //   try {
  //     setLoading(true);
  //     const imageUrls = await handleImageUpload(apartmentImages);

  //     const imageUrlsArray =
  //       typeof imageUrls === "string" ? imageUrls.split(",") : imageUrls;

  //     const updatedApartmentData = {
  //       ...apartmentData,
  //       images: imageUrlsArray,
  //     };

  //     console.log("new apartment: " + updatedApartmentData);
  //     mutate(apartmentData);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error(
  //       "Error uploading images or updating apartment data: ",
  //       error
  //     );
  //     setLoading(false);
  //   }
  // };
  const handleEditApartment = async () => {
    try {
      setLoading(true);

      // Filter out images that are local URIs (not yet uploaded)
      const localImages = apartmentImages.filter(
        (image) => !image.startsWith("https://")
      );

      // Upload only the local images
      const uploadedImageUrls = await handleImageUpload(localImages);

      // Combine the uploaded image URLs with the already existing Cloudinary URLs
      const finalImageArray = [
        ...apartmentImages.filter((image) => image.startsWith("https://")), // Existing Cloudinary URLs
        ...uploadedImageUrls, // New URLs from the phone upload
      ];

      // Update the apartment data with the final array of image URLs
      const updatedApartmentData = {
        ...apartmentData,
        images: finalImageArray,
      };

      console.log("new apartment: ", updatedApartmentData);

      // Mutate the apartment data to update the DB
      mutate(updatedApartmentData);
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
    students?.users?.forEach((student) => {
      tenants.push([
        fullName(student.firstName, student.lastName),
        student._id,
      ]);
    });
  }

  // Transform tenants array to an array of objects with label and value
  const tenantOptions = tenants.map(([key, id]) => ({
    key: id,
    value: key,
  }));

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollViewContent}
      keyboardShouldPersistTaps="handled"
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
                    color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
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
                maxHeight={150}
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
                    color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
                    style={{ paddingLeft: 5 }}
                  />
                }
                arrowicon={
                  <Icon
                    name="arrow-drop-down"
                    size={20}
                    color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
                  />
                }
                closeicon={
                  <Icon
                    name="close"
                    size={20}
                    color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
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
                onValueChange={(about) => setAbout(about)}
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

          <View style={styles.images}>
            <ImagePickerMulti
              apartmentImages={apartmentImages}
              setApartmentImages={setApartmentImages}
            />
          </View>
          <Divider bold={true} style={{ margin: 5 }} />
          {isError && <ErrorMessage errorMessage={error.message} />}
          <Button
            style={{ marginTop: 10 }}
            buttonColor={isDarkMode ? Color.defaultTheme : Color.darkTheme}
            textColor={isDarkMode ? Color.darkTheme : Color.defaultTheme}
            mode="contained"
            onPress={handleEditApartment}
            loading={loading || isPending}
            disabled={loading || isPending}
          >
            {(!loading || !isPending) && t("done")}
          </Button>
          <NavLink text={t("back")} style={{ fontSize: 14 }} />
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
    marginTop: "15%",
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
