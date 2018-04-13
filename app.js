'use strict';

const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const express = require('express');
const {logger, errorLogger} = require('express-winston');
const helmet = require('helmet');
const path = require('path');
const sassMiddleware = require('node-sass-middleware');

const apiRouter = require('./routes/api');

module.exports = (config, loggerInstance) => {
  const app = express();

  app.use(helmet());

  // Initialise logging
  app.use(logger({
    winstonInstance: loggerInstance
  }));

  // View engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'hbs');

  app.use(express.json());
  app.use(express.urlencoded({extended: false}));
  app.use(cookieParser());
  app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
  }));
  app.use(express.static(path.join(__dirname, 'public')));

  const router = express.Router({});

  app.use('/api', apiRouter(router, config, logger));

  // Initialise error logging
  app.use(errorLogger({
    winstonInstance: loggerInstance
  }));

  // Catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // Error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  return app;
};
