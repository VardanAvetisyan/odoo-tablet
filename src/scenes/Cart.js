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

export default class Cart extends Component {

  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    theme: React.PropTypes.string.isRequired
  };// contextTypes

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      products: [],
      myButtonOpacity:[],
      Total
    }// this.state
  }// constructor

async componentDidMount() {
    // this.refs.SearchByNameTextInput.setNativeProps({text: barcode.data});
    try {
          // console.log('Start fetchProducts(): ', new Date().getSeconds());
          const products = await fetchProducts({
            max: 10,
          });
          this.updateProducts(products);

          // console.log('End fetchProducts(): ', new Date().getSeconds());
           //console.log('Start updateProducts(): ', new Date().getSeconds());

          //console.log('End updateProducts(): ', new Date().getSeconds());

        } catch (e) {
          this.updateProducts([]);
        }// try-catch
}// componentDidMount


renderProduct(item) {
    return (
    <View style={styles.line2} key={item.default_code}>
       <Text style={styles.line}><Icon
                                                   name="highlight-off"
                                                   color={theme}
                                                  size={16}
                                                />
            <Text numberOfLines={1} >{item.name}</Text>
            <Text numberOfLines={1} >
              $ { numeral(item.list_price).format('0.00') }
            </Text>
        </Text>
        </View>

    )// return
  }// renderProduct



async onSearchButtonPress(products, filter) {
    console.log('Pressed Search button.');
    filter = `name BEGINSWITH[c] "${filter}" OR name CONTAINS[c] "${filter}" OR default_code BEGINSWITH[c] "${filter}"`;
    console.log(filter);
    const filteredProducts = await fetchProducts({
      filter: filter,
      max: 10,
    });// filteredProducts
    // console.log(filteredProducts);
        this.updateProducts(filteredProducts);
      };// onSearchButtonPress


updateProducts(product)  {
    this.setState({
      products: product,
      loaded: true
    },function(){
    console.warn(JSON.stringify(product))
    });
  }// updateProduct


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
   const { products } = this.state;
   var _scrollView: ScrollView;
   var total = 0;

    return (
        <View style={styles.container}>
            <View>
                <View style ={styles.buttons}>
                <Button
                   text="Search Items"
                   theme = "dark"
                   raised={true}
                    overrides={{
                     textColor: '#ffffff',
                     backgroundColor: themeColor
                   }}
                   onPress={ () => {
                    navigator.forward('search_view');
                  }}
                />
                <Button
                  text="Search Barcode"
                  theme = "dark"
                  raised={true}
                    overrides={{
                    textColor: '#ffffff',
                    backgroundColor: themeColor
                  }}
                   onPress={ () => {
                     navigator.forward('barcode_scanner_view');
                   }}/>
               </View>
            <View >
                <ScrollView
                  ref={(scrollView) => { _scrollView = scrollView; }}
                  automaticallyAdjustContentInsets={false}
                  scrollEventThrottle={200}
                  style={styles.scrollView}>
                      {
                        products.map((item,key) => {
                            total += item.list_price;
                          return <View style={styles.line2} key={key}>
                           <TouchableOpacity style={styles.container} onPress={() => {var opacity = this.state.myButtonOpacity; opacity[key] = true;  this.setState({myButtonOpacity: opacity})}}>
                           <Text style={[styles.line,{ height: (typeof this.state.myButtonOpacity[key] != 'undefined') ? 0 : 40 }]} >
                            <Icon
                                name="highlight-off"
                                color={theme}
                               size={16}
                               />
                             <Text numberOfLines={1} >{item.name}</Text>
                                    <Text numberOfLines={1} >
                                  $ { numeral(item.list_price).format('0.00') }
                                 </Text>
                             </Text>
                             </TouchableOpacity>
                             </View>

                        })
                      }
                </ScrollView>
                 </View>

                  </View>
                    <View style={styles.buttons1}>
                    <Text style={styles.line3}> Total ${total}{this.setState({myButtonOpacity: opacity})}</Text>
                    <Text style={styles.line3}> Tax $0.50</Text>
                    <Button style = {styles.buttons1}
                                          text="Checkout"
                                          theme = "dark"
                                          raised={true}
                                           overrides={{
                                              textColor: '#ffffff',
                                              backgroundColor: themeColor
                                            }}
                     onPress={ () => {

                    navigator.forward('checkout_view',null,{total: total}});
                        }
                    }
                    />

                                          </View>
                  </View>
    );
  }// render
}// ProductListView

const styles = {
    line2:{
         alignItems:'flex-start',
         justifyContent:'center',
         flex: 0.8,
         padding: 15
    },
    buttons:{
     flexDirection:'row',
     justifyContent: 'center'
    },
    line1: {
    justifyContent:'flex-end',
    flexDirection:'row'
    },
  buttons1:{
  flexDirection:'column',
  justifyContent:'flex-end',
  },
  line:{
  flexDirection: 'column',
  flexWrap:'wrap',
  justifyContent:'center',
  alignItems:'center',
  fontSize: 16,
  },
  line3:{
  fontSize:20,
  justifyContent:'flex-end'
  },
  scrollView:{
     height: 350,
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

  header: [
    {
      textAlign: 'center',
    },
    TYPO.paperFontHeadline,
    COLOR.googleGrey700
  ],
};
