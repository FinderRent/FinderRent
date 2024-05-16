import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from "react";

// Create a UserContext with default login and logout functions
const UserContext = createContext({
  login: () => {},
  logout: () => {},
});

// Custom hook to manage user data and authentication
function useUsers() {
  const [token, setToken] = useState(null);
  const [pushToken, setPushToken] = useState(null);
  const [userType, setUserType] = useState(null);
  const [id, setId] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [age, setAge] = useState(null);
  const [phone, setPhone] = useState(null);
  const [academic, setAcademic] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [department, setDepartment] = useState(null);
  const [yearbook, setYearbook] = useState(null);
  const [gender, setGender] = useState(null);
  const [email, setEmail] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [favouriteApartments, setFavouriteApartments] = useState([null]);

  // Function to login the user and save data to AsyncStorage
  const login = useCallback((data, token) => {
    // console.log('data:', data);
    const saveData = async () => {
      const {
        _id,
        pushToken,
        userType,
        firstName,
        lastName,
        age,
        academic,
        coordinates,
        department,
        yearbook,
        phone,
        gender,
        email,
        avatar,
        favouriteApartments,
      } = data;

      setToken(token);
      setPushToken(pushToken);
      setUserType(userType);
      setId(_id);
      setFirstName(firstName);
      setLastName(lastName);
      setAge(age);
      setPhone(phone);
      setAcademic(academic);
      setCoordinates(coordinates);
      setDepartment(department);
      setYearbook(yearbook);
      setGender(gender);
      setEmail(email);
      setAvatar(avatar);
      setFavouriteApartments(favouriteApartments);

      try {
        // Save user data to AsyncStorage
        await AsyncStorage.setItem("userData", JSON.stringify(data));
      } catch (err) {
        console.log(err);
      }
    };

    saveData();
  }, []);

  // Function to logout the user and remove data from AsyncStorage
  const logout = useCallback(() => {
    const removeData = async () => {
      try {
        // Remove user data from AsyncStorage
        await AsyncStorage.removeItem("userData");
      } catch (err) {
        console.log(err);
      }

      // Clear user state variables
      setToken(null);
      setPushToken(null);
      setUserType(null);
      setId(null);
      setFirstName(null);
      setLastName(null);
      setAge(null);
      setPhone(null);
      setAcademic(null);
      setCoordinates(null);
      setDepartment(null);
      setYearbook(null);
      setGender(null);
      setEmail(null);
      setAvatar(null);
      setFavouriteApartments([null]);
    };

    removeData();
  }, []);

  // Effect to retrieve stored data from AsyncStorage on component mount
  useEffect(() => {
    const getStoredData = async () => {
      try {
        // Retrieve stored user data and token from AsyncStorage
        const storedData = await AsyncStorage.getItem("userData");
        const storedToken = await AsyncStorage.getItem("token");

        if (storedData !== null) {
          // Login user with stored data
          login(JSON.parse(storedData), storedToken);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getStoredData();
  }, [login]);

  // Check if the hook is used outside of the UserProvider
  const userData = useContext(UserContext);
  if (userData === undefined) {
    throw new Error("UserContext was used outside of the UserProvider");
  }

  // Object containing login, logout functions, and user data
  return {
    userData,
    login,
    logout,
    token,
    pushToken,
    userType,
    id,
    firstName,
    lastName,
    age,
    phone,
    gender,
    academic,
    coordinates,
    department,
    yearbook,
    email,
    avatar,
    favouriteApartments,
  };
}

export { UserContext, useUsers };
