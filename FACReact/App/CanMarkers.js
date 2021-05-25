import React from 'react';
import { Marker } from 'react-native-maps';

function MarkCans(props) {
  const {
    locations,
    color
  } = props;

  return (locations) ? (
    locations.map((location) => {
      return <Marker
      key={location.geometry.coordinates + color}
      coordinate={{
        latitude: location.geometry.coordinates[0],
        longitude: location.geometry.coordinates[1]
      }}
      pinColor={color}
      title={'Has:'}
      description={makeDescription(location)}
      />
    })
  ) : null;
}

/**
 * Creates a description of all can types in a single GeoJSON object
 * 
 * @param {Object} location single GeoJSON feature
 */
function makeDescription(location) {
  let valueString = '';
  if (location.properties.isCompost) {
    valueString += 'Compost ';
  }
  if (location.properties.isGarbage) {
    valueString += 'Garbage ';
  }
  if (location.properties.isRecycling) {
    valueString += 'Recycling ';
  }

  return valueString.trim();
}

const CanMarkers = React.memo(MarkCans);

export default CanMarkers;
