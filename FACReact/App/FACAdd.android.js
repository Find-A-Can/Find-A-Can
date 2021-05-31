import React, { Component } from 'react'
import MapView, { Marker } from 'react-native-maps'
import {addNewCan} from './ServerInteract'
import {
  StyleSheet,
  View,
  Button,
  Text,
  Image,
  Alert
} from 'react-native'
import PropTypes from 'prop-types';
import CheckBox from '@react-native-community/checkbox';
import markerPNG from './google-map-pin.png';
import { getPosition } from './FACMap.android'

/**
 * Manages the add element. Only works on Android
 */
export class FACAdd extends Component {
  static get propTypes() {
    return {
      onFinish: PropTypes.func
    };
  }
  /*
    State stores:
      region - the currently viewed rectangular area
      latitude, longitude - the lat and long of the new can
      isGarbage... etc - the flags for the new can
  */
  state = {
    region: {
      latitude: 47.656882, 
      latitudeDelta: 0.01, 
      longitude: -122.308035, 
      longitudeDelta: 0.01
    },
    latitude: null,
    longitude: null,
    isGarbage: false,
    isRecycling: false,
    isCompost: false,
  }

  constructor(props) {
    super(props);
  }

  onSubmit() {
    try {
      addNewCan(
        this.state.latitude,
        this.state.longitude,
        this.state.isGarbage,
        this.state.isCompost,
        this.state.isRecycling
      ).then(() => {
        this.props.onFinish(true);
      });
    } catch {
      Alert.alert("Failed to add new can", "Try again later");
    }
  }

  onRegionChange(region) {
    this.setState({region: region});
  }

  /*
    Renders the map
  */
  render () {
    return (
      <View style={styles.expandContainer}>
        <View style={styles.introContainer}>
          <Text style={styles.titleText}>Adding a Container</Text>
          <Text>To add a container, move the map to the container&apos;s location and press &quot;set location&quot;. Then, select which methods of disposal are available at the container. When you are finished, press &quot;Submit&quot;. Press &quot;Cancel&quot; at any time to exit the creation wizard.</Text>
          {/* explanation and header */}
        </View>
        <View style={styles.mapContainer} >
          <View style={styles.mapObjectContainer}>
            <MapView
            onMapReady={() => {
              this.map.setNativeProps({ style: {
                ...styles.expandContainer,
                marginLeft: 1,} 
              });
            }}
            provider={MapView.PROVIDER_GOOGLE}
            ref={(el) => { this.map = el }}
            style={{ 
              ...styles.expandContainer,
            }}
            showsCompass={true}
            showsMyLocationButton={true}
            initialRegion={this.state.region}
            showsUserLocation={true}
            onRegionChangeComplete={region => this.onRegionChange(region)}
            zoomControlEnabled={true}
            customMapStyle={customMapStyle}
            pitchEnabled={false}
            onLayout={() => {
              this.map.animateCamera({center: getPosition().coords});
            }}
            >
              {this.state.latitude &&
                <Marker
                  coordinate={{
                    latitude: this.state.latitude,
                    longitude: this.state.longitude
                  }}/>
              }

            </MapView>
            <View style={styles.mapTargetMarker}>
                  <Image source={markerPNG} style={styles.mapTargetPNG}></Image>
            </View>
          </View>

          <View style={styles.locationButton}>
            <Button title="Set Location" onPress={() => {
              this.map.getCamera().then(camera => {
                let {center} = camera;
                this.setState({latitude: center.latitude, longitude: center.longitude});
              });
            }}/>
          </View>

        </View>
        <View style={styles.optionsContainer}>
          <Text style={styles.typeSelectText}>Select Types (one or more)</Text>
          <View style={styles.containerOptionsPicker}>
            <View style={styles.containerOption}>
              <CheckBox
                value={this.state.isGarbage}
                onValueChange={() => this.setState({isGarbage: !this.state.isGarbage})}/>
              <Text>Garbage</Text>
            </View>
            <View style={styles.containerOption}>
              <CheckBox
                value={this.state.isRecycling}
                onValueChange={() => this.setState({isRecycling: !this.state.isRecycling})}/>
              <Text>Recycling</Text>
            </View>
            <View style={styles.containerOption}>
              <CheckBox
                value={this.state.isCompost}
                onValueChange={() => this.setState({isCompost: !this.state.isCompost})}/>
              <Text>Compost</Text>
            </View>
          </View>
        </View>

        <View style={styles.finishingButtonContainer}>
          <View style={styles.finishingButton}><Button title="Cancel" onPress={() => {this.props.onFinish(false)}}/></View>
          <View style={styles.finishingButton}>
            <Button
              disabled={!this.state.latitude || (!this.state.isGarbage && !this.state.isRecycling && !this.state.isCompost)}
              style={styles.finishingButton}
              title="Submit"
              onPress={this.onSubmit.bind(this)}
              />
          </View>
        </View>
      </View>
    )
  }
}

// Contains React styles for any components
const styles = StyleSheet.create({
  expandContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingTop: 4,
    paddingBottom: 4
  },
  introContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 6
  },
  titleText: {
    fontSize: 24
  },
  mapContainer: {
    flex: 6.75,
  },
  mapObjectContainer: {
    flex: 1
  },
  mapTargetMarker: {
    zIndex: 3,
    marginLeft: -24,
    marginTop: -24,
    left: '50%',
    position: 'absolute',
    top: '50%'
  },
  mapTargetPNG: {
    width: 48, 
    height: 48
  },
  locationButton: {
    alignSelf: 'center',
  },
  typeSelectText: {
    fontSize: 18,
    alignSelf: 'center'
  },
  optionsContainer: {
    flex: 1.25,
    flexDirection: 'column',
    marginTop: 16,
    marginBottom: 16,
    padding: 8
  },
  containerOptionsPicker: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  containerOption: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  finishingButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  finishingButton: {
    width: "45%"
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