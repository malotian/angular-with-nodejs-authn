const express = require('express');
const session = require('express-session');
const app = new express();
const passport = require('passport');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function(username, password, done) {
        if(username === "admin" && password === "admin"){
            return done(null, username);
        } else {
            return done("unauthorized access", false);
        }
    }
));

passport.serializeUser(function(user, done) {
    if(user) done(null, user);
});
  
passport.deserializeUser(function(id, done) {
    done(null, id);
});

app.use(session({ secret: 'anything', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());

const auth = () => {
    return (req, res, next) => {
        passport.authenticate('local', (error, user, info) => {
            if(error) res.status(400).json({"statusCode" : 200 ,"message" : error});
            req.login(user, function(error) {
                if (error) return next(error);
                next();
            });
        })(req, res, next);
    }
}

app.post('/authenticate', auth() , (req, res) => {
    console.log('session ', req.session);
    res.status(200).json({"statusCode" : 200 ,"user" : req.user});
});

const isLoggedIn = (req, res, next) => {
    console.log('session ', req.session);
    if(req.isAuthenticated()){
        console.log('user ', req.session.passport.user)
        return next()
    }
    return res.status(400).json({"statusCode" : 400, "message" : "not authenticated"})
}

app.get('/getData', isLoggedIn, (req, res) => {
    res.json("data is")
})


app.listen(3000, () => {
    console.log('App running at 3000')
})