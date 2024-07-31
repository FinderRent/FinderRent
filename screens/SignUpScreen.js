import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { useContext, useEffect, useState } from "react";
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button, RadioButton, Text } from "react-native-paper";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import { UserContext } from "../context/UserContext";
import { getAcademicList } from "../data/getAcademicList";
import { getYearList } from "../data/getListYear";
import { fetchInstitutions } from "../data/academicApi";
import Input from "../components/inputs/Input";
import PasswordInput from "../components/inputs/PasswordInput";
import DropDown from "../components/inputs/DropDown";
import NavLink from "../components/ui/NavLink";
import Spacer from "../components/ui/Spacer";
import signUp from "../api/authentication/signUp";
import ErrorMessage from "../components/ui/ErrorMessage";
import SelectCountry from "../components/inputs/SelectCountry";
import Loader from "../components/ui/Loader";

function SignUpScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const { isDarkMode } = useDarkMode();
  const auth = useContext(UserContext);

  const listAcademicIsrael = getAcademicList(i18n.language);
  const listYear = getYearList();

  const [institutions, setInstitutions] = useState([]);
  const [listAcademic, setListAcademic] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [pushToken, setPushToken] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");
  const [academic, setAcademic] = useState("Israel");
  const [coordinates, setCoordinates] = useState("");
  const [department, setDepartment] = useState("");
  const [yearbook, setYearbook] = useState("");
  const [gender, setGender] = useState("");
  const [userType, setUserType] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const userData = {
    pushToken,
    userType,
    firstName,
    lastName,
    age,
    academic,
    coordinates,
    department,
    yearbook,
    gender,
    email,
    password,
    passwordConfirm,
  };

  // Store the expoPushToken in database to send notifications
  useEffect(() => {
    async function storePushToken() {
      if (!Device.isDevice) {
        return;
      }
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      });
      setPushToken(token.data);
    }
    storePushToken();
  }, []);

  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getInstitutions = async () => {
      setIsLoading(true);
      setUserType("");
      let str = country;
      let result = str.replace(/\s/g, "");
      if (country) {
        const institutions = await fetchInstitutions(result, "en");
        setInstitutions(institutions);
      }
      setIsLoading(false);
    };
    getInstitutions();
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
  }, [academic]);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (userData) => signUp(userData),
    onSuccess: (user) => {
      storeData("token", user.token);
      auth.login(user.data.user, user.token);
      Toast.show({
        type: "success",
        text1: t("signUp.toast.success"),
      });
      if (user.data.user.userType === "student") {
        navigation.navigate("HomeScreen");
      } else {
        navigation.navigate("LandlordHomeStackScreen");
      }
    },
    onError: (err) => {
      console.log(err.message);
    },
  });

  const handleSignUp = () => {
    mutate(userData);
  };

  const getBackgroundImage = (isDarkMode) => {
    return isDarkMode
      ? require("../assets/images/MidnightCity.jpg")
      : require("../assets/images/Clouds.jpg");
  };

  // Rendering the UI components
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={getBackgroundImage(isDarkMode)}
        resizeMode="cover"
        style={styles.image}
      >
        <ScrollView>
          {/* Header text */}
          <View style={styles.container}>
            <Text variant="displaySmall" style={styles.text}>
              ── {t("signUp.header")} ──
            </Text>
          </View>

          <SelectCountry
            country={country}
            onCountryChange={(selectedCountry) => setCountry(selectedCountry)}
          />
          <View style={{ marginTop: 10 }}>
            {isLoading && <Loader color={Color.Blue700} size={16} />}
          </View>
          <View style={styles.inputsRow}>
            <Input
              style={styles.textInput}
              label={t("signUp.firstName")}
              mode="outlined"
              onValueChange={(selectedFirstName) =>
                setFirstName(selectedFirstName)
              }
            />

            <Input
              style={styles.textInput}
              label={t("signUp.lastName")}
              mode="outlined"
              onValueChange={(selectedLastName) =>
                setLastName(selectedLastName)
              }
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Input
              style={styles.textInput}
              label={t("signUp.age")}
              mode="outlined"
              keyboardType="decimal-pad"
              maxLength={2}
              onValueChange={(selectedAge) => setAge(selectedAge)}
            />

            {/* Radio buttons for selecting gender */}
            <View
              style={
                isDarkMode
                  ? { ...styles.genderView, backgroundColor: Color.darkTheme }
                  : styles.genderView
              }
            >
              <Text
                style={{ ...styles.title, marginTop: 5 }}
                variant="titleMedium"
              >
                {t("signUp.gender")}:
              </Text>
              <RadioButton
                color={Color.Blue500}
                status={gender === "Male" ? "checked" : "unchecked"}
                onPress={() => setGender("Male")}
              />
              <Text style={styles.textRadio}>{t("signUp.male")}</Text>
              <RadioButton
                color={Color.Blue500}
                status={gender === "Female" ? "checked" : "unchecked"}
                onPress={() => setGender("Female")}
              />
              <Text style={styles.textRadio}>{t("signUp.female")}</Text>
            </View>
          </View>

          <Text style={styles.title} variant="titleMedium">
            {t("signUp.role")}:
          </Text>
          <View style={styles.radioButtom}>
            <RadioButton
              color={Color.Blue500}
              status={userType === "landlord" ? "checked" : "unchecked"}
              onPress={() => setUserType("landlord")}
            />
            <Text style={styles.textRadio}>{t("signUp.landlord")}</Text>
          </View>
          <View style={styles.radioButtom}>
            <RadioButton
              color={Color.Blue500}
              status={userType === "student" ? "checked" : "unchecked"}
              onPress={() => setUserType("student")}
            />
            <Text style={styles.textRadio}>{t("signUp.student")}</Text>
          </View>

          {/* DropDown component for selecting academic institution */}
          {userType === "student" && (
            <View>
              <View>
                {t("Israel") === country ? (
                  <DropDown
                    list={listAcademicIsrael}
                    label={t("signUp.academicInstitution")}
                    placeholder={academic}
                    listMode="MODAL"
                    searchable={true}
                    onValueChange={(selectedAcademic) =>
                      setAcademic(selectedAcademic)
                    }
                    searchPlaceholder={t("signUp.searchAcademic")}
                  />
                ) : (
                  <DropDown
                    list={listAcademic}
                    label={t("signUp.academicInstitution")}
                    placeholder={academic}
                    listMode="MODAL"
                    searchable={true}
                    onValueChange={(selectedAcademic) =>
                      setAcademic(selectedAcademic)
                    }
                    searchPlaceholder={t("signUp.searchAcademic")}
                  />
                )}
              </View>

              {/* Input fields for department and yearbook */}
              <View>
                <View style={styles.inputsRow}>
                  <Input
                    style={styles.textInput}
                    label={t("signUp.department")}
                    value={department}
                    mode="outlined"
                    onValueChange={(selectedDepartment) =>
                      setDepartment(selectedDepartment)
                    }
                  />
                  <DropDown
                    list={listYear}
                    label={t("signUp.yearbook")}
                    placeholder={yearbook}
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

          {/* Input fields for email and passwords */}
          <View style={styles.textInput}>
            <Input
              label={t("signUp.email")}
              mode="outlined"
              keyboardType="email-address"
              onValueChange={(selectedEmail) => setEmail(selectedEmail)}
            />

            <PasswordInput
              mode="outlined"
              label={t("signUp.password")}
              onValueChange={(password) => setPassword(password)}
            />
            {password.length > 0 && password.length < 8 && (
              <Text
                style={
                  isDarkMode
                    ? { color: Color.error100, paddingLeft: 5 }
                    : { color: Color.errorText, paddingLeft: 5 }
                }
              >
                {t("signUp.passwordError")}
              </Text>
            )}

            <PasswordInput
              mode="outlined"
              label={t("signUp.passwordConfirm")}
              onValueChange={(passwordConfirm) =>
                setPasswordConfirm(passwordConfirm)
              }
            />

            {isError && <ErrorMessage errorMessage={t(error.message)} />}

            <Button
              style={{ marginTop: 10 }}
              buttonColor={Color.Blue700}
              textColor={Color.defaultTheme}
              mode="contained"
              onPress={handleSignUp}
              loading={isPending}
            >
              {!isPending && t("signUp.signUp")}
            </Button>
            <Spacer>
              <NavLink
                text={t("signUp.back")}
                style={{ marginTop: -5, fontSize: 14 }}
              />
            </Spacer>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 25,
    paddingBottom: 10,
    alignItems: "center",
  },
  image: {
    flex: 1,
  },
  text: {
    color: Color.Blue700,
    fontFamily: "OrbitronMedium",
  },
  inputsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textInput: {
    flex: 1,
    margin: 6,
  },
  title: {
    paddingHorizontal: 20,
    fontWeight: "bold",
    paddingRight: 5,
  },
  genderView: {
    flexDirection: "row",
    borderRadius: 5,
    backgroundColor: Color.white,
    margin: 7,
    padding: 4,
    marginBottom: 1,
    paddingHorizontal: 10,
  },
  radioButtom: {
    paddingHorizontal: 10,
    flexDirection: "row",
  },
  textRadio: {
    paddingTop: 8,
  },
});

export default SignUpScreen;
