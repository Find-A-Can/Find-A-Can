import React, { Component } from 'react'
import { styles } from './App'
import MapView, { Marker } from 'react-native-maps'
import {
  PermissionsAndroid,
  View
} from 'react-native'

export class FACMap extends Component {

  //constructor() {
    //super();
    state = {
      region: {
        latitude: 47.656882, 
        latitudeDelta: 0.013500, 
        longitude: -122.308035, 
        longitudeDelta: 0.010948
      }//,
    //};
  }
  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  getInitialState() {
    return {
      region: {
        latitude: 47.656882, 
        latitudeDelta: 0.013500, 
        longitude: -122.308035, 
        longitudeDelta: 0.010948
      },
    };
  }
  
  onRegionChange(region) {
    this.setState({ region });

    console.log(this.state.region);
  }

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
        initialRegion={this.state.region}
        showsUserLocation={true}
        onRegionChangeComplete={region => this.onRegionChange(region)}
        >

        <Marker
        coordinate={{
          latitude: 47.656882, 
          longitude: -122.308035, 
        }}
        title="Test Can"
        />
      </MapView>
    </View>
    )
  }
}