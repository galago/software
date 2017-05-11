const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql');
const MySQLStore = require('express-mysql-session')(session);
const Promise = require('bluebird');

global.config = require('./config');

const openConnection = () => {
  console.log('openConnection!');
  global.connection = mysql.createConnection({
    host: config.sqlHost,
    user: config.sqlUser,
    password: config.sqlPassword,
    database: config.sqlDatabase,
    dateStrings: true
  });
  global.promiseQuery = Promise.promisify(connection.query.bind(connection));

  connection.connect((err) => {
    if (err) {
      console.log('db connection error', err);
      return;
    }
    console.log('db connection success');
    connection.query('SET SESSION wait_timeout = ' + (3600 * 24 * 7), (err) => {
      if (err) {
        console.log('increese timeout error', err);
      }
      console.log('timeout increese');
    });
  });

  connection.on('error', (err) => {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      openConnection();
    }
  });
};

openConnection();

const mySQLStore = new MySQLStore({}, connection);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.disable('x-powered-by');
app.use(logger('dev'));
//app.disable('etag');
app.use(session({
  secret: 'cockieSessionSecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: false,
    maxAge: 14 * 24 * 360000, //14 days
    secure: false, //todo cors
    httpOnly: false //todo cors
  },
  store: mySQLStore
}));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Expose-Headers', 'Content-Length');
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type,' +
  ' X-Requested-With, X-HTTP-Method-Override, Range');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  return next();
});
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(cookieParser('cockieSessionSecret'));

app.use(express.static(path.join(__dirname, 'public')));

require('./routes/routes')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  console.log('development');
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
} else {
  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
}

app.listen(config.port, function() {
  console.log(`Express server listening on port ${config.port}`);
});

module.exports = app;
