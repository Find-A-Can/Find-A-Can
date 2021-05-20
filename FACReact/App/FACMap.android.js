import React, { Component } from 'react'
import MapView from 'react-native-maps'
import {addNewCan, getCans, getDefaultData} from './ServerInteract'
import CanMarkers from './CanMarkers';
import { RadioButtons } from './RadioButtons.android'
import {
  PermissionsAndroid,
  StyleSheet,
  View,
  Button,
  Text,
  Modal
} from 'react-native'
import CheckBox from '@react-native-community/checkbox';

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

  onRadioButtonsUpdate(id) {
    this.setState({showGarbage: id === 1, showRecycling: id === 2, showCompost: id === 3});
  }

  toggleFilterModal(visible) {
    this.setState({ filterModalVisible: visible });
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
          // filter locations before they are provided to the marker handler
          // display no locations when the modal is open
          locations={this.state.filterModalVisible ? null : this.state.cachedData.features.filter(location => {
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
          })}
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
                <Text>Filters:</Text>
                <Text>{this.state.searchMessage.length == 0 ? 'no filters selected' : this.state.searchMessage}</Text>
              </View>
            : null}

            <View style={this.state.customSearch ? styles.customSearchControls : null /* only use flex styling when custom search is active */}>
              <Button title={this.state.customSearch ? "modify" : "custom"} onPress={() => {this.toggleFilterModal(true)}}></Button>
              {this.state.customSearch ?
                <Button title="clear" onPress={() => {this.setState({modalGarbage: false, modalRecycling: false, modalCompost: false, customSearch: false})}}></Button>
              : null}
            </View>

          </View>
            <Button title="Add New Container" onPress={() => this.onAddCanPress()}/>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.filterModalVisible}
          onRequestClose={() => {
            this.toggleFilterModal(!this.state.filterModalVisible);
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
                <Button title="cancel" onPress={() => {this.toggleFilterModal(!this.state.filterModalVisible)}}></Button>
                <Button title="apply" onPress={() => {
                  this.toggleFilterModal(!this.state.filterModalVisible);
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