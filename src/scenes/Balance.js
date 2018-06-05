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
    createCardToken
    } from '../utils/api_stripe.js';

import {
  fetchProducts
} from '../utils/realm_db.js';

export default class Balance extends Component {

  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    theme: React.PropTypes.string.isRequired
  };// contextTypes

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      founds: false,
      CardNumber: '',
      ExpiryMonth: '',
      ExpiryYear:'',
      CVV2:'',
      many:'',
      ErrorCardNumber:false,
      ErrorMonth:false,
      ErrorYear:false,
      ErrorCVV2:false



    }// this.state
  }// constructor


     async TakeData(event){
            const { navigator } = this.context;
             let CardNumber = this.state.CardNumber;
             let ExpiryMonth = parseInt(this.state.ExpiryMonth);
             let ExpiryYear = parseInt(this.state.ExpiryYear);
             let CVV2 = parseInt(this.state.CVV2);
             let many = parseInt(this.state.founds);

            if(CardNumber.toString().length>16 || CardNumber.toString().length<16 ){
                this.setState({
                      ErrorCardNumber: 'Error the number count must be 16 ',

                });
            }

            if(ExpiryMonth && ExpiryMonth>12){
                      this.setState({
                          ErrorMonth: ' Error Card Month!!!',

                    });
            }

            if(ExpiryYear){
                var x=new Date().getFullYear();
                if(ExpiryYear<x || ExpiryYear>x+4){
                    this.setState({
                         ErrorYear: 'Error Year',

                   });
                }
            }

            if(CVV2 && CVV2.toString().length!=3){
               this.setState({
                    ErrorCVV2: 'Error the number count must be 3',

              });
            }

          await createCardToken(CardNumber,ExpiryMonth,ExpiryYear,CVV2).then(function(response){
                console.warn(JSON.stringify(response));
         });



    }



  _changeFounds(founds) {
    this.setState({
      ...this.state,
      founds : founds
    });
  }


_getOptionList() {
    return this.refs['Money'];
  }

  renderLoadingView() {
    const { theme } = this.context;
    const themeColor = COLOR[`${theme}500`].color;

    return (
      <View style={styles.container}>
        <ProgressBarAndroid styleAttr="Large" color={themeColor} />
      </View>
    );// return
  }

render () {
    const { theme } = this.context;
    const themeColor = COLOR[`${theme}500`].color;
    var _scrollView: ScrollView;



    return (
      <View style={styles.container}>
        <ScrollView
            ref={(scrollView) => { _scrollView = scrollView; }}
            automaticallyAdjustContentInsets={false}
            scrollEventThrottle={200}
            style={styles.scrollView}>

          <View style={styles.line}>
            <Text style={styles.line1}>ADD Founds</Text>
          </View>

            <View style={{ flex: 1, padding: 20}}>
                         <Select
                           style={{backgroundColor: 'white'}}
                           width={250}
                           ref="ChooseBalance"
                           optionListRef={this._getOptionList.bind(this)}
                           onSelect={this._changeFounds.bind(this)}>
                            <Option > $ 5 </Option>
                            <Option >$ 10</Option>
                            <Option >$ 15</Option>
                            <Option >$ 20</Option>
                         </Select>
                         <OptionList
                           style={styles.selectO}
                           ref="Money"
                          />
            </View>
             <View style={styles.line}>
               <Text style={styles.line1}>Payment Source</Text>
             </View>

             <TextInput
                 editable = {true}
                 placeholder ="Card Number"
                 style={styles.inputStyle}
                 secureTextEntry={true}
                  onChangeText={CardNumber => this.setState({CardNumber})}
                  value={this.state.CardNumber}
              />

              <Text  style={styles.error}> {this.state.ErrorCardNumber} </Text>


             <TextInput
                editable = {true}
                style={styles.inputStyle}
                placeholder ="Expiry Month"
                 onChangeText={ExpiryMonth => this.setState({ExpiryMonth})}
                 value={this.state.ExpiryMonth}
             />
               <Text  style={styles.error}>{this.state.ErrorMonth} </Text>

             <TextInput
                editable = {true}
                style={styles.inputStyle}
                placeholder = "Expiry Year"
                onChangeText={ExpiryYear => this.setState({ExpiryYear})}
                value={this.state.ExpiryYear}

             />
                <Text  style={styles.error}> {this.state.ErrorYear} </Text>

             <TextInput
                editable = {true}
                style={styles.inputStyle}
                placeholder = "CVV2/CVC2"
                 onChangeText={CVV2 => this.setState({CVV2})}
                 value={this.state.CVV2}
             />
             <Text  style={styles.error}> {this.state.ErrorYear}</Text>

         <View style={{flexDirection:"row",justifyContent: 'center',alignItems: 'center'}}>
         <Button text="Cancel"
                                  raised={true}
                                  theme='dark'
                                  styles={{marginBottom:30}}
                                  overrides={{
                                             textColor: '#ffffff',
                                             backgroundColor: themeColor
                                   }}
                                   onPress={ () => {
                                               navigator.forward('Payments',null,{added: false,});
                                             }}
                             /><Button text="Add"
                                  raised={true}
                                  theme='dark'
                                  styles={{marginBottom:30}}
                                  overrides={{
                                             textColor: '#ffffff',
                                             backgroundColor: themeColor
                                   }}
                                   onPress={
                                        () => {
                                               navigator.forward('Payments',null,{added: true,fonds: this.state.founds});
                                                }}
                                                onPress={this.TakeData.bind(this)}
                             />
                             </View>
       </ScrollView>
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
      padding: 30
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

    inputStyle:{
    borderWidth: 1,
    borderColor: '#0f0f0f',
    },

    selectO:{
  flex: 2,
    },
     scrollView:{
           height: 300,
        },

        error:{
         color:'#990000',
        }

};
