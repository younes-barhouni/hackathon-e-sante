var path = require('path');
var express = require('express');
var http = require('http');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');

var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var async = require('async');
var request = require('request');
var xml2js = require('xml2js');

var agenda = require('agenda')({ db: { address: 'localhost:27017/test' } });
var sugar = require('sugar');
var nodemailer = require('nodemailer');
var _ = require('lodash');

var recordSchema = new mongoose.Schema({
//  _id: Number,
    name:         String,
    time:         Date,
    temperature:  Number,
    humidity:     Number,
    sound:        Number,
    light:        Number,
    movement :    Number,
//    subscribers: [{
//        type: mongoose.Schema.Types.ObjectId, ref: 'User'
//    }]
});

var userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String
});

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

var User = mongoose.model('User', userSchema);
var Record = mongoose.model('Record', recordSchema);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
  User.findOne({ email: email }, function(err, user) {
    if (err) return done(err);
    if (!user) return done(null, false);
    user.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);
      if (isMatch) return done(null, user);
      return done(null, false);
    });
  });
}));

mongoose.connect('localhost');

var app = express();

app.set('port', process.env.PORT || 8080);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({ secret: 'good dreams' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
  if (req.user) {
    res.cookie('user', JSON.stringify(req.user));
  }
  next();
});

app.post('/api/login', passport.authenticate('local'), function(req, res) {
  res.cookie('user', JSON.stringify(req.user));
  res.send(req.user);
});

app.get('/api/logout', function(req, res) {
  req.logout();
  res.send(200);
});

app.post('/api/signup', function(req, res, next) {
  var user = new User({
    email: req.body.email,
    password: req.body.password
  });
  user.save(function(err) {
    if (err) return next(err);
    res.send(200);
  });
});

app.get('/api/records', function(req, res, next) {
    var query = Record.find();
//        query.limit(12);
    query.exec(function(err, records) {
        if (err) return next(err);
        res.send(records);
    });
});

app.get('/api/records/:id', function(req, res, next) {
    Record.findById(req.params.id, function(err, record) {
        if (err) return next(err);
        res.send(record);
    });
});

//app.post('/api/records', function(req, res, next) {
//    var record = new Record({
//        name:    		req.body.name,
//        time:   		new Date(),
//        temperature: 	req.body.temperature,
//        humidity: 		req.body.humidity,
//        sound: 			req.body.sound,
//        light: 			req.body.light,
//        movement : 		req.body.movement
//    });
//    record.save(function(err) {
//        if (err) return next(err);
//
//        Record.find(function(err, records) {
//            if (err) return next(err);
//            res.send(records);
//        });
//
//    });
//});

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io').listen(server, { log: true });


app.get('*', function(req, res) {
  res.redirect('/#' + req.originalUrl);
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.send(500, { message: err.message });
});

io.sockets.on('connection', function(socket) {

//    socket.on('RecordCreated', function() {
//        socket.broadcast.emit('onRecordCreated');
//    });

    // <!-- insertion function   -->
    app.post('/api/records', function(req, res, next) {
        var record = new Record({
            name:    		req.body.name,
            time:   		new Date(),
            temperature: 	req.body.temperature,
            humidity: 		req.body.humidity,
            sound: 			req.body.sound,
            light: 			req.body.light,
            movement : 		req.body.movement
        });
        record.save(function(err,records) {
            if (err) return next(err);
            socket.broadcast.emit('onRecordCreated'); //Alert dashboard controller de refresh data
            Record.find(function(err, records) {
                if (err) return next(err);
                res.send(records);
            });

        });
    });

    // <!-- other function coming soon -->


});

