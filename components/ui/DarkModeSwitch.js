import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Switch } from "react-native-paper";

function DarkModeSwitch({ color, onToggle }) {
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  useEffect(() => {
    const fetchDarkMode = async () => {
      try {
        const isDarkMode = await AsyncStorage.getItem("darkMode");
        if (isDarkMode !== null) {
          setIsSwitchOn(JSON.parse(isDarkMode));
        }
      } catch (err) {
        // console.log(err);
      }
    };

    fetchDarkMode();
  }, []);

  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
    onToggle(!isSwitchOn);
  };
  return (
    <Switch
      value={isSwitchOn}
      onValueChange={onToggleSwitch}
      color={color}
      testID="dark-mode-switch"
    />
  );
}

export default DarkModeSwitch;
