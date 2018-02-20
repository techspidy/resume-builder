'use strict';

let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

let index = require('./routes/index');
let adminRouter = require('./routes/admin/admin-route');
//let authRouter = require('./routes/auth/auth-route');
let APIRouter = require('./routes/api/api');

let dbConfig = require('./config/config').db_config;
var debug = require('debug')('apollo-cv:app');

let SessionMidleware = require('./middleware/session');
const fileUpload = require('express-fileupload');
const useragent = require('express-useragent');
const letsencrypt = require('./middleware/letsencrypt');
let UsersCtrl = require('./controllers/users');

let app = express();
app.use(fileUpload());

app.set('x-powered-by', false);

app.use(useragent.express());
// handle session midleware
// app.use(SessionMidleware.useSession());

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
UsersCtrl.createAdminUser();

mongoose.connect('mongodb://localhost:27017/' + dbConfig.dbName);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'DB connection error:'));
db.once('open', function() {
	debug('DB CONNECTED');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'static-files')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRouter);
app.use('/api', APIRouter);
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


if (process.env.NODE_ENV === 'production') {
  // lets encrypt wrapper / automate ssl certificate renewal
  let httpsServerLE = require('./middleware/letsencrypt')(app);
  module.exports = httpsServerLE;
} else {
  module.exports = app;
}
