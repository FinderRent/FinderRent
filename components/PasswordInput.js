import { useState } from 'react';
import { TextInput } from 'react-native-paper';

import { Color } from '../constants/colors';
import { useDarkMode } from '../context/DarkModeContext';

function PasswordInput({ mode, onValueChange, label, color }) {
  const { isDarkMode } = useDarkMode();
  const [isSecure, setIsSecure] = useState(true);
  const [changeValue, setChangeValue] = useState();

  const handleValueChange = (selectedValue) => {
    setChangeValue(selectedValue);
    onValueChange(selectedValue);
  };

  return (
    <TextInput
      autoCapitalize="none"
      label={label}
      right={
        <TextInput.Icon
          icon={isSecure ? 'eye' : 'eye-off'}
          onPress={() => setIsSecure(!isSecure)}
        />
      }
      style={
        isDarkMode
          ? { backgroundColor: Color.darkTheme }
          : { backgroundColor: Color.white }
      }
      selectionColor={Color.Blue700}
      outlineColor={Color.Blue200}
      activeOutlineColor={color ? color : Color.Blue800}
      mode={mode}
      onChangeText={(value) => handleValueChange(value)}
      secureTextEntry={isSecure}
    />
  );
}

export default PasswordInput;
