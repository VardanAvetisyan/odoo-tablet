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

var numeral = require('numeral');

export default class Checkout extends Component {

  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    theme: React.PropTypes.string.isRequired
  };// contextTypes

  constructor(props) {
    super(props);
    this.props = {
    total: '5'
    }
    this.state = {
      loaded: false,
    }// this.state
  }// constructor

async componentDidMount() {


}// componentDidMount

render () {
   const { theme, navigator } = this.context;
   const themeColor = COLOR[`${theme}500`].color;


    return (
       <View style={styles.container}>
           <View style={styles.line}>
                 <Text style={styles.line1}>Order Complete </Text>
                 <Text style={styles.line1}> Total {this.props.total}</Text>

             <View style={styles.thanks}>
                <Text style={styles.line1}>Thank You </Text>
             </View>
             <View>
                <Text style={styles.line1}> for shopping </Text>
             </View>
           </View>
       </View>

    );
  }// render
}// ProductListView

const styles = {
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
  container: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    // alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    backgroundColor: COLOR.googleGrey100.color
  },
 thanks:{
 paddingTop: 50
 }


};
