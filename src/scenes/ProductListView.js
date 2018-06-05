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
  ProgressBarAndroid
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

export default class ProductListView extends Component {

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

  updateProducts(products)  {
    this.setState({
      products: products,
      loaded: true
    });
  }// updateProducts

  async componentDidMount() {
    console.log(this.state.cart_items);
    let barcode = this.props.barcode || {data:'', type: ''};
    // this.refs.SearchByNameTextInput.setNativeProps({text: barcode.data});
    try {
      // console.log('Start fetchProducts(): ', new Date().getSeconds());
      const products = await fetchProducts({
        max: 10,
      });
      // console.log('End fetchProducts(): ', new Date().getSeconds());
      // console.log('Start updateProducts(): ', new Date().getSeconds());
      this.updateProducts(products);
      // console.log('End updateProducts(): ', new Date().getSeconds());
      this.onSearchButtonPress(this.state.products, barcode.data);
    } catch (e) {
      this.updateProducts([]);
      console.error(e);
    }// try-catch
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

  onProductRowTouched(item) {
    // const { navigator } = this.context;
    // navigator.forward(null, null, { product: item });
    const item_copy = Object.assign({}, item);
    this.addItemToCart(item_copy);
  }// onProductRowTouched

  addItemToCart(item)  {
    console.log(item);

    this.refs.SearchByNameTextInput.setNativeProps({text: ''});
    this.onSearchButtonPress(this.state.products, '');

    let cart_items = this.state.cart_items.slice();
    item.cart_index = cart_items.length;
    cart_items.push(item);
    this.setState({ cart_items });
  }// updateProducts

  removeItemFromCart(item)  {
    // console.log('Removing from cart: ', item);
    // const cart_index = item.cart_index;
    const cart_items = this.state.cart_items.filter((prod) => {
      return prod.cart_index !== item.cart_index
    });

    this.setState({ cart_items });
  }// removeItemFromCart

  renderProduct(item) {
    return (
      <TouchableOpacity
        style={styles.card}
        key={item.default_code}
        onPress={() => this.onProductRowTouched(item) }>
        <Card elevation={5}>
          <Card.Media
            image={<Image
              resizeMode="contain"
              source={{uri: "http://content.shoprite.com/circular/139/items/lg300_C_1019942_27_edcdf3d804d7.jpg"}} />}
          />
          <Card.Body>
            <Text numberOfLines={1} style={styles.header}>{item.name}</Text>
            <Text numberOfLines={1} style={styles.subheader}>
              $ { numeral(item.list_price).format('0.00') }
            </Text>
          </Card.Body>
        </Card>
      </TouchableOpacity>
    )// return
  }// renderProduct

  renderCartItem(item) {
    return (
      <TouchableOpacity
        style={styles.item_card}
        key={item.cart_index}
        onPress={() => this.removeItemFromCart(item) }>
        <Card elevation={5}>
          <Card.Body>
            <View style={styles.item_card_row}>
              <Icon style={{ marginRight:10 }} name="cancel" />
              <Text numberOfLines={1} style={styles.header}>{item.name}</Text>
            </View>
          </Card.Body>
        </Card>
      </TouchableOpacity>
    )// return
  }// renderCartItem

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

  renderProductSearchView()  {
    const { theme, navigator } = this.context;
    const themeColor = COLOR[`${theme}500`].color;
    const { products } = this.state;

    return (
      <View style={styles.productSearchContainer}>
        <View style={styles.searchProductColumn}>
          <TextInput
            style={styles.subheader}
            ref='SearchByNameTextInput'
            autoCapitalize='characters'
            autoCorrect={false}
            keyboardType='default'
            maxLength={20}
            placeholder='SEARCH BY NAME'
            placeholderTextColor={themeColor}
            underlineColorAndroid={themeColor}
            onBlur={() => {
              console.log('Name TextInput blurred');
              // this.onSearchButtonPress(products, '');
              // this.refs.SearchByNameTextInput.setNativeProps({text: ''});
            }}
            onSubmitEditing={() => {
              console.log('Name TextInput submitted');
              // this.onSearchButtonPress(products, '');
              // this.refs.SearchByNameTextInput.setNativeProps({text: ''});
            }}
            onChangeText={(text) => this.onSearchButtonPress(products, text) }
          />
        </View>
        <View style={styles.dividerColumn}>
          <Button
            text="- | -"
            disabled={true}
            raised={false}
            primary={theme}
          />
        </View>
        <View style={styles.scanBarcodeColumn}>
          <Button
            text="SCAN AN ITEM BARCODE"
            raised={true}
            primary={theme}
            onPress={ () => {
              navigator.forward('barcode_scanner_view', null, {
                onBarcodeReceived: (b) => {
                  navigator.back(null, { barcode: b });
                  console.log(b);
                }
              });
            }}
          />
        </View>
      </View>
    );// return
  }// renderProductSearchView


  calculateCartItemsTotal() {
    const { cart_items } = this.state;
    let cart_total = 0;
    cart_items.map((item) => {
      cart_total += item.list_price;
    });// cart_items.map

    return numeral(cart_total).format('0.00');
  }// calculateCartItemsTotal

  renderCartTotal() {
    const { cart_items } = this.state;
    const { theme, navigator } = this.context;

    let cart_total = this.calculateCartItemsTotal();

    return (
      <View style={styles.item_card}>
        <Card elevation={0}>
          <Card.Body>
            <View style={styles.item_card_row}>
              <Text numberOfLines={1} style={styles.cart_total}>
                $ { cart_total }
              </Text>
            </View>
          </Card.Body>
        </Card>
        <Button
          text="CHECKOUT"
          disabled={cart_items.length < 1 ? true : false}
          raised={true}
          primary={theme}
          theme='dark'
          onPress={ () => {
            navigator.forward('checkout_view', null, {cart_items});
          }}
        />
        {
          // onPress={this.onPayButtonPress.bind(this)}
        }
      </View>
    )// return
  }// renderCartTotal

  render () {
    const { theme } = this.context;
    const themeColor = COLOR[`${theme}500`].color;

    const { products, loaded, cart_items } = this.state;

    if(!loaded)  {
      return this.renderLoadingView();
    }// if

    return (
      <View style={styles.container}>
        <View style={styles.productColumn}>
          <View style={styles.productListRow}>
            <ScrollView horizontal={false}>
              <View style={styles.productListRow}>
              {
                products.map((item) => {
                  return this.renderProduct(item)
                })
              }
            </View>
            </ScrollView>
          </View>
          <View style={styles.productSearchRow}>
            {
              // <ProductInputView products={this.state.products}/>
              this.renderProductSearchView()
            }
          </View>
        </View>
        <View style={styles.cartColumn}>
          <View style={styles.cartItemsRow}>
            <ScrollView horizontal={false}>
              <View style={styles.cartItemsRow}>
                {
                  cart_items.map((item) => {
                    return this.renderCartItem(item)
                  })
                }
              </View>
            </ScrollView>
          </View>
          <View style={styles.cartTotalsRow}>
            {
              this.renderCartTotal()
            }
          </View>
        </View>
      </View>
    );
  }// render
}// ProductListView

const styles = {
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    // alignItems: 'center',
    justifyContent: 'center',
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
