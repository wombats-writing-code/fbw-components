


let MiddlewareService = {
  host: () => {
    let location = window.location.href;

    // terrible hack that works because only Cole and Luwen are developing
    // luwen uses port 8080 to serve the frontend, Cole doesn't.
    if (location.indexOf('localhost:8080') >= 0 || location.indexOf('127.0.0.1') >= 0) {

    } else if (location.indexOf('localhost') >= 0 || location.indexOf('127.0.0.1') >= 0) {
        return '/api/v1';
    } else {
        return '/fbw-author/api/v1';
    }
  }
}

module.exports = MiddlewareService;
