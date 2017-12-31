var express = require('express'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    http = require('http'),
    Strategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    morgan = require('morgan'),
    jwt = require('jwt-simple');

var app = express(),
    server = http.createServer(app),
    opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'secret',
    };

passport.use(new Strategy(opts, function(payload, done){
    console.log('Payload:', payload);
    return done(null, 'foo user');
}));

app.use(morgan('[:method] -> ":url" -- Headers(Authorization: :req[Authorization])'));
app.use(passport.initialize());
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('it works');
});

app.get('/login', function(req, res){
    res.json({
        token: jwt.encode('foo user', opts.secretOrKey),
    });
});

app.get('/protected', passport.authenticate('jwt', {session: false}), function(req,res){
    console.log('/protected');
    res.send(req.user);
});

app.listen(3000, function() {
    console.log('Running');
});

module.export = app
