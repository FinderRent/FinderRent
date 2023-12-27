import { useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, View, SafeAreaView } from 'react-native';
import { Button, RadioButton, Text } from 'react-native-paper';

import { Color } from '../constants/colors';
import { academicList } from '../data/academic';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';
import DropDown from '../components/DropDown';
import NavLink from '../components/NavLink';
import Spacer from '../components/ui/Spacer';

function StudentsSignUpScreen({ navigation, route }) {
  // Extracting user type from route parameters
  const { userType } = route.params;

  // State variables for form inputs
  const [privateName, setPrivateName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState();
  const [academic, setAcademic] = useState();
  const [department, setDepartment] = useState();
  const [yearbook, setYearbook] = useState();
  const [checked, setChecked] = useState('');
  const [isStudent, setIsStudent] = useState();
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

          <Input
            style={styles.textInput}
            label='גיל'
            mode="outlined"
            keyboardType="decimal-pad"
            maxLength={2}
            onValueChange={(selectedAge) => setAge(selectedAge)}
          />

          {/* Radio buttons for selecting gender */}
          <Text style={styles.title} variant="titleMedium">
            מגדר:
          </Text>
          <View style={styles.radioButtom}>
            <RadioButton
              value="זכר"
              color={Color.Blue500}
              status={checked === 'זכר' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('זכר')}
            />
            <Text style={styles.textRadio}>זכר</Text>
          </View>
          <View style={styles.radioButtom}>
            <RadioButton
              value="נקבה"
              color={Color.Blue500}
              status={checked === 'נקבה' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('נקבה')}
            />
            <Text style={styles.textRadio}>נקבה</Text>
          </View>

          <Text style={styles.title} variant="titleMedium">
            תפקיד
          </Text>
          <View style={styles.radioButtom}>
            <RadioButton
              value="משכיר"
              color={Color.Blue500}
              status={isStudent === false ? 'checked' : 'unchecked'}
              onPress={() => setIsStudent(false)}
            />
            <Text style={styles.textRadio}>משכיר</Text>
          </View>
          <View style={styles.radioButtom}>
            <RadioButton
              value="שוכר"
              color={Color.Blue500}
              status={isStudent === true ? 'checked' : 'unchecked'}
              onPress={() => setIsStudent(true)}
            />
            <Text style={styles.textRadio}>שוכר</Text>
          </View>

          {/* DropDown component for selecting academic institution */}
          {isStudent && //if the user is student than the dropdown is visible
            <View>
              <View style={{ paddingHorizontal: 6 }}>
                <DropDown
                  list={listAcademic}
                  label="מוסד אקדמאי"
                  listMode="MODAL"
                  searchable={true}
                  onValueChange={(selectedAcademic) => setAcademic(selectedAcademic)}
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
          }
          {/* Input fields for email and passwords */}
          <View style={styles.textInput}>
            <Input
              label="מייל"
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
                props={{ userType: userType }}
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
    margin: 6,
  },
  textInput: {
    flex: 1,
    margin: 6,
  },
  title: {
    paddingHorizontal: 20,
    fontWeight: 'bold',
  },
  radioButtom: {
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  textRadio: {
    paddingTop: 6,
  },
});

export default StudentsSignUpScreen;
