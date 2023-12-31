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

import { UserContext } from '../context/UserContext';
import { Color } from '../constants/colors';
import { academicList } from '../data/academic';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';
import DropDown from '../components/DropDown';
import NavLink from '../components/NavLink';
import Spacer from '../components/ui/Spacer';
import signUp from '../api/authentication/signUp';
import ErrorMessage from '../components/ui/ErrorMessage';

function SignUpScreen({ navigation }) {
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
        }
        // navigation.navigate('DrawerScreens')
      );
    },
    onError: (err) => {
      console.log(err.message);
    },
  });

  const handleSignUp = () => {
    mutate(userData);
  };

  // Rendering the UI components
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/images/Zinc.jpg')}
        resizeMode="cover"
        style={styles.image}
      >
        <ScrollView>
          {/* Header text */}
          <View style={{ ...styles.container, ...styles.text }}>
            <Text variant="displaySmall" style={{ color: Color.Blue800 }}>
              ─── הירשם ───
            </Text>
          </View>

          {/* Input fields for name and age */}
          <View style={styles.inputsRow}>
            <Input
              style={styles.textInput}
              label="שם פרטי"
              mode="outlined"
              onValueChange={(selectedFirstName) =>
                setFirstName(selectedFirstName)
              }
            />

            <Input
              style={styles.textInput}
              label="שם משפחה"
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
              label="גיל"
              mode="outlined"
              keyboardType="decimal-pad"
              maxLength={2}
              onValueChange={(selectedAge) => setAge(selectedAge)}
            />

            {/* Radio buttons for selecting gender */}
            <View style={styles.genderView}>
              <Text
                style={{ ...styles.title, marginTop: 5 }}
                variant="titleMedium"
              >
                מגדר:
              </Text>
              <RadioButton
                value="זכר"
                color={Color.Blue500}
                status={gender === 'זכר' ? 'checked' : 'unchecked'}
                onPress={() => setGender('זכר')}
              />
              <Text style={styles.textRadio}>זכר</Text>
              <RadioButton
                value="נקבה"
                color={Color.Blue500}
                status={gender === 'נקבה' ? 'checked' : 'unchecked'}
                onPress={() => setGender('נקבה')}
              />
              <Text style={styles.textRadio}>נקבה</Text>
            </View>
          </View>

          <Text style={styles.title} variant="titleMedium">
            תפקיד:
          </Text>
          <View style={styles.radioButtom}>
            <RadioButton
              value="משכיר"
              color={Color.Blue500}
              status={userType === 'landlord' ? 'checked' : 'unchecked'}
              onPress={() => setUserType('landlord')}
            />
            <Text style={styles.textRadio}>משכיר</Text>
          </View>
          <View style={styles.radioButtom}>
            <RadioButton
              value="שוכר"
              color={Color.Blue500}
              status={userType === 'student' ? 'checked' : 'unchecked'}
              onPress={() => setUserType('student')}
            />
            <Text style={styles.textRadio}>שוכר</Text>
          </View>

          {/* DropDown component for selecting academic institution */}
          {userType === 'student' && ( //if the user is student than the dropdown is visible
            <View>
              <View>
                <DropDown
                  list={listAcademic}
                  label="מוסד אקדמאי"
                  placeholder={academic}
                  listMode="MODAL"
                  searchable={true}
                  onValueChange={(selectedAcademic) =>
                    setAcademic(selectedAcademic)
                  }
                  searchPlaceholder="חפש מוסד אקדמאי"
                />
              </View>

              {/* Input fields for department and yearbook */}
              <View>
                <View style={styles.inputsRow}>
                  <Input
                    style={styles.textInput}
                    label="מחלקה"
                    value={department}
                    mode="outlined"
                    onValueChange={(selectedDepartment) =>
                      setDepartment(selectedDepartment)
                    }
                  />
                  <DropDown
                    list={listYear}
                    label="שנתון"
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
              label="אימייל"
              mode="outlined"
              keyboardType="email-address"
              onValueChange={(selectedEmail) => setEmail(selectedEmail)}
            />

            <PasswordInput
              mode="outlined"
              label="סיסמה"
              onValueChange={(password) => setPassword(password)}
            />
            {password.length > 0 && password.length < 6 && (
              <Text style={{ color: Color.errorText, paddingRight: 10 }}>
                סיסמה צריכה להכיל 6 תווים לפחות
              </Text>
            )}

            <PasswordInput
              mode="outlined"
              label="אשר סיסמה"
              onValueChange={(passwordConfirm) =>
                setPasswordConfirm(passwordConfirm)
              }
            />

            {isError && <ErrorMessage errorMessage={error.message} />}

            {/* Link to sign in page */}
            <Spacer>
              <NavLink
                text="כבר יש לך חשבון? היכנס במקום זאת"
                routeName="SignInScreen"
              />
            </Spacer>

            {/* Sign-up button */}
            <Button
              buttonColor={Color.Blue800}
              textColor={Color.defaultTheme}
              mode="contained"
              onPress={handleSignUp}
              loading={isPending}
            >
              {!isPending && 'הרשם'}
            </Button>
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
