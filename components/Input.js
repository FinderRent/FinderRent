import { useState } from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';

import { Color } from '../constants/colors';
import { useDarkMode } from '../context/DarkModeContext';

function Input({
  label,
  placeholder,
  mode,
  keyboardType,
  maxLength,
  onValueChange,
  style,
  error,
  right,
  left,
  value,
}) {
  const { isDarkMode } = useDarkMode();
  const [changeValue, setChangeValue] = useState();

  const handleValueChange = (selectedValue) => {
    setChangeValue(selectedValue);
    onValueChange(selectedValue);
  };

  return (
    <View style={style}>
      <TextInput
        autoCapitalize="none"
        maxLength={maxLength ? maxLength : null}
        label={label}
        placeholder={placeholder}
        style={
          isDarkMode
            ? { backgroundColor: Color.darkTheme }
            : { backgroundColor: Color.white }
        }
        selectionColor={Color.Blue700}
        outlineColor={Color.Blue200}
        activeOutlineColor={Color.Blue800}
        mode={mode}
        value={value}
        error={error}
        right={right}
        left={left}
        onChangeText={(value) => handleValueChange(value)}
        keyboardType={keyboardType ? keyboardType : null}
      />
    </View>
  );
}

export default Input;
