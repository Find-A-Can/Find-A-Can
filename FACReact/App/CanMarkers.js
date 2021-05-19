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
      />
    })
  ) : null;
}

const CanMarkers = React.memo(MarkCans);

export default CanMarkers;