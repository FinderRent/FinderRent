import { StyleSheet, View } from 'react-native';
import * as ImagePickerFromGallery from 'expo-image-picker';
import { Button } from 'react-native-paper';

import { useDarkMode } from '../context/DarkModeContext';
import { Color } from '../constants/colors';

function ImagePicker({ onPickImage }) {
  const { isDarkMode } = useDarkMode();

  async function pickedImageHandler() {
    const image = await ImagePickerFromGallery.launchImageLibraryAsync({
      mediaTypes: ImagePickerFromGallery.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!image.canceled) {
      onPickImage(image.assets[0].uri);
    }
  }

  return (
    <View>
      <Button
        style={styles.button}
        textColor={isDarkMode ? Color.buttomSheetDarkTheme : Color.defaultTheme}
        buttonColor={
          isDarkMode ? Color.defaultTheme : Color.buttomSheetDarkTheme
        }
        mode="contained"
        onPress={pickedImageHandler}
      >
        בחר מהגלרייה
      </Button>
    </View>
  );
}

export default ImagePicker;

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  button: {
    marginBottom: 15,
  },
});
