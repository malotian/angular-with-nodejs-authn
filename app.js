var http = require('http');
var fs = require('fs');
var express = require("express");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var saml = require('passport-saml');
var jwt = require('jsonwebtoken');
var logger = require('morgan');
var path = require('path');
var url = require('url');
var queryString = require('query-string');

var createError = require('http-errors');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

//var proxy = require('http-proxy-middleware');
var config = require('./' + (process.env.CONFIG_FILE || 'config.json'));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

const samlStrategies = new Map();

config.tenants.forEach(tenant => {

    var samlStrategy = new saml.Strategy({
        callbackUrl: 'https://' + tenant.id + '.' + config.baseDomain + '/saml/login/callback',
        entryPoint: tenant.metadata.entryPoint,
        logoutUrl: tenant.metadata.logoutUrl,
        logoutCallbackUrl: '/saml/logout/callback',
        issuer: 'https://' + tenant.id + '.' + config.baseDomain,
        identifierFormat: null,
        emailAttribute: tenant.metadata.emailAttribute,
        decryptionPvk: fs.readFileSync(__dirname + '/cert/saml.signing.key.pem', 'utf8'),
        privateCert: fs.readFileSync(__dirname + '/cert/saml.signing.key.pem', 'utf8'),
        cert: fs.readFileSync(__dirname + '/cert/' + tenant.id + '/idp.cert.pem', 'utf8'),
        validateInResponseTo: false,
        disableRequestedAuthnContext: true
    }, function (profile, done) {
        return done(null, profile);
    });
    passport.use(tenant.id, samlStrategy);
    samlStrategies[tenant.id] = samlStrategy;
});


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: '9B7E52AB304C4B5EA82E6EBD1F454186', // some random string
    resave: true,
    saveUninitialized: true,
    cookie: {
        path: '/',
        domain: '.' + config.baseDomain,
    }
}));

app.use(passport.initialize());
app.use(passport.session());

function resolveTenant(req, res) {
    var domain = req.headers['x-fwd-host'];
    if (domain === undefined)
        domain = req.headers.host;

    subDomain = domain.split('.');
    console.log(domain);
    console.log(subDomain);
    tenant = subDomain[0].split("-").join(" ");
    return tenant;
}

app.get('/favicon.ico', (req, res) => res.status(204));


function ensureAuthenticated(req, res, next) {
    const preq = url.parse(req.url, true);

    if (req.isAuthenticated()) return next();

    if (preq.pathname.startsWith('/non-sso/')) return next();
    if (preq.pathname.startsWith('/saml/')) return next();
    if (preq.pathname.startsWith('/favicon.ico')) return next();

    console.log('ensureAuthenticated.isAuthenticated: ' + req.isAuthenticated());

    if (!req.isAuthenticated()) {
        return res.redirect('/saml/login?RelayState=' + Buffer.from(preq.query['RelayState']).toString('hex'));
    }

    return next();
}

app.use('/', ensureAuthenticated);

var filter = function (pathname, req) {
    return !pathname.match('^/saml');
};

// app.use('/', proxy(filter, {
//     target: config.proxy.router.default,
//     changeOrigin: true,
//     logLevel: 'debug',
//     router: config.proxy.router,
//     secure: false,
//     onProxyReq: function (proxyReq, req, res) {
//         if (req.user === undefined) return;
//         var attrs = Object.keys(req.user);
//         for (var i = 0, length = attrs.length; i < length; i++) {
//             var attrName = attrs[i];
//             proxyReq.setHeader('SAML_' + attrName.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '_'), req.user[attrName]);
//         }
//         const emailAttribute = config.saml.tenants[req.session.tenant].emailAttribute;
//         proxyReq.setHeader('SAML_USER', req.user[emailAttribute]);
//     }
// }));

var sso = function (req, res, next) {
    const tenant = resolveTenant(req);

    console.log(tenant);
    passport.authenticate(tenant, function (err, user, info) {
        if (err) { console.log(err); return next(err); }
        if (!user) { return res.redirect('/saml/login'); }
        req.logIn(user, function (err) {
            if (err) { return next(err); }

            console.log('logged-in: ' + JSON.stringify(req.user));
            // relay state contains the state - befor starting the idp/authn stuff
            // basically what user planned to visit along with state
            var relayState = Buffer.from(req.body['RelayState'], 'hex').toString('utf8');
            console.log('RelayState: ' + relayState);

            res.header('SAML_USER', req.user.email);
            // refirect to target - user originaly intended to visit
            res.redirect(relayState || '/');
        });
    })(req, res, next);
}

app.get('/saml/logout/callback', (req, res) => {
    return res.send('you are logged out, kindly close your browsers!!!');
});

app.post('/saml/logout/callback', (req, res) => {
    return res.send('you are logged out, kindly close your browsers!!!');
});

app.get('/saml/logout', (req, res) => {

    return samlStrategies.get(req.session.tenant).logout(req, (err, uri) => {
        req.logout();
        userProfile = null;
        return res.redirect(uri);
    });
});


app.get('/saml/login', sso);
app.post('/saml/login/callback', sso);

app.get('/saml/login/fail',
    function (req, res) {
        res.status(401).send('Login failed');
    }
);

app.get('/saml/me', (req, res) => {
    res.json(req.user);
});


app.get('/saml/metadata',
    function (req, res) {
        const tenant = resolveTenant(req);
        res.type('application/xml');
        res.status(200).send(samlStrategies[tenant].generateServiceProviderMetadata(fs.readFileSync(__dirname + '/cert/saml.signing.cert.pem', 'utf8')));
    }
);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.get('/app/logout', (req, res) => {
    if (req.user == null) {
        return res.redirect('/app/home');
    }

    return strategy.logout(req, (err, uri) => {
        req.logout();
        userProfile = null;
        return res.redirect(uri);
    });
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

