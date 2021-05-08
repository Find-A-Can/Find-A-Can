import React, { Component } from 'react'
import MapView, { Geojson } from 'react-native-maps'
import {getCans, getDefaultData} from './ServerInteract'
import {
  PermissionsAndroid,
  StyleSheet,
} from 'react-native'

/**
 * Manages the map element. Only works on Android
 */
export class FACMap extends Component {
  /*
    State stores 2 parts
      region is the currently viewed rectangular area
      cachedData is a GeoJSON feature list of markers to display
  */
  state = {
    region: {
      latitude: 47.656882, 
      latitudeDelta: 0.013500, 
      longitude: -122.308035, 
      longitudeDelta: 0.010948
    },
    cachedData: getDefaultData()
  }
  
  /**
   * Takes a region when the region changes and calls to the ServerInteract 
   *  to find any cans in that region 
   * @param {Object} region Rectangular search region
   * @param {Number} region.latitute Starting latitude value of rectangle
   * @param {Number} region.latituteDelta Latitude difference to the end of rectangle
   * @param {Number} region.longitude Starting longitude value of rectangle
   * @param {Number} region.longitudeDelta Longitude difference to the end of rectangle
   * 
   * @modifies State's cachedData is replaced with new data
   */
  async onRegionChange(region) {
    var newCans = await getCans(region);
    //console.log("new cans found " + JSON.stringify(newCans, null, 2));
    this.setState({cachedData: newCans});
  }

  /*
    Renders the map
  */
  render () {
    return (
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
          this.map.setNativeProps({ style: {
            ...styles.map,
            marginLeft: 1,} 
          })
        }}
        provider={MapView.PROVIDER_GOOGLE}
        ref={(el) => { this.map = el }}
        style={{ 
          ...styles.map,
        }}
        showsCompass={true}
        showsMyLocationButton={true}
        initialRegion={this.state.region}
        showsUserLocation={true}
        onRegionChangeComplete={region => this.onRegionChange(region)}
        zoomControlEnabled={true}
        customMapStyle={customMapStyle}
        pitchEnabled={false}
        >

        <Geojson 
          geojson={this.state.cachedData}
        />
      </MapView>
    )
  }
}

// Contains React styles for any componenents
const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
    flex:1
  }
});

// Style for the Google map
// Used to reduce the clutter of markers to just our trash cans
const customMapStyle = [
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
]