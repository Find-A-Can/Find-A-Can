import React, { Component } from 'react'
import MapView from 'react-native-maps'
import {addNewCan, getCans, getDefaultData} from './ServerInteract'
import CanMarkers from './CanMarkers';
import {
  PermissionsAndroid,
  StyleSheet,
  View,
  Button,
} from 'react-native'


var isGettingCans = false;

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
      latitudeDelta: 0.74, 
      longitude: -122.308035, 
      longitudeDelta: 0.74
    },
    cachedData: getDefaultData()
  }

  /**
   * Takes a region when the region changes and calls to the ServerInteract 
   *  to find any cans in that region 
   * @param {Object} region Rectangular search region
   * @param {Number} region.latitude Center latitude value of rectangle
   * @param {Number} region.latitudeDelta Latitude size of view rectangle
   * @param {Number} region.longitude Center longitude value of rectangle
   * @param {Number} region.longitudeDelta Longitude size of view rectangle
   * 
   * @modifies State's cachedData is replaced with new data if successful
   */
  async onRegionChange(region) {
    this.setState({region: region});
    // don't get or render any markers if user is zoomed out beyond 0.75 delta
    if (region.latitudeDelta > 0.75 && region.longitudeDelta > 0.75) {
      this.setState({cachedData: getDefaultData()});
      isGettingCans = false;
    } else if (!isGettingCans) {
      isGettingCans = true;
      try {
        let newCans = await getCans(region);
        if (isGettingCans) {
          this.setState({cachedData: newCans ?? getDefaultData()}, () => {
            isGettingCans = false;
          });
        }
      } catch (err) {
        console.log("onRegionChange failed");
        isGettingCans = false;
      }
    }
  }

  onAddCanPress() {
    addNewCan(
      this.state.region.latitude,
      this.state.region.longitude,
      true,
      true,
      true
    ).then(() => {
      this.onRegionChange(this.state.region)
    });
  }

  /*
    Renders the map
  */
  render () {
    return (
      <View style={{...styles.parent}}>
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

        <CanMarkers
          locations={this.state.cachedData.features}
          />
        </MapView>

        <View style={{...styles.buttonContainer}}>
            <Button title="add" onPress={() => this.onAddCanPress()}/>
            <Button title="filter"/>
        </View>
      </View>
    )
  }
}

// Contains React styles for any componenents
const styles = StyleSheet.create({
  parent: {
    flex: 1,
    flexDirection: 'column'
  },
  map: {
    flex:1
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
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