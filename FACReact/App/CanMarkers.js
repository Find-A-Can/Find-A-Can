import React from 'react';
import { Marker } from 'react-native-maps';

function MarkCans(props) {
  const {
    locations,
    showGarbage,
    showRecycling,
    showCompost
  } = props;

  return (locations) ? (
    locations.filter(location => {
      if (showGarbage) return location.properties.isGarbage;
      else if (showRecycling) return location.properties.isRecycling;
      else if (showCompost) return location.properties.isCompost;
    }).map((location) => {
      let color = 'red';
      if (showGarbage) {
        color = 'tan'
      } else if (showRecycling) {
        color = 'blue'
      } else if (showCompost) {
        color = 'green'
      }

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