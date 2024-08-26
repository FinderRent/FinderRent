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
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { UserContext, useUsers } from "../context/UserContext";
import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import { getAcademicList } from "../data/getAcademicList";
import { getYearList } from "../data/getListYear";
import { fetchInstitutions } from "../data/academicApi";
import DropDown from "../components/inputs/DropDown";
import Input from "../components/inputs/Input";
import Spacer from "../components/ui/Spacer";
import NavLink from "../components/ui/NavLink";
import ImagePicker from "../components/ImagePicker";
import TakePhoto from "../components/TakePhoto";
import ErrorMessage from "../components/ui/ErrorMessage";
import updateUser from "../api/users/updateUser";
import Loader from "../components/ui/Loader";
import SelectCountry from "../components/inputs/SelectCountry";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

function EditProfileScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const { isDarkMode } = useDarkMode();
  const { userData } = useUsers();
  const auth = useContext(UserContext);

  const listAcademicIsrael = getAcademicList(i18n.language);
  const listYear = getYearList();

  const { token, userType } = userData;
  const [institutions, setInstitutions] = useState([]);
  const [listAcademic, setListAcademic] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [avatar, setAvatar] = useState(userData.avatar?.url);
  const [firstName, setFirstName] = useState(userData.firstName);
  const [lastName, setLastName] = useState(userData.lastName);
  const [country, setCountry] = useState(userData.country);
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
  const [instagram, setInstagram] = useState(
    userData?.socialNetworks.instagram
  );
  const [facebook, setFacebook] = useState(userData?.socialNetworks.facebook);
  const [linkedin, setLinkedin] = useState(userData?.socialNetworks.linkedin);
  const [studentSocialNetworks, setStudentSocialNetworks] = useState(
    userData.socialNetworks
  );

  const url =
    "https://res.cloudinary.com/dtkpp77xw/image/upload/v1701189732/default_nk5c5h.png";

  useEffect(() => {
    if (avatar !== userData.avatar?.url) {
      handlePresentModalClose();
    }
  }, [avatar]);

  useEffect(() => {
    if (userData.userType === "student") {
      const getInstitutions = async () => {
        setIsLoading(true);
        let str = country;
        let result = str.replace(/\s/g, "");
        if (country) {
          const institutions = await fetchInstitutions(result, "en");
          setInstitutions(institutions);
        }
        setIsLoading(false);
      };
      getInstitutions();
    }
  }, [country]);

  useEffect(() => {
    const updatedListAcademic = institutions.map((item) => ({
      label: item.name,
      value: item.name,
      coordinates: item.coordinates,
      address: item.address,
    }));
    setListAcademic(updatedListAcademic);
  }, [institutions]);

  useEffect(() => {
    const index = listAcademicIsrael.findIndex(
      (item) => item.value === academic
    );
    if (index !== -1) {
      setCoordinates(listAcademicIsrael[index].coordinates);
    }

    if (t("Israel") !== t(`${country}`)) {
      const index1 = listAcademic.findIndex((item) => item.value === academic);
      if (index1 !== -1) {
        setCoordinates(listAcademic[index1].coordinates);
      }
    }
  }, [academic, institutions]);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: ({
      userType,
      avatar,
      firstName,
      lastName,
      country,
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
      studentSocialNetworks,
    }) =>
      updateUser({
        userType,
        avatar,
        firstName,
        lastName,
        country,
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
        studentSocialNetworks,
      }),
    onSuccess: (user) => {
      auth.login(user.data.updatedUser, token);
      Toast.show({
        type: "success",
        text1: t("profile_success"),
      });
      navigation.goBack();
    },
    onError: (err) => {
      console.log(err.message);
    },
  });

  const handleUpdateUser = () => {
    setStudentSocialNetworks([
      userData.socialNetworks._id,
      instagram,
      facebook,
      linkedin,
    ]);
    mutate({
      userType,
      avatar,
      firstName,
      lastName,
      country,
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
      studentSocialNetworks,
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

  // setStudentSocialNetworks([instagram, facebook, linkedin]);
  // console.log(studentSocialNetworks);

  return (
    <ScrollView style={styles.ScrollView}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
        // enableOnAndroid={true}
        // extraScrollHeight={20} // Increased this value to move the text input further up
        keyboardOpeningTime={0}
      >
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
                <Text style={{ marginBottom: 30 }}>{t("update_picture")}</Text>
              </View>
            </TouchableOpacity>
          </View>
          {userData.userType === "student" && (
            <SelectCountry
              country={country}
              onCountryChange={(selectedCountry) => setCountry(selectedCountry)}
            />
          )}
          <View style={styles.inputsRow}>
            <Input
              style={styles.textInput}
              color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
              label={firstName ? "" : t("first_name")}
              value={firstName}
              left={<TextInput.Icon icon={"account-outline"} />}
              mode="outlined"
              onValueChange={(firstName) => setFirstName(firstName)}
            />
            <Input
              style={styles.textInput}
              color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
              label={lastName ? "" : t("last_name")}
              value={lastName}
              left={<TextInput.Icon icon={"account-outline"} />}
              mode="outlined"
              onValueChange={(lastName) => setLastName(lastName)}
            />
          </View>
          <Input
            style={styles.textInput}
            color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
            label={age ? "" : t("age")}
            value={age}
            left={<TextInput.Icon icon={"calendar-account-outline"} />}
            mode="outlined"
            keyboardType="decimal-pad"
            maxLength={2}
            onValueChange={(selectedAge) => setAge(selectedAge)}
          />
          {userData.userType === "landlord" && (
            <Input
              style={styles.textInput}
              color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
              label={phone ? "" : t("phone")}
              value={phone}
              left={<TextInput.Icon icon={"phone-outline"} />}
              mode="outlined"
              keyboardType="decimal-pad"
              onValueChange={(selectedPhone) => setPhone(selectedPhone)}
            />
          )}
          {userData.userType === "student" && (
            <View>
              <View>
                {isLoading ? (
                  <View
                    style={{
                      marginTop: 10,
                      alignItems: "center",
                    }}
                  >
                    <Loader
                      color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
                      size={16}
                    />
                    <Text
                      style={{
                        color: isDarkMode
                          ? Color.defaultTheme
                          : Color.darkTheme,
                      }}
                    >
                      {t("signUp.loadingInstitution")}
                    </Text>
                  </View>
                ) : t("Israel") === t(`${country}`) ? (
                  <DropDown
                    list={listAcademicIsrael}
                    label={academic}
                    listMode="MODAL"
                    searchable={true}
                    searchPlaceholder={t("academic_institution")}
                    onValueChange={(selectedAcademic) =>
                      setAcademic(selectedAcademic)
                    }
                  />
                ) : (
                  <DropDown
                    list={listAcademic}
                    label={academic}
                    listMode="MODAL"
                    searchable={true}
                    searchPlaceholder={t("academic_institution")}
                    onValueChange={(selectedAcademic) =>
                      setAcademic(selectedAcademic)
                    }
                  />
                )}
              </View>

              <View>
                <View style={styles.inputsRow}>
                  <Input
                    style={styles.textInput}
                    color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
                    label={department ? "" : t("department")}
                    value={department}
                    left={<TextInput.Icon icon={"school-outline"} />}
                    mode="outlined"
                    onValueChange={(selectedDepartment) =>
                      setDepartment(selectedDepartment)
                    }
                  />
                  <DropDown
                    dropDownDirection={Platform.OS === "ios" ? "TOP" : null}
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
              label={email ? "" : t("email")}
              color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
              value={email}
              left={<TextInput.Icon icon={"email-outline"} />}
              mode="outlined"
              keyboardType="email-address"
              onValueChange={(selectedemail) => setEmail(selectedemail)}
            />
          </View>

          {userData.userType === "student" && (
            <View>
              <View style={styles.textInput}>
                <Input
                  label={hobbies ? "" : t("addYourHobbies")}
                  color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
                  value={hobbies ? hobbies : ""}
                  left={<TextInput.Icon icon={"controller-classic"} />}
                  mode="outlined"
                  onValueChange={(selectedHobbies) =>
                    setHobbies(selectedHobbies)
                  }
                />
              </View>
              <View style={styles.textInput}>
                <Input
                  label={funFact ? "" : t("fun_fact")}
                  color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
                  value={funFact ? funFact : ""}
                  left={<TextInput.Icon icon={"beer"} />}
                  mode="outlined"
                  onValueChange={(selectedFunFact) =>
                    setFunFact(selectedFunFact)
                  }
                />
              </View>
            </View>
          )}

          {/* <View style={styles.textInput}>
            <Input
              label={instagram ? "" : t("instagram")}
              value={instagram ? instagram : ""}
              left={<TextInput.Icon icon={"instagram"} />}
              mode="outlined"
              onValueChange={(instagram) => setInstagram(instagram)}
            />
          </View>
          <View style={styles.textInput}>
            <Input
              label={facebook ? "" : t("facebook")}
              value={facebook ? facebook : ""}
              left={<TextInput.Icon icon={"facebook"} />}
              mode="outlined"
              onValueChange={(facebook) => setFacebook(facebook)}
            />
          </View>
          <View style={styles.textInput}>
            <Input
              label={linkedin ? "" : t("linkedin")}
              value={linkedin ? linkedin : ""}
              left={<TextInput.Icon icon={"linkedin"} />}
              mode="outlined"
              onValueChange={(linkedin) => setLinkedin(linkedin)}
            />
          </View> */}

          {isError && <ErrorMessage errorMessage={t(error.message)} />}

          <Spacer>
            <Button
              style={{ marginTop: 10, marginHorizontal: 15 }}
              textColor={
                isDarkMode ? Color.buttomSheetDarkTheme : Color.defaultTheme
              }
              buttonColor={
                isDarkMode ? Color.defaultTheme : Color.buttomSheetDarkTheme
              }
              mode="contained"
              onPress={handleUpdateUser}
              loading={isPending}
              disabled={isPending || isLoading}
            >
              {!isPending && t("update")}
            </Button>
          </Spacer>
          <NavLink text={t("back")} style={{ marginTop: -5, fontSize: 14 }} />
          <View style={{ marginTop: 65 }}></View>

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
              <Text style={styles.panelTitle}>{t("update_picture")}</Text>
              <Text style={styles.panelSubtitle}>
                {t("choose_profile_picture")}
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
                {t("delete_picture")}
              </Button>

              <Button
                style={{ marginTop: -10 }}
                onPress={handlePresentModalClose}
                mode="text"
                textColor={
                  isDarkMode ? Color.defaultTheme : Color.buttomSheetDarkTheme
                }
              >
                {t("cancel")}
              </Button>
            </View>
          </BottomSheetModal>
        </View>
      </KeyboardAwareScrollView>
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
  ScrollView: {
    marginBottom: "5%",
  },
});
