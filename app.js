require('./checkEnv');

const express = require('express');
const { join } = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { isCelebrateError } = require('celebrate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const nunjucks = require('nunjucks');
const compression = require('compression');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;

const { PORT, host, mongodb: { uri, options }, COOLIE_SECRET } = require('./config');

const { paths: { API, ASSETS } } = require('./constants');
const api = require('./api');
const { isAuthorized } = require('./api/v1/middlewares');
const { getUserByEmailWithPassword, compareUserPassword, getUserData } = require('./api/v1/user/user.service');

mongoose.connect(uri, options);
mongoose.set('debug', process.env.NODE_ENV !== 'prod');

passport.use(new Strategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async function(email, password, cb) {
    try {
      const user = await getUserByEmailWithPassword(email);
      compareUserPassword(password, user.password); // test with throw
      return cb(null, user);
    } catch (error) {
      cb(error);
    }
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user._id);
});

passport.deserializeUser(async function(userId, cb) {
  try {
    const user = await getUserData(userId);
    cb(null, user);
  } catch (error) {
    cb(error);
  }
});

const server = express();

server.use(express.json());
server.use(cookieParser());
server.use(compression());

server.use(session({
  secret: COOLIE_SECRET,
  resave: false,
  name: 'token',
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true,
    signed: true,
    maxAge: 10000,
  },// secure: false - no https!
  store: MongoStore.create({
    client: mongoose.connection.getClient(),
    dbName: 'sessions',
    collectionName: 'phoneBook_sessions',
    stringify: false,
  }),
}));

server.use(passport.initialize());
server.use(passport.session());

nunjucks.configure(join(__dirname, 'client', 'views'), {
  autoescape: false,
  express: server,
  watch: false
});

server.get('/', isAuthorized, (req, res) => {
  res.render('user/user.njk', {
    user: req.user,
    lastEnter: new Date(req.session.prevEnterDate).toISOString(),
  }); // res.render ? nunjucks.render
});

server.get('/login', (req, res) => {
  res.render('auth/login.njk');
});

server.use(`/${API}`, api);
server.use(`/${ASSETS}`, express.static(join(__dirname, 'client', 'assets')));

// errors
server.use((err, req, res, next) => {
  let mongoCode;

  if (isCelebrateError(err)) {
    const [field, error] = err.details.entries().next().value;
    return res.status(406).json({ message: error.message, field });
  }

  if (err.code > 550) {
    mongoCode = err.code;
    err.code = 500;
  }

  if (err.code === 401) {
    return res.redirect('/login');
  }

  res
    .status(err.code || 400)
    .json({ message: err.message, ...(mongoCode ? { mongoCode } : {}) });
});

server.listen(PORT, () => { console.log(`\nServer has started on ${host}\nENV:${process.env.NODE_ENV}\n`) });
