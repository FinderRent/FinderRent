import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

function DropDown({
  list,
  label,
  searchable,
  listMode,
  onValueChange,
  searchPlaceholder,
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(list);

  const handleValueChange = (selectedValue) => {
    setValue(selectedValue);
    onValueChange(selectedValue);
  };

  return (
    <View style={styles.container}>
      <View style={styles.view}>
        <DropDownPicker
          theme={'LIGHT'}
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 7,
    paddingTop: 7,
  },
});
