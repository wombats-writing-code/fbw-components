// MiddlewareService


let MiddlewareService = {
  shouldReturnStatic: () => {
    let hostLocation = window.location.host;

    // terrible hack that works because only Cole and Luwen are developing
    // luwen uses port 8080 to serve the frontend, Cole doesn't.
    return (hostLocation.indexOf('localhost:8080') >= 0 || hostLocation.indexOf('127.0.0.1:8080') >= 0);
  },
  host: () => {
    let location = window.location.host;

    if (location.indexOf('localhost') >= 0 || location.indexOf('127.0.0.1') >= 0) {
        return '/api/v1';
    } else {
        return '/fbw-author/api/v1';
    }
  },
  secureHost: () => {
    let location = window.location.host;

    if (location.indexOf('localhost') >= 0 || location.indexOf('127.0.0.1') >= 0) {
        return '/touchstone/api/v1';
    } else {
        return '/fbw-author/touchstone/api/v1';
    }
  },
  staticFiles: () => {
    let location = window.location.host;

    if (location.indexOf('localhost') >= 0 || location.indexOf('127.0.0.1') >= 0) {
        return '/static';
    } else {
        return '/fbw-author/static';
    }
  }
}

module.exports = MiddlewareService;
