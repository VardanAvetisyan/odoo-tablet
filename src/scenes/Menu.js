import React, {
  Component,
  PropTypes,
  View,
  Text,
  TextInput,
  Image,
  ListView,
  TouchableOpacity,
  ProgressBarAndroid,
  ScrollView
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

import {
  fetchProducts
} from '../utils/realm_db.js';

export default class Menu extends Component {

  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    theme: React.PropTypes.string.isRequired
  };// contextTypes

  constructor(props) {
    super(props);
    this.state = {
      products: [],
      cart_items: [],
      loaded: false,
    }// this.state
  }// constructor

async componentDidMount() {

  }// componentDidMount

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
    const { theme, navigator } = this.context;
    const themeColor = COLOR[`${theme}500`].color;

    return (
      <View style={styles.container}>
        <Button text="Payment"
                raised={true}
                theme='dark'
                overrides={{
                           textColor: '#ffffff',
                           backgroundColor: themeColor
                 }}
                 onPress={ () => {
                             navigator.forward('payments');
                           }}
           />
        <Button text="Cart"
                raised={true}
                styles={{marginBottom:30}}
                theme='dark'
                overrides={{
                            textColor: '#ffffff',
                            backgroundColor: themeColor
                  }}
                   onPress={ () => {
                               navigator.forward('cart');
                             }}/>
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
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    backgroundColor: COLOR.googleGrey100.color
  },
  productColumn: {
    flex: 0.75,
    // backgroundColor: COLOR.googleGreen300.color
  },
  cartColumn: {
    flex: 0.25,
    // backgroundColor: COLOR.googleYellow300.color
  },
  productListRow: {
    flex: 0.90,
    flexDirection: 'row',
    flexWrap: 'wrap',
    // alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: COLOR.paperGreen500.color
  },
  productSearchRow: {
    flex: 0.10,
    // backgroundColor: COLOR.paperGreen300.color
  },
  cartItemsRow: {
    flex: 0.75,
    // backgroundColor: COLOR.googleBlue300.color
  },
  cartTotalsRow: {
    flex: 0.25,
    // height: 100,
    // backgroundColor: COLOR.paperGreen300.color
  },
  card: {
    height: 250,
    width: 250,
    borderRadius: 0,
    // backgroundColor: COLOR.googleBlue100.color
  },
  item_card: {
    // height: 175,
    // width: 275,
    flexDirection: 'column',
    // justifyContent: 'flex-start',
    alignItems: 'stretch',
    borderRadius: 0,
    padding: 0,
    margin: 0,
    // backgroundColor: COLOR.googleBlue100.color
  },
  item_card_row: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    margin: 0,
    padding: 0,
    flexDirection: 'column'
  },
  cart_total: [
    {
      textAlign: 'right',
    },
    TYPO.paperFontDisplay1,
    COLOR.googleGrey700
  ],
  productSearchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchProductColumn: {
    flex: 0.3,
    // backgroundColor: COLOR.googleGreen300.color
  },
  dividerColumn: {
    flex: 0.1,
    // backgroundColor: COLOR.googleBlue300.color
  },
  scanBarcodeColumn: {
    flex: 0.3,
    // backgroundColor: COLOR.googleRed300.color
  },
  header: [
    {
      textAlign: 'center',
    },
    TYPO.paperFontHeadline,
    COLOR.googleGrey700
  ],
  subheader: [
    {
      textAlign: 'center',
    },
    TYPO.paperFontSubhead,
    COLOR.googleGrey700
  ]
};
