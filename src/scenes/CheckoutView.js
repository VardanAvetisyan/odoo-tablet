import React, {
  View,
  Text,
  Image,
  Component,
  ProgressBarAndroid
} from 'react-native';

import {
  Card,
  Icon,
  Button,
  TYPO,
  COLOR
} from 'react-native-material-design';

import {
  login as Auth0CustomerLogin
} from './Auth0LoginView';

import {
  get_signed_token
} from '../utils/token_api.js';

import {
  add_transaction
} from '../utils/transaction_api.js';

import {
  get_customer_id,
  send_order_url_to_customer
} from '../utils/customer_api.js';

export default class CheckoutView extends Component {
  static contextTypes = {
    navigator: React.PropTypes.object.isRequired,
    theme: React.PropTypes.string.isRequired
  };// contextTypes

  static propTypes = {
    cart_items: React.PropTypes.array.isRequired
  };// propTypes

  constructor(props) {
    super(props);

    this.state = {
      checkout_done: false,
      checkout_error: false
    };
  }// constructor

  componentDidMount() {
    const { checkout_done } = this.state;
    if(!checkout_done)  {
      this.initiateCheckoutProcess();
    }//if
  }// componentDidMount

  async initiateCheckoutProcess()  {
    generateOrderUrl = this.generateOrderUrl;
    submitOrder = this.submitOrder;

    Auth0CustomerLogin(async (err, profile, token) => {
      if(err) {
        console.log(err);
        this.setState({
          checkout_done: false,
          checkout_error: true
        });

      } else {

        let customer_id = await get_customer_id(profile);
        console.log('customer id: ', customer_id);
        profile.customer_id = customer_id; // add customer_id info from Odoo

        await this.submitOrder(customer_id, profile);

        let invoice_url_token = await this.generateOrderUrl(profile);
        console.log(invoice_url_token);

        try {
          const send_response = await send_order_url_to_customer(invoice_url_token);
          console.log(send_response);
          this.setState({
            checkout_done: true,
            checkout_error: false
          });
        } catch (e) {
          console.warn(e);
          this.setState({
            checkout_done: true,
            checkout_error: true
          });
        }// try-catch
      }// if-else
    });// Auth0CustomerLogin
  }// initiateCheckoutProcess

  async generateOrderUrl(customer_profile) {
    const customer_id = customer_profile.customer_id || null;
    const sales_order_data = this.generateOrderObject(customer_id);

    let stripe_form_data = {
      amount: this.calculateCartItemsTotal(),
      currency: 'usd',
      description: 'Kiosk Purchases'
    };// stripe_form_data

    var token = await get_signed_token({
      sales_order_data,
      stripe_form_data,
      customer_profile
    });// get_signed_token

    return token;
  }// generateOrderUrl

  async submitOrder(customer_id, auth0_profile)  {
    let sales_data = this.generateOrderObject(customer_id);

    var tx_data = await add_transaction(sales_data, auth0_profile);
    console.log(tx_data);
  }// submitOrder

  generateOrderObject(customer_id) {
    let orders = this.props.cart_items.map((item) => {
      return ({
        product_id: item.id,
        product_qty: 1
      });// return
    });// orders

    let sales_order_data = {
      "customer_id": customer_id || null,
      "payment_method": 'cash',
      "orders": orders
    };// sales_order_data

    return sales_order_data;
  }// generateOrderObject

  calculateCartItemsTotal() {
    const { cart_items } = this.props;
    let cart_total = 0;
    cart_items.map((item) => {
      cart_total += item.list_price;
    });// cart_items.map

    return numeral(cart_total).format('0.00');
  }// calculateCartItemsTotal

  renderLoadingView() {
    const { theme } = this.context;
    const themeColor = COLOR[`${theme}500`].color;
    const { cart_items } = this.props;

    return (
      <View>
        <View style={styles.loadingView}>
          <Text style={styles.header}>
            Processing your purchase...
          </Text>
        </View>
        <View style={styles.statusIcon}>
          <ProgressBarAndroid styleAttr="Large" color={themeColor} />
        </View>
      </View>
    );// return
  }// renderLoadingView

  renderCheckoutSuccessView() {
    const { theme } = this.context;
    const themeColor = COLOR[`${theme}500`].color;
    const { cart_items } = this.props;

    return (
      <View>
        <View style={styles.loadingView}>
          <Text style={styles.header}>
            Check your text messages for an invoice.
          </Text>
        </View>
        <View style={styles.statusIcon}>
          <Icon
            name="thumb-up"
            color={theme}
            size={64}
          />
        </View>
      </View>
    );// return
  }// renderCheckoutSuccessView

  renderCheckoutErrorView() {
    const { theme } = this.context;
    const themeColor = COLOR[`${theme}500`].color;
    const { cart_items } = this.props;

    return (
      <View>
        <View style={styles.statusIcon}>
          <Icon
            name="error"
            color="paperRed300"
            size={64}
          />
        </View>
        <View style={styles.loadingView}>
          <Text style={styles.header}>
            Oops! Unable to process your checkout
          </Text>
        </View>
      </View>
    );// return
  }// renderCheckoutErrorView

  render() {
    const { theme, navigator } = this.context;
    const { cart_items } = this.props;
    const { checkout_done, checkout_error } = this.state;
    const themeColor = COLOR[`${theme}500`].color;

    var bgColor = `#904caf50`;
    // console.log(bgColor);

    let statusView = null;
    if(!checkout_done && !checkout_error)  {
      statusView = this.renderLoadingView();
    } else if(checkout_done && !checkout_error){
      statusView = this.renderCheckoutSuccessView();
    } else {
      statusView = this.renderCheckoutErrorView();
    }// if-else

    return (
      <View style={styles.container}>
        {
          statusView
        }
          <Button
            text="BACK TO PRODUCTS LIST"
            disabled={(checkout_done || checkout_error) ? false : true}
            raised={true}
            primary={checkout_error? "paperRed300" : theme}
            theme='dark'
            onPress={ () => {
              navigator.to('product_list', null, null);
            }}
          />
      </View>
    );// return
  }// render
}// CheckoutView

const styles = {
  container: {
    flex: 1,
    flexDirection: 'column',
    // flexWrap: 'wrap',
    // alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.googleGrey100.color
  },
  loadingView: {
    // flex: 1,
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.googleGrey100.color
  },
  statusIcon: {
    // flex: 1,
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.googleGrey100.color
  },
  header: [
    {
      textAlign: 'center',
      padding: 10
    },
    TYPO.paperFontDisplay1,
    COLOR.googleGrey700
  ],
  subheader: [
    {
      textAlign: 'center',
    },
    TYPO.paperFontSubhead,
    COLOR.googleGrey700
  ]
};// styles
