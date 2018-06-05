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
var numeral = require('numeral');

import {
  fetchProducts
} from '../utils/realm_db.js';

import { login } from '../utils/login_api';

import {
  getCustomer
} from '../utils/customer_api';

export default class Payments extends Component {

  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    theme: React.PropTypes.string.isRequired
  };// contextTypes

  constructor(props) {

    super(props);
    this.state = {
      loaded: false,
      type: '',
      details: {
      credit: null
      }
    }// this.state
  }// constructor

  _changePaymentType(type) {
    this.setState({
      ...this.state,
      type: type,

    });
  }

async componentDidMount() {
    // this.refs.SearchByNameTextInput.setNativeProps({text: barcode.data});
//try {
//      var user = await login('martins_vending@example.com','martins_vending');
//    } catch (e) {
//      return [];
//    }// try-catch
    updatePosition(this.refs['SELECT1']);
    updatePosition(this.refs['OPTIONLIST']);
    getCustomer(7,(details) => {
                    if(details.results)  {
                       return this.updateCustomerDetails(details.results[0])
                     } else {
                       console.warn('Missing results key in customer details');
                     }// if-else
               })
  }// componentDidMount
_getOptionList() {
    return this.refs['OPTIONLIST'];
  }

  updateCustomerDetails(details) {
      this.setState({
        details: details,
        loadingDetails: false
      })
    }//

  renderLoadingView() {
    const { theme } = this.context;
    const themeColor = COLOR[`${theme}500`].color;

    return (
      <View style={styles.container}>
        <ProgressBarAndroid styleAttr="Large" color={themeColor} />
      </View>
    );// return
  }
  getBalance(){
      var balance = 0;
      setInterval(function(){
        balance = this.state.details.credit
        },1000)
        return balance;
  }

  render () {
        const { theme, navigator } = this.context;
        const themeColor = COLOR[`${theme}500`].color;
        const {details} = this.state
    return (
      <View style={styles.container}>
      <View style={styles.line}>
        <Text style={styles.line1}>Find Purchases </Text>
        <Text style={styles.line1}> From:</Text>
      </View>
        <View style={{ flex: 1, padding: 40}}>
                     <Select
                       width={250}
                       ref="SELECT1"
                       optionListRef={this._getOptionList.bind(this)}
                       defaultValue="Payment Type"
                       onSelect={this._changePaymentType.bind(this)}>
                        <Option>Pay Roll</Option>
                        <Option>My Balance</Option>
                     </Select>
          <OptionList ref="OPTIONLIST"/>
                 </View>
         <View style={styles.line}>
         <Text style={styles.line1}>Your Balance</Text>
         <Text style={styles.line1}>$ {this.getBalance} {this.state.details.credit} </Text>

         </View>
         <View style={styles.container}>
         <Button text="Top up"
                  styles={{marginBottom:30}}
                  raised={true}
                  theme='dark'
                  overrides={{
                             textColor: '#ffffff',
                             backgroundColor: themeColor
                   }}
                   onPress={ () => {
                         navigator.forward('balance');
                             }}
                             />
             </View>
      </View>
    );
  }// render
}// ProductListView

const styles = {
    container: {
      flex: 1,
      flexDirection: 'column',
      flexWrap: 'wrap',
      // alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#fff',
      backgroundColor: COLOR.googleGrey100.color,
      padding: 20
    },
   line1:{
      fontWeight: 'bold',
      fontSize: 20,
      lineHeight: 35
   },
  line:{
      flexWrap:'wrap',
      justifyContent:'center',
      alignItems:'center',
    },
};
