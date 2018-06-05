"use strict";

var stripe_url = 'https://api.stripe.com/v1/'
var secret_key = 'sk_test_ueAm4CG3bZjm1ZZ9PnedpZKG'

export async function createCardToken(cardNumber, expMonth, expYear, cvc) {
  var cardDetails = {
    "card[number]": cardNumber,
    "card[exp_month]": expMonth,
    "card[exp_year]": expYear,
    "card[cvc]": cvc
  };

  var formBody = [];
  for (var property in cardDetails) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(cardDetails[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");

  var data =  fetch(stripe_url + 'tokens', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + secret_key
    },
    body: formBody
  });

  return data;
};