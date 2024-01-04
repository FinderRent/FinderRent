import {
  ImageBackground,
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  ScrollView,
  Image,
} from 'react-native';
import HouseCard from '../components/HouseCard';
import ProfileLocation from '../components/ProfileLocation';
import Map from '../components/Map';
/**
 * TODO:
 * when press on the profile photo, go to profile page.
 * when press on the location, open a search new location option
 * make the cards dynamic data from the DB
 */

function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
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
