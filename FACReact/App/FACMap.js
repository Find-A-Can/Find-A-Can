import React, { Component } from 'react'
import { styles } from './App'
import MapView, { Marker } from 'react-native-maps'
import {
  PermissionsAndroid,
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
        onMapReady={async () => {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                title: "Find A Can Location",
                message:
                  "Find A Can needs to know your location to help find nearby trash cans",
                buttonPositive: "Go To Permissions Page"
              }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              console.log("Access to location granted");
            } else {
              console.log("Access to location denied");
            }
          } catch (err) {
            console.warn(err);
          }
        }}
        provider={MapView.PROVIDER_GOOGLE}
        style={styles.map}
        showsPointsOfInterest={false}
        showsCompass={true}
        showsMyLocationButton={true}
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
