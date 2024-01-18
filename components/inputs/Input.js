import { useState } from "react";
import { View } from "react-native";
import { TextInput } from "react-native-paper";

import { Color } from "../../constants/colors";
import { useDarkMode } from "../../context/DarkModeContext";

function Input({
  label,
  placeholder,
  mode,
  keyboardType,
  maxLength,
  onValueChange,
  style,
  right,
  left,
  value,
  color,
  multiline,
  numberOfLines,
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
        // selectionColor={Color.Blue700}
        // outlineColor={Color.Blue700}
        activeUnderlineColor={color ? color : Color.Blue700}
        activeOutlineColor={color ? color : Color.Blue700}
        mode={mode}
        value={value}
        right={right}
        left={left}
        multiline={multiline}
        numberOfLines={numberOfLines}
        onChangeText={(value) => handleValueChange(value)}
        keyboardType={keyboardType ? keyboardType : null}
      />
    </View>
  );
}

export default Input;
