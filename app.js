//APP.JS in ~/app.js
const express = require('express');
var mysql = require('mysql');
var connection  = require('./lib/db');
var otherConnection = require('./lib/db');
var nodemailer = require("nodemailer");
const router = express.Router();
var app = express();
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
var createError = require('http-errors');
var randtoken = require('rand-token');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser')
require("./config/passport")(passport)


//EJS
app.set('view engine','ejs');
//BodyParser
app.use(express.urlencoded({extended : false}));
//express session
app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true
   }));
   app.use(passport.initialize());
app.use(passport.session());
   //use flash
   app.use(flash());
app.use(expressValidator());
   app.use((req,res,next)=> {
     res.locals.success_msg = req.flash('success_msg');
     res.locals.error_msg = req.flash('error_msg');
     res.locals.error  = req.flash('error');
   next();
   })
//Routes


/*--------------------Routing Over----------------------------*/



app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));
app.use(express.static(path.join(__dirname, "/views/CSS")));
const { PORT=3000, LOCAL_ADDRESS='0.0.0.0' } = process.env
app.listen(PORT, LOCAL_ADDRESS, () => {
  
});




module.exports = app;
