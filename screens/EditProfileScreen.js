import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { UserContext, useUsers } from "../context/UserContext";
import { useDarkMode } from "../context/DarkModeContext";
import { academicList } from "../data/academic";
import { Color } from "../constants/colors";
import DropDown from "../components/inputs/DropDown";
import Input from "../components/inputs/Input";
import Spacer from "../components/ui/Spacer";
import NavLink from "../components/ui/NavLink";
import ImagePicker from "../components/ImagePicker";
import TakePhoto from "../components/TakePhoto";
import ErrorMessage from "../components/ui/ErrorMessage";
import updateUser from "../api/updateUser";

function EditProfileScreen({ navigation }) {
  const { isDarkMode } = useDarkMode();
  const { userData } = useUsers();
  const auth = useContext(UserContext);

  const { token } = userData;
  const [userType, setUserType] = useState(userData.userType);
  const [avatar, setAvatar] = useState(userData.avatar?.url);
  const [firstName, setFirstName] = useState(userData.firstName);
  const [lastName, setLastName] = useState(userData.lastName);
  const [age, setAge] = useState(userData.age);
  const [phone, setPhone] = useState(userData.phone);
  const [academic, setAcademic] = useState(userData.academic);
  const [coordinates, setCoordinates] = useState(userData.coordinates);
  const [department, setDepartment] = useState(userData.department);
  const [yearbook, setYearbook] = useState(userData.yearbook);
  const [hobbies, setHobbies] = useState(userData.hobbies);
  const [funFact, setFunFact] = useState(userData.funFact);
  const [email, setEmail] = useState(userData.email);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const url =
    "https://res.cloudinary.com/dtkpp77xw/image/upload/v1701189732/default_nk5c5h.png";

  const listAcademic = academicList.map((item) => ({
    label: item.name,
    value: item.id,
    coordinates: item.coordinates,
  }));

  const listYear = [
    { label: "Preparing", value: "Preparing" },
    { label: "Year 1", value: "Year 1" },
    { label: "Year 2", value: "Year 2" },
    { label: "Year 3", value: "Year 3" },
    { label: "Year 4", value: "Year 4" },
    { label: "Master's degree", value: "Master's degree" },
  ];

  useEffect(() => {
    if (avatar !== userData.avatar?.url) {
      handlePresentModalClose();
    }

    const index = listAcademic.findIndex((item) => item.value === academic);
    if (index !== -1) {
      setCoordinates(listAcademic[index].coordinates);
    }
  }, [avatar, academic, coordinates]);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: ({
      userType,
      avatar,
      firstName,
      lastName,
      age,
      phone,
      academic,
      coordinates,
      department,
      yearbook,
      hobbies,
      funFact,
      email,
      token,
    }) =>
      updateUser({
        userType,
        avatar,
        firstName,
        lastName,
        age,
        phone,
        academic,
        coordinates,
        department,
        yearbook,
        hobbies,
        funFact,
        email,
        token,
      }),
    onSuccess: (user) => {
      auth.login(user.data.updatedUser, token);
      Toast.show({
        type: "success",
        text1: "Profile successfully updated",
      });
      navigation.goBack();
    },
    onError: (err) => {
      console.log(err.message);
    },
  });

  const handleUpdateUser = () => {
    mutate({
      userType,
      avatar,
      firstName,
      lastName,
      age,
      phone,
      academic,
      coordinates,
      department,
      yearbook,
      hobbies,
      funFact,
      email,
      token,
    });
  };

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ["40%"], []);

  const handlePresentModalOpen = useCallback(() => {
    bottomSheetModalRef.current?.present();
    setIsBottomSheetOpen(true);
  }, []);

  const handlePresentModalClose = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
    setIsBottomSheetOpen(false);
  }, []);

  return (
    <ScrollView>
      <View
        style={
          isBottomSheetOpen
            ? { ...styles.container, opacity: 0.3 }
            : styles.container
        }
      >
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            onPress={
              isBottomSheetOpen
                ? handlePresentModalClose
                : handlePresentModalOpen
            }
          >
            <View
              style={{
                height: 100,
                width: 100,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ImageBackground
                source={{ uri: avatar }}
                style={{ height: 100, width: 100 }}
                imageStyle={{
                  borderRadius: 50,
                  borderWidth: 2,
                  borderColor: Color.gray,
                  backgroundColor: Color.white,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <Icon
                    name="camera"
                    size={25}
                    color={Color.darkTheme}
                    style={{ opacity: 0.4 }}
                  />
                </View>
              </ImageBackground>
              <Text style={{ marginBottom: 30 }}>Update Picture</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.inputsRow}>
          <Input
            style={styles.textInput}
            label={firstName ? "" : "First Name"}
            value={firstName}
            left={<TextInput.Icon icon={"account-outline"} />}
            mode="outlined"
            onValueChange={(firstName) => setFirstName(firstName)}
          />
          <Input
            style={styles.textInput}
            label={lastName ? "" : "Last Name"}
            value={lastName}
            left={<TextInput.Icon icon={"account-outline"} />}
            mode="outlined"
            onValueChange={(lastName) => setLastName(lastName)}
          />
        </View>
        <Input
          style={styles.textInput}
          label={age ? "" : "Age"}
          value={age}
          left={<TextInput.Icon icon={"calendar-account-outline"} />}
          mode="outlined"
          keyboardType="decimal-pad"
          maxLength={2}
          onValueChange={(selectedAge) => setAge(selectedAge)}
        />
        {userType === "landlord" && (
          <Input
            style={styles.textInput}
            label={phone ? "" : "phone"}
            value={phone}
            left={<TextInput.Icon icon={"phone-outline"} />}
            mode="outlined"
            keyboardType="decimal-pad"
            onValueChange={(selectedPhone) => setPhone(selectedPhone)}
          />
        )}
        {userType === "student" && (
          <View>
            <View>
              <DropDown
                list={listAcademic}
                label={academic}
                listMode="MODAL"
                searchable={true}
                searchPlaceholder="Search For Academic Institution"
                onValueChange={(selectedAcademic) =>
                  setAcademic(selectedAcademic)
                }
              />
            </View>

            <View>
              <View style={styles.inputsRow}>
                <Input
                  style={styles.textInput}
                  label={department ? "" : "Department"}
                  value={department}
                  left={<TextInput.Icon icon={"school-outline"} />}
                  mode="outlined"
                  onValueChange={(selectedDepartment) =>
                    setDepartment(selectedDepartment)
                  }
                />
                <DropDown
                  list={listYear}
                  label={yearbook}
                  searchable={false}
                  listMode="SCROLLVIEW"
                  onValueChange={(selectedYearbook) =>
                    setYearbook(selectedYearbook)
                  }
                />
              </View>
            </View>
          </View>
        )}

        <View style={styles.textInput}>
          <Input
            label={email ? "" : "Email"}
            value={email}
            left={<TextInput.Icon icon={"email-outline"} />}
            mode="outlined"
            keyboardType="email-address"
            onValueChange={(selectedemail) => setEmail(selectedemail)}
          />
        </View>

        <View style={styles.textInput}>
          <Input
            label={hobbies ? "" : "what your hobbies?"}
            value={hobbies ? hobbies : ""}
            left={<TextInput.Icon icon={"controller-classic"} />}
            mode="outlined"
            onValueChange={(selectedHobbies) => setHobbies(selectedHobbies)}
          />
        </View>
        <View style={styles.textInput}>
          <Input
            label={funFact ? "" : "tell us fun fact..."}
            value={funFact ? funFact : ""}
            left={<TextInput.Icon icon={"beer"} />}
            mode="outlined"
            onValueChange={(selectedFunFact) => setFunFact(selectedFunFact)}
          />
        </View>
        {isError && <ErrorMessage errorMessage={error.message} />}

        <Spacer>
          <Button
            style={{ marginTop: 10 }}
            textColor={
              isDarkMode ? Color.buttomSheetDarkTheme : Color.defaultTheme
            }
            buttonColor={
              isDarkMode ? Color.defaultTheme : Color.buttomSheetDarkTheme
            }
            mode="contained"
            onPress={handleUpdateUser}
            loading={isPending}
          >
            {!isPending && "Update    "}
          </Button>
        </Spacer>
        <NavLink text="Back    " style={{ marginTop: -5, fontSize: 14 }} />
        <View style={{ marginTop: 45 }}></View>

        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}
          backgroundStyle={{
            backgroundColor: isDarkMode
              ? Color.buttomSheetDarkTheme
              : Color.defaultTheme,
          }}
          handleIndicatorStyle={{
            backgroundColor: isDarkMode
              ? Color.defaultTheme
              : Color.buttomSheetDarkTheme,
          }}
          onDismiss={() => setIsBottomSheetOpen(false)}
        >
          <View style={styles.sheetContainer}>
            <Text style={styles.panelTitle}>Update Picture</Text>
            <Text style={styles.panelSubtitle}>
              Choose Your Profile Picture
            </Text>

            <ImagePicker onPickImage={(image) => setAvatar(image)} />
            <TakePhoto onTakeImage={(image) => setAvatar(image)} />

            <Button
              style={styles.button}
              textColor={
                isDarkMode ? Color.buttomSheetDarkTheme : Color.defaultTheme
              }
              buttonColor={
                isDarkMode ? Color.defaultTheme : Color.buttomSheetDarkTheme
              }
              mode="contained"
              onPress={() => setAvatar(url)}
            >
              Delete Picture
            </Button>

            <Button
              style={{ marginTop: -10 }}
              onPress={handlePresentModalClose}
              mode="text"
              textColor={
                isDarkMode ? Color.defaultTheme : Color.buttomSheetDarkTheme
              }
            >
              Cancel
            </Button>
          </View>
        </BottomSheetModal>
      </View>
    </ScrollView>
  );
}

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
  },
  inputsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textInput: {
    flex: 1,
    margin: 7,
  },
  title: {
    paddingHorizontal: 20,
    fontWeight: "bold",
  },
  sheetContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  panelTitle: {
    textAlign: "center",
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    textAlign: "center",
    color: "gray",
    fontSize: 14,
    height: 30,
    marginBottom: 10,
  },
  button: {
    marginBottom: 15,
  },
});
