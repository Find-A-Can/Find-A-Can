jest.useFakeTimers();

import React from 'react';
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
  const { Component } = require('react');
  const { View } = require('react-native');

  class MockMapView extends Component {
    render() {
      return <View>{this.props.children}</View>;
    }
  }

  class MockMarker extends Component {
    render() {
      return <View>{this.props.children}</View>;
    }
  }
    return {
      __esModule: true,
      default: MockMapView,
      Marker: MockMarker,
    };
  });