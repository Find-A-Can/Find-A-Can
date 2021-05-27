/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import { FACMap } from './FACMap.android'
import { FACAdd } from './FACAdd.android'
import {
  StyleSheet,
  View,
  Button
} from 'react-native'

/**
 * Controls the entire application
 */
const App = () => {
  const [state, setState] = useState({
    isAdding: false
  })
  // const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  return (
    <View style={[styles.expandContainer, styles.rootContainer]}>
      {state.isAdding ? <FACAdd style={styles.expandContainer} onFinish={(added) => {
        setState({isAdding: false});
        if (added) {
          // do thing
        } else {
          // do other thing if necessary
        }
      }}/>
      : <View style={styles.expandContainer}>
         <FACMap/>
         <Button title="Add New Container" onPress={() => {setState({isAdding: true})}}/>
      </View>
       }
    </View>
  );
};

// Contains React styles for any components
const styles = StyleSheet.create({
  expandContainer: {
    flex: 1,
  },
  rootContainer: {
    flexDirection: 'column'
  }
});

export default App;
