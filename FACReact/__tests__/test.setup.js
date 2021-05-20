import React from 'react';

jest.useFakeTimers();

jest.mock('react-native-maps', () => {
    const { View } = require('react-native');
    const MockMapView = (props: any) => {
      return <View>{props.children}</View>;
    };
    const MockMarker = (props: any) => {
        return <View>{props.children}</View>;
      };
    const MockGeojson = (props: any) => {
        return <View>{props.children}</View>;
      };
    return {
      __esModule: true,
      default: MockMapView,
      Marker: MockMarker,
      Geojson: MockGeojson
    };
  });