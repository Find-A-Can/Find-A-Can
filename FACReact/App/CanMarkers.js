import React from 'react';
import { Marker } from 'react-native-maps';

function MarkCans(props) {
  const {locations} = props;

  return (locations) ? (
    locations.map((location) => {
      let color = 'red';
      if (location.properties.isGarbage) {
        color = 'tan'
      } else if (location.properties.isRecycling) {
        color = 'blue'
      } else if (location.properties.isCompost) {
        color = 'green'
      }

      return <Marker
      key={location.geometry.coordinates}
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