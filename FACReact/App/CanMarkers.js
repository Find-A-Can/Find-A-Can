import React from 'react';
import { Marker } from 'react-native-maps';

function MarkCans(props) {
  const {locations} = props;

  return (locations) ? (
    locations.map((location) => {
      let color = 'red';
      let typeString = '';
      if (location.properties.isGarbage) {
        color = 'tan'
        typeString += 'Garbage ';
      } else if (location.properties.isRecycling) {
        color = 'blue'
        typeString += 'Recycling ';
      } else if (location.properties.isCompost) {
        color = 'green'
        typeString += 'Compost ';
      }

      typeString = typeString.trim();

      return <Marker
        key={location.geometry.coordinates}
        coordinate={{
          latitude: location.geometry.coordinates[0],
          longitude: location.geometry.coordinates[1]
        }}
        pinColor={color}
        title={'Has:'}
        description={typeString}
      />
    })
  ) : null;
}

const CanMarkers = React.memo(MarkCans);

export default CanMarkers;