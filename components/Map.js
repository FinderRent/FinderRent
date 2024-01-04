import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Animated,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 *
 * TODO: when map expand, adjust the bottom view of the map.
 */

const Map = () => {
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(200)).current;

  const toggleMapSize = () => {
    if (expanded) {
      Animated.timing(animation, {
        toValue: 200,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: Dimensions.get('window').height,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    setExpanded(!expanded);
  };

  const closeMap = () => {
    Animated.timing(animation, {
      toValue: 200,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setExpanded(false);
    });
  };

  const handleMapPress = () => {
    if (!expanded) {
      toggleMapSize();
    }
  };

  return (
    <TouchableOpacity
      onPress={toggleMapSize}
      activeOpacity={1}
      style={[styles.mapWindow, expanded && styles.expandedMapWindow]}
    >
      <Animated.View
        style={[
          styles.map,
          expanded && styles.expandedMap,
          { height: animation },
        ]}
      >
        <MapView
          style={{ flex: 1 }}
          // provider={PROVIDER_GOOGLE}
          onPress={handleMapPress}
          onTouchStart={handleMapPress}
        />
      </Animated.View>
      {expanded && (
        <View style={styles.closeButtonContainer}>
          <TouchableOpacity onPress={closeMap} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mapWindow: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    margin: 10,
  },
  expandedMapWindow: {
    position: 'relative',
    zIndex: 999,
    top: 0,
    left: 0,
    width: '95%',
    borderRadius: 12,
  },
  map: {
    width: '100%',
    resizeMode: 'cover',
  },
  expandedMap: {
    flex: 1,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  closeButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Map;
