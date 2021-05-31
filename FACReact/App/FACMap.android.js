import React, { Component } from 'react'
import MapView from 'react-native-maps'
import { getCans, getDefaultData} from './ServerInteract'
import CanMarkers from './CanMarkers';
import { RadioButtons } from './RadioButtons.android'
import {
  PermissionsAndroid,
  StyleSheet,
  View,
  Button,
  Text,
  Modal,
  Alert
} from 'react-native'
import CheckBox from '@react-native-community/checkbox';
import Geolocation from '@react-native-community/geolocation/';
import { getDistance } from 'geolib';

var isGettingCans = false;
var geolocationPosition;

export function getPosition() {
  return geolocationPosition;
}

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
      latitudeDelta: 0.1, 
      longitude: -122.308035, 
      longitudeDelta: 0.1
    },
    cachedData: getDefaultData(),
    showGarbage: true,
    showRecycling: true,
    showCompost: true,
    filterModalVisible: false,
    modalGarbage: false,
    modalRecycling: false,
    modalCompost: false,
    customSearch: false,
    searchMessage: ''
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
      Alert.alert("Zoomed too far out", "Zoom back in to see markers");
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
        Alert.alert("Failed to get cans", "Our database may be down, try again later");
        console.log("onRegionChange failed");
        isGettingCans = false;
      }
    }
  }

  /**
   * Called by RadioButtons component when selection changes
   * @param {Number} id id of newly selected RadioButton
   *
   * @modifies State's display settings are updated
   */
  onRadioButtonsUpdate(id) {
    this.setState({showGarbage: id === 1, showRecycling: id === 2, showCompost: id === 3});
  }

  /**
   * Sets the visibility status of the filter modal
   * @param {Boolean} visible desired filter modal visibility status
   *
   * @modifies State's filterModalVisible is updated with new value
   */
  setFilterModalVisible(visible) {
    this.setState({ filterModalVisible: visible });
  }

  componentWillUnmount() {
    this.watchID != null && Geolocation.clearWatch(this.watchID);
  }

  /**
   * Finds and zooms to the nearest displayed can of the visible type
   * 
   * @async
   * @modifies map's display is moved to the nearest can
   */
  async getNearestCan() {
    // if location isn't found, simply stops
    // may be better in future to show error to user
    if (!geolocationPosition || !geolocationPosition.coords) {
      Alert.alert("Can't get your location", "Make sure location services are enabled");
    }

    // gets array of visible cans to the user
    let visibleCans = this.filterCans();

    let nearestCoordinates = '';
    let closestDistance = '';

    // finds nearest can from visible cans
    try {
      visibleCans.forEach(can => {
        if (!nearestCoordinates) {
          nearestCoordinates = {
            latitude: can.geometry.coordinates[0],
            longitude: can.geometry.coordinates[1]
          }

          closestDistance = getDistance(nearestCoordinates, geolocationPosition.coords);
        } else {
          let canCoords = {
            latitude: can.geometry.coordinates[0],
            longitude: can.geometry.coordinates[1]
          }

          let newDistance = getDistance(canCoords, geolocationPosition.coords);

          if (newDistance < closestDistance) {
            nearestCoordinates = canCoords;
            closestDistance = newDistance;
          }
        }
      });
    } catch {
      Alert.alert("Can't find nearest cans", "Try again");
      return;
    }

    // stops if no nearest can isn't found
    if (!nearestCoordinates) {
      Alert.alert("No nearby cans found!", "Try zooming out");
      return;
    }

    // Has the nearest can and user's location, zooms in 
    this.map.fitToCoordinates([nearestCoordinates, geolocationPosition.coords], {
      edgePadding: { top: 0, right: 0, bottom: 0, left: 0 },
      animated: true,});
  }

  /**
   * Takes the current state's cans and filters them, returning those that should be visible
   * 
   * @returns array of GeoJSON features as can markers
   */
  filterCans() {
    return this.state.cachedData.features.filter(location => {
      if (this.state.customSearch) {
        if (this.state.modalGarbage && !location.properties.isGarbage) return false;
        if (this.state.modalRecycling && !location.properties.isRecycling) return false;
        if (this.state.modalCompost && !location.properties.isCompost) return false;

        // if no filters are selected, return nothing
        if (!this.state.modalGarbage && !this.state.modalRecycling && !this.state.modalCompost) return false;

        return true;
      } else {
        if (this.state.showGarbage) return location.properties.isGarbage;
        else if (this.state.showRecycling) return location.properties.isRecycling;
        else if (this.state.showCompost) return location.properties.isCompost;
      }
    })
  }

  /*
    Renders the map
  */
  render () {
    return (
      <View style={{...styles.parent}}>
        <MapView
        onMapReady={() => {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "Find A Can Location",
              message:
                "Find A Can needs to know your location to help find nearby trash cans",
              buttonPositive: "Go To Permissions Page"
            }
          ).then((permissionResult) => {
            if (permissionResult === PermissionsAndroid.RESULTS.GRANTED) {
              console.log("Access to location granted");
              Geolocation.getCurrentPosition(
                position => {
                  geolocationPosition = position;
                  this.setState({position: position});
                },
                () => Alert.alert("Can't get your location", "Make sure location services are enabled"),
                {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
              );
              this.watchID = Geolocation.watchPosition(position => {
                geolocationPosition = position;
                this.setState({position: position});
              });
            } else {
              console.log("Access to location denied");
              Alert.alert("Can't get your location", "Make sure location services are enabled");
            }
          },
          // if error in getting permissions 
          () => {
            Alert.alert("Can't get your location", "Make sure location services are enabled")
          });
          this.map.setNativeProps({ style: {
            ...styles.map,
            marginLeft: 1,} 
          })
          if (geolocationPosition && geolocationPosition.coords) {
            this.map.animateCamera({center: geolocationPosition.coords});
          } else {
            console.log(geolocationPosition);
          }
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
          // filter locations before they are provided to the marker handler
          // display no locations when the modal is open
          locations={this.state.filterModalVisible ? null : this.filterCans()}
          // determine color and provide it to marker handler
          color={this.state.customSearch ? 'purple' : this.state.showGarbage ? 'tan' : this.state.showRecycling ? 'blue' : this.state.showCompost ? 'green' : 'red'}
          />
        </MapView>

        <View style={{...styles.bottomContainer}}>
          <Text style={{...styles.centeredText}}>{"Containers"}</Text>
          <View style={{...styles.bottomSubContainer}}>
            {!this.state.customSearch ?
                // radiobuttons will not display if custom search is active
                <RadioButtons
                  initialValue={1}
                  options={[
                    { id: 1, title: 'Garbage' },
                    { id: 2, title: 'Recycling' },
                    { id: 3, title: 'Compost' }
                  ]}
                  update={this.onRadioButtonsUpdate.bind(this)}/>
            : null}

            {this.state.customSearch ?
              // filter text will display when custom search is active
              <View style={styles.customSearchMessage}>
                <Text>Active Filters:</Text>
                <Text>{this.state.searchMessage.length == 0 ? 'no filters selected' : this.state.searchMessage}</Text>
              </View>
            : null}

            <View style={this.state.customSearch ? styles.customSearchControls : null /* only use flex styling when custom search is active */}>
              <Button title={this.state.customSearch ? "modify" : "custom"} onPress={() => {this.setFilterModalVisible(true)}}></Button>
              {this.state.customSearch ?
                <Button title="clear" onPress={() => {this.setState({modalGarbage: false, modalRecycling: false, modalCompost: false, customSearch: false})}}></Button>
              : null}
            </View>

          </View>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.filterModalVisible}
          onRequestClose={() => {
            this.setFilterModalVisible(!this.state.filterModalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <View style={styles.modalTitleArea}>
                <Text style={styles.centeredText}>Filter Containers</Text>
                <Text>Select desired properties and then press &apos;Apply&apos;. The map will then show locations which match all desired properties.</Text>
              </View>

              <View style={[styles.modalRowContainer, styles.modalCheckBoxRow]}>
                <Text>{"Garbage"}</Text>
                <CheckBox
                  value={this.state.modalGarbage}
                  onValueChange={() => this.setState({modalGarbage: !this.state.modalGarbage})}
                />
              </View>

              <View style={[styles.modalRowContainer, styles.modalCheckBoxRow]}>
                <Text>{"Recycling"}</Text>
                <CheckBox
                  value={this.state.modalRecycling}
                  onValueChange={() => this.setState({modalRecycling: !this.state.modalRecycling})}
                />
              </View>

              <View style={[styles.modalRowContainer, styles.modalCheckBoxRow]}>
                <Text>{"Compost"}</Text>
                <CheckBox
                  value={this.state.modalCompost}
                  onValueChange={() => this.setState({modalCompost: !this.state.modalCompost})}
                />
              </View>

              <View style={[styles.modalRowContainer, styles.modalControlContainer]}>
                <Button title="cancel" onPress={() => {this.setFilterModalVisible(!this.state.filterModalVisible)}}></Button>
                <Button title="apply" onPress={() => {
                  this.setFilterModalVisible(!this.state.filterModalVisible);
                  // construct search message to be displayed to user
                  let newSearchMessage = [
                    {value: this.state.modalGarbage, text: 'Garbage'},
                    {value: this.state.modalRecycling, text: 'Recycling'},
                    {value: this.state.modalCompost, text: 'Compost'}
                  ].filter(item => item.value).map(item => item.text).join(', ');
                  this.setState({customSearch: true, searchMessage: newSearchMessage});
                }}></Button>
              </View>
            </View>
          </View>
        </Modal>
      <Button title="Find Nearest Can" onPress={() => {this.getNearestCan()}}/>
      </View>
    )
  }
}

// color variables
const colorWhite = '#fff';
const colorBlack = '#000'

// Contains React styles for any componenents
const styles = StyleSheet.create({
  parent: {
    flex: 1,
    flexDirection: 'column'
  },
  map: {
    flex:1
  },
  bottomContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  bottomSubContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    minHeight: 45
  },
  centeredText: {
    textAlign: 'center',
    textDecorationLine: 'underline'
  },
  customSearchMessage: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  customSearchControls: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    minWidth: 250,
    backgroundColor: colorWhite,
    borderRadius: 10,
    padding: 30,
    shadowColor: colorBlack,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitleArea: {
    marginBottom: 25
  },
  modalRowContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  modalCheckBoxRow: {
    justifyContent: 'center'
  },
  modalControlContainer: {
    marginTop: 25,
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