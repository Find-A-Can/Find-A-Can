import React, { Component } from 'react'
import { styles } from './App'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import {
  View
} from 'react-native'

export class FACMap extends Component {
  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  render () {
    return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsPointsOfInterest={false}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}
        showsUserLocation={true}
        >

        <Marker
        coordinate={{
          latitude: 37.78825,
          longitude: -122.4324
        }}
        title="Test Can"
        />
      </MapView>
    </View>
    )
  }
}

// getInitialState() {
//   return {
//     region: {
//       latitude: 37.78825,
//       longitude: -122.4324,
//       latitudeDelta: 0.0922,
//       longitudeDelta: 0.0421,
//     },
//   };
// }

// onRegionChange(region) {
//   this.setState({ region });
// }
