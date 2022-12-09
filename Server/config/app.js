// Installed 3rd party packages
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let session = require('express-session');
let passport = require('passport');
let passportLocal  = require('passport-local');
let localStrategy = passportLocal.Strategy;
let GitHubStrategy = require('passport-github').Strategy;
let SlackStrategy = require('passport-slack').Strategy;
let InstagramStrategy = require('passport-instagram').Strategy;
let flash = require('connect-flash');
let app = express();

// create a user model instance
let userModel = require('../models/user');
let User = userModel.User;


//config mongoDB
let mongoose = require('mongoose');
let DB = require('./db');

// point mogoose to DB URI
mongoose.connect(DB.URI);
let mongoDB = mongoose.connection;
mongoDB.on('error',console.error.bind(console,'Connection Error:'));
mongoDB.once('open', () => {
  console.log('Connected to the MongoDB.');
});

passport.use(new GitHubStrategy({
  clientID: "2859e3c547951480494c",
  clientSecret: "754aba86f007fcd6b39b0a86583da08e09d3711e",
  callbackURL: "http://localhost:3000/auth/github/callback"
},
function(accessToken, refreshToken, profile, cb) {
  // User.findOrCreate({ githubId: profile.id }, function (err, user) {
  //   return cb(err, user);
  console.log(profile);
  cb(null, profile);
  }
)
);

//auth
app.get('/auth/github',
passport.authenticate('github'));

app.get('/auth/github/callback', 
passport.authenticate('github', { failureRedirect: '/login' }),
function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('/');
});


// set-up Express Session
app.use(session({
  secret:"SomeSecret",
  saveUninitialized:false,
  resave:false
}))

// setup the strategy using defaults 
passport.use(new SlackStrategy({
  clientID: "4513648470992.4513663246304",
  clientSecret: "1a4aa5248d43560e4a4b41fd33af48e8"
}, (accessToken, refreshToken, profile, done) => {
  // optionally persist profile data
  done(null, profile);
}
));

app.use(passport.initialize());
app.use(require('body-parser').urlencoded({ extended: true }));

// path to start the OAuth flow
app.get('/auth/slack', passport.authorize('slack'));

// OAuth callback url
app.get('/auth/slack/callback', 
passport.authorize('slack', { failureRedirect: '/login' }),
(req, res) => res.redirect('/')
);

passport.use(new InstagramStrategy({
  clientID: "686348806231702",
  clientSecret: "374ab4cdd969c4774f17d0721e095e49",
  callbackURL: "http://localhost:3000/auth/instagram/callback"
},
function(accessToken, refreshToken, profile, done) {
 // User.findOrCreate({ instagramId: profile.id }, function (err, user) {
  //  return done(err, user);
  console.log(profile);
  cb(null, profile);

}
));

//Auth
app.get('/auth/instagram',
  passport.authenticate('instagram'));

app.get('/auth/instagram/callback', 
  passport.authenticate('instagram', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


// implement a User Authentication
passport.use(User.createStrategy());

// serialize and deserialize the user information
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// initialize passport
app.use(passport.initialize());
app.use(passport.session());


// initialize flash
app.use(flash());


let indexRouter = require('../routes/index');
let usersRouter = require('../routes/users');
let taskRouter = require('../routes/task');

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

app.use('/', indexRouter); //localhost:3000
app.use('/users', usersRouter);
app.use('/task-list', taskRouter); // localhost:3000/task-list

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error',
  {
    title:"Error"
  }
  );
});

module.exports = app;
