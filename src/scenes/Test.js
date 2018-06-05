import React, {
  Component,
  PropTypes,
  View,
  Text,
  TextInput,
  Image,
  ListView,
  ScrollView,
  TouchableOpacity,
  ProgressBarAndroid,
} from 'react-native';

import {
  Avatar,
  Card,
  Icon,
  Button,
  Divider,
  COLOR,
  TYPO
} from 'react-native-material-design';

const DropDown = require('react-native-dropdown');
const {
  Select,
  Option,
  OptionList,
  updatePosition
} = DropDown;

export default class Test extends Component {
  constructor(props) {
    super(props);

    this.state = {
      canada: ''
    };
  }

  componentDidMount() {
    updatePosition(this.refs['SELECT1']);
    updatePosition(this.refs['OPTIONLIST']);
     updatePosition(this.refs['SELECT2']);
    updatePosition(this.refs['OPTIONLIST2']);
     updatePosition(this.refs['SELECT3']);
    updatePosition(this.refs['OPTIONLIST3']);
  }

  _getOptionList() {
    return this.refs['OPTIONLIST'];
  }
  _getOptionList2() {
    return this.refs['OPTIONLIST2'];
  }
  _getOptionList3() {
    return this.refs['OPTIONLIST3'];
  }


  _canada(province) {

    this.setState({
      ...this.state,
      canada: province
    });
  }

  render() {
    return (
    <View>
    <View style={{padding: 40, alignItems: 'center' }}>
              <Select
                width={250}
                ref="SELECT2"
                optionListRef={this._getOptionList2.bind(this)}
                defaultValue="Select a Province in Canada ..."
                onSelect={this._canada.bind(this)}>
                <Option>Alberta</Option>
                <Option>British Columbia</Option>
                <Option>Manitoba</Option>
                <Option>New Brunswick</Option>
                <Option>Newfoundland and Labrador</Option>
                <Option>Northwest Territories</Option>
                <Option>Nova Scotia</Option>
                <Option>Nunavut</Option>
                <Option>Ontario</Option>
                <Option>Prince Edward Island</Option>
                <Option>Quebec</Option>
                <Option>Saskatchewan</Option>
                <Option>Yukon</Option>
              </Select>

              <Text>Selected provicne of Canada: {this.state.canada}</Text>

              <OptionList ref="OPTIONLIST2"/>
          </View>
          <View style={{ flex: 1, padding: 40,zIndex:99}}>
                    <Select
                      width={250}
                      ref="SELECT1"
                      style={{zIindex:99}}
                      optionListRef={this._getOptionList.bind(this)}
                      defaultValue="Select a Province in Canada ..."
                      onSelect={this._canada.bind(this)}>
                      <Option>Alberta</Option>
                      <Option>British Columbia</Option>
                      <Option>Manitoba</Option>
                      <Option>New Brunswick</Option>
                      <Option>Newfoundland and Labrador</Option>
                      <Option>Northwest Territories</Option>
                      <Option>Nova Scotia</Option>
                      <Option>Nunavut</Option>
                      <Option>Ontario</Option>
                      <Option>Prince Edward Island</Option>
                      <Option>Quebec</Option>
                      <Option>Saskatchewan</Option>
                      <Option>Yukon</Option>
                    </Select>

                    <Text>Selected provicne of Canada: {this.state.canada}</Text>

                    <OptionList ref="OPTIONLIST"/>
                </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
                    <Select
                      width={250}
                      ref="SELECT3"
                      optionListRef={this._getOptionList3.bind(this)}
                      defaultValue="Select a Province in Canada ..."
                      onSelect={this._canada.bind(this)}>
                      <Option>Alberta</Option>
                      <Option>British Columbia</Option>
                      <Option>Manitoba</Option>
                      <Option>New Brunswick</Option>
                      <Option>Newfoundland and Labrador</Option>
                      <Option>Northwest Territories</Option>
                      <Option>Nova Scotia</Option>
                      <Option>Nunavut</Option>
                      <Option>Ontario</Option>
                      <Option>Prince Edward Island</Option>
                      <Option>Quebec</Option>
                      <Option>Saskatchewan</Option>
                      <Option>Yukon</Option>
                    </Select>

                    <Text>Selected provicne of Canada: {this.state.canada}</Text>

                    <OptionList ref="OPTIONLIST3"/>
                </View>

      </View>
    );
  }
}
