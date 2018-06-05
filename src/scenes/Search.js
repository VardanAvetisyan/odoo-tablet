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
      SearchBox:'',
      results:[],
      empty:''
    }// this.state
  }// constructor

async componentDidMount() {
    // this.refs.SearchByNameTextInput.setNativeProps({text: barcode.data});
    try {
          // console.log('Start fetchProducts(): ', new Date().getSeconds());
          const products = await fetchProducts({
            max: 10,
          });
          // console.log('End fetchProducts(): ', new Date().getSeconds());
           //console.log('Start updateProducts(): ', new Date().getSeconds());
          this.updateProducts(products);
          //console.log('End updateProducts(): ', new Date().getSeconds());

        } catch (e) {
          this.updateProducts([]);
        }// try-catch
}// componentDidMount


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
  };


async SearchFunc(event){
  const { theme } = this.context;
      const themeColor = COLOR[`${theme}500`].color;
      const { products } = this.state;

      var container=[];

     let SBox=this.state.SearchBox;
     products.map((item,key) => {

     if(item.name.search(SBox)> -1){
            container[key]=item.name;
          }
    })
     this.setState({results:container})
    if(this.state.results.length == 0){
        this.setState({empty:"NO RESULT"})
    }else{
        this.setState({empty:""})
    }

};



render () {
    const { theme } = this.context;
    const themeColor = COLOR[`${theme}500`].color;
    const { products } = this.state;
    var _scrollView: ScrollView;


    return (
      <View style={styles.container}>
        <TextInput
              onPress= {this.SearchFunc.bind(this)}
              style={styles.textInput}
              editable = {true}
              placeholder = "Search Box"
               onChangeText={SearchBox => this.setState({SearchBox})}
                value={this.state.SearchBox}
        />
         <Button
              text="Search"
              theme = "dark"
              raised={true}
              overrides={{
              textColor: '#ffffff',
              backgroundColor: themeColor
          }}
          onPress={this.SearchFunc.bind(this)}
       />
        <ScrollView
          ref={(scrollView) => { _scrollView = scrollView; }}
          automaticallyAdjustContentInsets={false}
          scrollEventThrottle={200}
          style={styles.scrollView}>
              {
                this.state.results.map((item,key) => {
                  return <View style={styles.line2} key={key}>
                                <Text style={styles.line}>
                                     <Text numberOfLines={1} >{item}</Text>
                                 </Text>
                                 </View>
                })
              }
              <Text style={styles.error}> {this.state.empty} </Text>
        </ScrollView>
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
    paddingBottom: 10
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
      backgroundColor: COLOR.googleGrey100.color,
      padding: 20
    },
    textInput:{
    height: 60,
    fontSize: 13,
    padding: 4,
    },

    error:{
     color:'#990000',
    }




};
