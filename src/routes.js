export default {
  login: {
    initialRoute: true,

    title: 'Login',
    component: require('./scenes/LoginV').default,

    children: {
         menu: {
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

              }
         }
    }


  }
};// default
