import React from 'react';

jest.useFakeTimers();

import {NativeModules} from 'react-native';

// Mock the RNCGeolocation native module to allow us to unit test the JavaScript code
NativeModules.RNCGeolocation = {
  addListener: jest.fn(),
  getCurrentPosition: jest.fn(),
  removeListeners: jest.fn(),
  requestAuthorization: jest.fn(),
  setConfiguration: jest.fn(),
  startObserving: jest.fn(),
  stopObserving: jest.fn(),
};

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