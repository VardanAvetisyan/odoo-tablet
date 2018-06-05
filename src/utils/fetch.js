'use strict';

export const querystring = require('query-string');
export * from './api_endpoints';

function isError (response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.status = response.status;
    throw error;
  }// if-else*/
}// isError

function isAuthenticated(response) {
  if (response.status === 401)  {
     console.warn('401 Unauthenticated!');
    // FIXME: TODO: Authenticate here.
    // return response;
    return false;
  } else {
    return response;
  }// if
}// isAuthenticated
function parseJSON (response) {
          return response.json();
        }// parseJSON
export async function api (endpoint, options,callback,query=false) {
  // don't alter credentials option if already set
  // else set to 'include'
  // https://github.com/github/fetch#sending-cookies
  if (!options.credentials) {
    options.credentials = 'include';
  }// if

  try {
        var data = await fetch(endpoint, options)
        .then(isAuthenticated)
        .then(isError)
        .then(parseJSON)
        .then(function(response){
        if(query){
            callback(response)
        }else{

        return response
        }
    })
    if(!query){
        return data
    }
  } catch (e) {
    throw e;
  }// try-catch
}// api

// module.exports = api;
