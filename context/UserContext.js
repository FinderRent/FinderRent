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
  const [country, setCountry] = useState(null);
  const [age, setAge] = useState(null);
  const [phone, setPhone] = useState(null);
  const [academic, setAcademic] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [department, setDepartment] = useState(null);
  const [yearbook, setYearbook] = useState(null);
  const [gender, setGender] = useState(null);
  const [hobbies, setHobbies] = useState(null);
  const [funFact, setFunFact] = useState(null);
  const [email, setEmail] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [socialNetworks, setSocialNetworks] = useState(null);

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
        country,
        age,
        academic,
        coordinates,
        department,
        yearbook,
        phone,
        gender,
        hobbies,
        funFact,
        email,
        avatar,
        socialNetworks,
      } = data;

      setToken(token);
      setPushToken(pushToken);
      setUserType(userType);
      setId(_id);
      setFirstName(firstName);
      setLastName(lastName);
      setCountry(country);
      setAge(age);
      setPhone(phone);
      setAcademic(academic);
      setCoordinates(JSON.stringify(coordinates));
      setDepartment(department);
      setYearbook(yearbook);
      setGender(gender);
      setHobbies(hobbies);
      setFunFact(funFact);
      setEmail(email);
      setAvatar(avatar);
      setSocialNetworks(socialNetworks);

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
      setCountry(null);
      setAge(null);
      setPhone(null);
      setAcademic(null);
      setCoordinates(null);
      setDepartment(null);
      setYearbook(null);
      setGender(null);
      setHobbies(null);
      setFunFact(null);
      setEmail(null);
      setAvatar(null);
      setSocialNetworks(null);
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
    country,
    age,
    phone,
    gender,
    academic,
    coordinates,
    department,
    yearbook,
    hobbies,
    funFact,
    email,
    avatar,
    socialNetworks,
  };
}

export { UserContext, useUsers };
