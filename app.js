var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var config = require('./config');
var cors = require('cors');
var compression = require('compression');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var orderRouter = require('./routes/orderRouter');
var productRouter = require('./routes/productRouter')

const url = config.mongoUrl;
const connect = mongoose.connect(url, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true 
});

connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });

var app = express();

app.use(express.static(path.join(__dirname, "client", "build")));

app.use(cors());
app.use(compression());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/orders', orderRouter);
app.use('/products',productRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

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
  res.render('error');
});

module.exports = app;
