import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

export class RadioButtons extends Component {
  static get propTypes() {
    return {
      initialValue: PropTypes.number,
      update: PropTypes.func,
      options: PropTypes.array
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedItem: this.props.initialValue
    }
    this.props.update(this.props.initialValue);
  }

  radioClick(id) {
    this.setState({
      selectedItem: id
    })
    this.props.update(id);
  }

  render () {
    const {options} = this.props;

    return (
      options.map((val) => {
        return (
          <View key={val.id} style={{...styles.radioButtonItemContainer}}>
            <TouchableOpacity onPress={this.radioClick.bind(this, val.id)}>
              <View style={{...styles.radioButton}}>
                {
                  val.id == this.state.selectedItem ?
                    <View style={{...styles.radioButtonSelected}} />
                    : null
                }
              </View>
            </TouchableOpacity>
            <Text>{val.title}</Text>
          </View>
        )
      })
    );
  }
}

const radioButtonColor = '#000000';

const styles = StyleSheet.create({
  radioButtonItemContainer: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  radioButton: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: radioButtonColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: radioButtonColor,
  }
});