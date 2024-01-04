import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';

const ProfileLocation = () => {
  return (
    <View style={styles.ProfileLocationView}>
      <View style={styles.midContainer}>
        <Image
          source={require('../assets/images/placeholder.png')}
          style={styles.LocationImage}
        />
        <View>
          <Text style={styles.Location}>Location</Text>
          <Text style={styles.LocationName}>SCE College</Text>
        </View>
      </View>
      <View style={styles.midContainer}>
        <Image
          source={require('../assets/images/profile-cartoon.png')}
          style={styles.profileImage}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ProfileLocationView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  Location: {
    fontSize: 18,
    color: '#3887BE',
  },
  LocationName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  LocationImage: {
    height: 42,
    width: 42,
    marginRight: 10,
    marginTop: 3,
  },
  profileImage: {
    height: 70,
    width: 70,
  },
  midContainer: {
    padding: 10,
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
export default ProfileLocation;
