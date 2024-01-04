import { StyleSheet, SafeAreaView, ScrollView, Platform } from 'react-native';
import Map from '../components/Map';

import { Color } from '../constants/colors';
import HouseCard from '../components/HouseCard';
import ProfileLocation from '../components/ProfileLocation';
import { useDarkMode } from '../context/DarkModeContext';
import { StatusBar } from 'expo-status-bar';

/**
 * TODO:
 * when press on the profile photo, go to profile page.
 * when press on the location, open a search new location option
 * make the cards dynamic data from the DB
 */

function HomeScreen() {
  const { isDarkMode } = useDarkMode();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 0 : 35,
        backgroundColor: isDarkMode ? Color.darkTheme : Color.white,
      }}
    >
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      <ProfileLocation />
      <ScrollView>
        <HouseCard />
        <Map />
        {/* <HouseCard />
        <HouseCard />
        <HouseCard /> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});

export default HomeScreen;
