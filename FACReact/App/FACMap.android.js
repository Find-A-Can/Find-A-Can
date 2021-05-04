import React, { Component } from 'react'
import MapView, { Geojson } from 'react-native-maps'
import {
  PermissionsAndroid,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native'

// usable colors here https://github.com/react-native-maps/react-native-maps/issues/887#issuecomment-324530282
const geojsontest = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "marker-color": "tomato",
        "marker-size": "medium",
        "marker-symbol": "square"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -122.30759382247925,
          47.65881179780758
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "marker-color": "blue",
        "marker-size": "medium",
        "marker-symbol": ""
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -122.30946063995361,
          47.65437463432688
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "marker-color": "yellow",
        "marker-size": "medium",
        "marker-symbol": "triangle"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -122.30370998382567,
          47.65544421310926
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "marker-color": "aqua",
        "marker-size": "medium",
        "marker-symbol": "circle"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -122.30332374572754,
          47.6584071209998
        ]
      }
    }
  ]
}

export class FACMap extends Component {
  state = {
    region: {
      latitude: 47.656882, 
      latitudeDelta: 0.013500, 
      longitude: -122.308035, 
      longitudeDelta: 0.010948
    }
  }

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

        <Geojson 
          geojson={geojsontest}
        />
      </MapView>
    </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});