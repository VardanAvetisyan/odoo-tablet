export default {
  menu: {
    initialRoute: true,

    title: 'Menu',
    component: require('./scenes/Menu').default,

    children: {
       payments: {
        title:'Payments',
        component: require('./scenes/Payments').default,
        children: {
                       balance: {
                              title: 'Balance',
                              component: require('./scenes/Balance').default,
                       }
            }
      },
       cart: {
              title:'Cart',
              component: require('./scenes/Cart').default,
              children: {
               barcode_scanner_view: {
                      title: 'SCAN ITEM BARCODE',
                      component: require('./scenes/BarcodeScannerView').default,
                    },
                checkout_view: {
                        title: 'CHECKOUT',
                        component: require('./scenes/Checkout').default,
                      },
                search_view: {
                        title: 'Search',
                        component: require('./scenes/Search').default,
                      }
              }
            },
      login_view: {
        title: 'SIGN IN',
        component: require('./scenes/Auth0LoginView').default,
      },
      product_list_view: {
        title: 'Products List',
        component: require('./scenes/ProductListView').default,
        children: {
        checkout_view: {
                title: 'CHECKOUT',
                component: require('./scenes/CheckoutView').default,
          }
        }
      },
      login: {
              title: 'Login',
              component: require('./scenes/LoginV').default,
                 children: {
                      payments: {
                              title: 'Payments',
                              component: require('./scenes/Payments').default,
                        }
                      }
      },
    }
  }
};// default


  return <View style={styles.line2} key={key}>
            <Text style={styles.line}>
                 <Text numberOfLines={1} >{item.name}</Text>
                 <Text numberOfLines={1} >
                   ${ numeral(item.list_price).format('0.00') }
                 </Text>
             </Text>
         </View>