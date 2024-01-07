import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { UserContext, useUsers } from '../context/UserContext';
import { useDarkMode } from '../context/DarkModeContext';
import { academicList } from '../data/academic';
import { Color } from '../constants/colors';
import DropDown from '../components/DropDown';
import Input from '../components/Input';
import Spacer from '../components/ui/Spacer';
import NavLink from '../components/NavLink';
import Loader from '../components/ui/Loader';
import ImagePicker from '../components/ImagePicker';
import TakePhoto from '../components/TakePhoto';

function EditProfileScreen({ navigation }) {
  const { isDarkMode } = useDarkMode();
  const { userData } = useUsers();
  const auth = useContext(UserContext);

  // const { token } = userData;
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState(userData.userType);
  const [avatar, setAvatar] = useState(userData.avatar?.url);
  const [firstName, setFirstName] = useState(userData.firstName);
  const [lastName, setLastName] = useState(userData.lastName);
  const [age, setAge] = useState(userData.age);
  const [academic, setAcademic] = useState(userData.academic);
  const [department, setDepartment] = useState(userData.department);
  const [yearbook, setYearbook] = useState(userData.yearbook);
  const [email, setEmail] = useState(userData.email);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const url =
    'https://res.cloudinary.com/dtkpp77xw/image/upload/v1701189732/default_nk5c5h.png';

  const listAcademic = academicList.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const listYear = [
    { label: 'מכינה', value: 'מכינה' },
    { label: "שנה א'", value: "שנה א'" },
    { label: "שנה ב'", value: "שנה ב'" },
    { label: "שנה ג'", value: "שנה ג'" },
    { label: "שנה ד'", value: "שנה ד'" },
    { label: 'תואר שני', value: 'תואר שני' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        // Retrieve stored user data and token from AsyncStorage
        const storedData = await AsyncStorage.getItem('userData');
        const userData = JSON.parse(storedData);
        setUserType(userData.userType);
        setAvatar(userData.avatar.url);
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setAge(userData.age);
        setAcademic(userData.academic);
        setDepartment(userData.department);
        setYearbook(userData.yearbook);
        setEmail(userData.email);
      } catch (err) {
        console.log(err);
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (avatar !== userData.avatar?.url) {
      handlePresentModalClose();
    }
  }, [avatar]);

  const bottomSheetModalRef = useRef(null);

  // const snapPoints = useMemo(() => ["20%", "40%", "60%", "80%"], []);
  const snapPoints = useMemo(() => ['40%'], []);

  const handlePresentModalOpen = useCallback(() => {
    bottomSheetModalRef.current?.present();
    setIsBottomSheetOpen(true);
  }, []);

  const handlePresentModalClose = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
    setIsBottomSheetOpen(false);
  }, []);

  if (isLoading) {
    return <Loader color={Color.Brown400} />;
  }

  return (
    <ScrollView>
      <View
        style={
          isBottomSheetOpen
            ? { ...styles.container, opacity: 0.3 }
            : styles.container
        }
      >
        <View style={{ alignItems: 'center' }}>
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
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ImageBackground
                source={{ uri: avatar }}
                style={{ height: 100, width: 100 }}
                imageStyle={{
                  borderRadius: 50,
                  borderWidth: 2,
                  borderColor: Color.Blue600,
                  backgroundColor: Color.white,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
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
            label={firstName ? '' : 'First Name'}
            value={firstName}
            left={<TextInput.Icon icon={'account-outline'} />}
            mode="outlined"
            onValueChange={(firstName) => setFirstName(firstName)}
          />
          <Input
            style={styles.textInput}
            label={lastName ? '' : 'Last Name'}
            value={lastName}
            left={<TextInput.Icon icon={'account-outline'} />}
            mode="outlined"
            onValueChange={(lastName) => setLastName(lastName)}
          />
        </View>
        <Input
          style={styles.textInput}
          label={age ? '' : 'Age'}
          value={age}
          left={<TextInput.Icon icon={'calendar-account-outline'} />}
          mode="outlined"
          keyboardType="decimal-pad"
          maxLength={2}
          onValueChange={(selectedAge) => setAge(selectedAge)}
        />
        {userType === 'stuednt' && (
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
                  label={department ? '' : 'Department'}
                  value={department}
                  left={<TextInput.Icon icon={'school-outline'} />}
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
            label={email ? '' : 'Email'}
            value={email}
            left={<TextInput.Icon icon={'email-outline'} />}
            mode="outlined"
            keyboardType="email-address"
            onValueChange={(selectedemail) => setEmail(selectedemail)}
          />

          <Spacer>
            <Button
              style={{ marginTop: 10 }}
              textColor={Color.defaultTheme}
              buttonColor={Color.Blue800}
              mode="contained"
            >
              Update
            </Button>
          </Spacer>
          <NavLink text="Back" style={{ marginTop: -5, fontSize: 14 }} />
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInput: {
    flex: 1,
    margin: 7,
  },
  title: {
    paddingHorizontal: 20,
    fontWeight: 'bold',
  },
  sheetContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  panelTitle: {
    textAlign: 'center',
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 14,
    height: 30,
    marginBottom: 10,
  },
  button: {
    marginBottom: 15,
  },
});
