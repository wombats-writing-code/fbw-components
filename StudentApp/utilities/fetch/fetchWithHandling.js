'use strict';


module.exports = function(url, fetchInit) {
  fetch(url, fetchInit)
  .then(function (response) {
      if (response.ok) {
          response.json().then( (responseData) => successCallback(responseData));

      } else {
          response.text().then(function (responseText) {
              console.log('Not a 200 response: ' + url);
              console.log('Error returned: ' + responseText);
            try {
              errorCallback();
            } catch (e) {

            }
          });
      }
  })
  .catch(function (error) {
      console.log('Error fetching: ' + url);
      console.log('Error with fetch! ' + error.message);
  });

}
