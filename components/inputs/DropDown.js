import { useState } from "react";
import { View, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

import { useDarkMode } from "../../context/DarkModeContext";

function DropDown({
  list,
  label,
  searchable,
  listMode,
  onValueChange,
  searchPlaceholder,
  placeholder,
  dropDownDirection,
  showArrowIcon,
  style,
  dropDownContainerStyle,
}) {
  const { isDarkMode } = useDarkMode();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(placeholder);
  const [items, setItems] = useState(list);

  const handleValueChange = (selectedValue) => {
    setValue(selectedValue);
    onValueChange(selectedValue);
  };
  return (
    <View style={styles.container}>
      <View style={[styles.view, style]}>
        <DropDownPicker
          theme={isDarkMode ? "DARK" : "LIGHT"}
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={handleValueChange}
          setItems={setItems}
          searchable={searchable}
          placeholder={label}
          listMode={listMode}
          searchPlaceholder={searchPlaceholder}
          dropDownDirection={dropDownDirection}
          showArrowIcon={showArrowIcon ?? true}
          showTickIcon={false}
          style={style}
          dropDownContainerStyle={dropDownContainerStyle}
        />
      </View>
    </View>
  );
}

export default DropDown;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  view: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 7,
    paddingTop: 7,
  },
});
