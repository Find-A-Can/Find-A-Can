/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { FACMap } from './FACMap.android'
import {
  StyleSheet,
  Dimensions,
} from 'react-native';


const App = () => {
  // const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  return (
    <FACMap/>
  );
};

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

// const Colors = {
//   primary: '#1292B4',
//   white: '#FFF',
//   lighter: '#F3F3F3',
//   light: '#DAE1E7',
//   dark: '#444',
//   darker: '#222',
//   black: '#000',
// }

export default App;
