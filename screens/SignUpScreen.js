import { useState } from 'react';
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Button, RadioButton, Text } from 'react-native-paper';

import { Color } from '../constants/colors';
import { academicList } from '../data/academic';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';
import DropDown from '../components/DropDown';
import NavLink from '../components/NavLink';
import Spacer from '../components/ui/Spacer';

function SignUpScreen({ navigation }) {
  // State variables for form inputs
  const [privateName, setPrivateName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState();
  const [academic, setAcademic] = useState();
  const [department, setDepartment] = useState();
  const [yearbook, setYearbook] = useState();
  const [checked, setChecked] = useState('');
  const [userType, setUserType] = useState('');
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [passwordConfirm, setPasswordConfirm] = useState();

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
              onValueChange={(selectedName) => setPrivateName(selectedName)}
            />

            <Input
              style={styles.textInput}
              label="שם משפחה"
              mode="outlined"
              onValueChange={(selectLastName) => setLastName(selectLastName)}
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
                status={checked === 'זכר' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('זכר')}
              />
              <Text style={styles.textRadio}>זכר</Text>
              <RadioButton
                value="נקבה"
                color={Color.Blue500}
                status={checked === 'נקבה' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('נקבה')}
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
                    mode="outlined"
                    onValueChange={(selectedDepartment) =>
                      setDepartment(selectedDepartment)
                    }
                  />
                  <DropDown
                    list={listYear}
                    label="שנתון"
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
              onValueChange={(selectedemail) => setEmail(selectedemail)}
            />

            <PasswordInput
              mode="outlined"
              label="סיסמה"
              onValueChange={(password) => setPassword(password)}
            />

            <PasswordInput
              mode="outlined"
              label="אשר סיסמה"
              onValueChange={(passwordConfirm) =>
                setPasswordConfirm(passwordConfirm)
              }
            />

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
            >
              הרשם
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
