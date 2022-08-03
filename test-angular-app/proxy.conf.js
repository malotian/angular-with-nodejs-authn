module.exports = {
  "/authn-handler/*": {
    "target": "http://localhost:8080",
    "secure": false,
    "logLevel": "debug",
    "changeOrigin": true,
    "pathRewrite": {
      "^/authn-handler": ""
    },
    "onProxyReq": function (proxyReq, req, res) {
      //console.log(req.hostname)
      proxyReq.setHeader("x-fwd-host", req.hostname);
    },
  },
  "/saml/*": {
    "target": "http://localhost:8080",
    "secure": false,
    "logLevel": "debug",
    "changeOrigin": true,
    "pathRewrite": {
      "^/saml": "/saml"
    },
    "onProxyReq": function (proxyReq, req, res) {
      //console.log(req.hostname)
      proxyReq.setHeader("x-fwd-host", req.hostname);
    },
  }
}