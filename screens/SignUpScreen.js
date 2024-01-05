import { useContext, useState } from 'react';
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Button, RadioButton, Text } from 'react-native-paper';
import { useMutation } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import { Color } from '../constants/colors';
import { useDarkMode } from '../context/DarkModeContext';
import { UserContext } from '../context/UserContext';
import { academicList } from '../data/academic';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';
import DropDown from '../components/DropDown';
import NavLink from '../components/NavLink';
import Spacer from '../components/ui/Spacer';
import signUp from '../api/authentication/signUp';
import ErrorMessage from '../components/ui/ErrorMessage';

function SignUpScreen({ navigation }) {
  const { isDarkMode } = useDarkMode();
  const auth = useContext(UserContext);

  // State variables for form inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [academic, setAcademic] = useState('');
  const [department, setDepartment] = useState('');
  const [yearbook, setYearbook] = useState('');
  const [gender, setGender] = useState('');
  const [userType, setUserType] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  // Mapping academic list for DropDown component
  const listAcademic = academicList.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  // List of year options for DropDown component
  const listYear = [
    { label: 'מכינה', value: 'מכינה' },
    { label: "שנה א'", value: "שנה א'" },
    { label: "שנה ב'", value: "שנה ב'" },
    { label: "שנה ג'", value: "שנה ג'" },
    { label: "שנה ד'", value: "שנה ד'" },
    { label: 'תואר שני', value: 'תואר שני' },
  ];

  const userData = {
    userType,
    firstName,
    lastName,
    age,
    academic,
    department,
    yearbook,
    gender,
    email,
    password,
    passwordConfirm,
  };

  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (err) {
      console.log(err);
    }
  };

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (userData) => signUp(userData),
    onSuccess: (user) => {
      storeData('token', user.token);
      auth.login(user.data.user, user.token);
      Toast.show(
        {
          type: 'success',
          text1: 'חשבון נוצר בהצלחה',
        },
        navigation.navigate('DrawerScreens')
      );
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
      ? require('../assets/images/MidnightCity.jpg')
      : require('../assets/images/Clouds.jpg');
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
          <View style={{ ...styles.container, ...styles.text }}>
            <Text variant="displaySmall" style={{ color: Color.Blue800 }}>
              ─── SignUp ───
            </Text>
          </View>

          {/* Input fields for name and age */}
          <View style={styles.inputsRow}>
            <Input
              style={styles.textInput}
              label="First Name"
              mode="outlined"
              onValueChange={(selectedFirstName) =>
                setFirstName(selectedFirstName)
              }
            />

            <Input
              style={styles.textInput}
              label="Last Name"
              mode="outlined"
              onValueChange={(selectedLastName) =>
                setLastName(selectedLastName)
              }
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Input
              style={styles.textInput}
              label="Age"
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
                Gender:
              </Text>
              <RadioButton
                color={Color.Blue500}
                status={gender === 'Male' ? 'checked' : 'unchecked'}
                onPress={() => setGender('Male')}
              />
              <Text style={styles.textRadio}>Male</Text>
              <RadioButton
                color={Color.Blue500}
                status={gender === 'Female' ? 'checked' : 'unchecked'}
                onPress={() => setGender('Female')}
              />
              <Text style={styles.textRadio}>Female</Text>
            </View>
          </View>

          <Text style={styles.title} variant="titleMedium">
            Role:
          </Text>
          <View style={styles.radioButtom}>
            <RadioButton
              color={Color.Blue500}
              status={userType === 'landlord' ? 'checked' : 'unchecked'}
              onPress={() => setUserType('landlord')}
            />
            <Text style={styles.textRadio}>LandLord</Text>
          </View>
          <View style={styles.radioButtom}>
            <RadioButton
              color={Color.Blue500}
              status={userType === 'student' ? 'checked' : 'unchecked'}
              onPress={() => setUserType('student')}
            />
            <Text style={styles.textRadio}>Student</Text>
          </View>

          {/* DropDown component for selecting academic institution */}
          {userType === 'student' && ( //if the user is student than the dropdown is visible
            <View>
              <View>
                <DropDown
                  list={listAcademic}
                  label="Academic Institution"
                  placeholder={academic}
                  listMode="MODAL"
                  searchable={true}
                  onValueChange={(selectedAcademic) =>
                    setAcademic(selectedAcademic)
                  }
                  searchPlaceholder="Search For Academic Institution"
                />
              </View>

              {/* Input fields for department and yearbook */}
              <View>
                <View style={styles.inputsRow}>
                  <Input
                    style={styles.textInput}
                    label="Department"
                    value={department}
                    mode="outlined"
                    onValueChange={(selectedDepartment) =>
                      setDepartment(selectedDepartment)
                    }
                  />
                  <DropDown
                    list={listYear}
                    label="Yearbook"
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
              label="Email"
              mode="outlined"
              keyboardType="email-address"
              onValueChange={(selectedEmail) => setEmail(selectedEmail)}
            />

            <PasswordInput
              mode="outlined"
              label="Password"
              onValueChange={(password) => setPassword(password)}
            />
            {password.length > 0 && password.length < 6 && (
              <Text
                style={
                  isDarkMode
                    ? { color: Color.error100, paddingLeft: 5 }
                    : { color: Color.errorText, paddingLeft: 5 }
                }
              >
                Password must contain at least 6 characters
              </Text>
            )}

            <PasswordInput
              mode="outlined"
              label="Password Confirm"
              onValueChange={(passwordConfirm) =>
                setPasswordConfirm(passwordConfirm)
              }
            />

            {isError && <ErrorMessage errorMessage={error.message} />}

            {/* Sign-up button */}
            <Button
              style={{ marginTop: 10 }}
              buttonColor={Color.Blue800}
              textColor={Color.defaultTheme}
              mode="contained"
              onPress={handleSignUp}
              loading={isPending}
            >
              {!isPending && 'SignUp'}
            </Button>
            <Spacer>
              <NavLink text="Back" style={{ marginTop: -5, fontSize: 14 }} />
            </Spacer>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 35,
  },
  image: {
    flex: 1,
  },
  text: {
    alignItems: 'center',
  },
  inputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInput: {
    flex: 1,
    margin: 6,
  },
  title: {
    paddingHorizontal: 20,
    fontWeight: 'bold',
    paddingRight: 5,
  },
  genderView: {
    flexDirection: 'row',
    borderRadius: 5,
    backgroundColor: Color.white,
    margin: 7,
    padding: 4,
    marginBottom: 1,
    paddingHorizontal: 10,
  },
  radioButtom: {
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  textRadio: {
    paddingTop: 8,
  },
});

export default SignUpScreen;
