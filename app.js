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

var smtpTransport = nodemailer.createTransport({
   service: "Gmail",
   auth: {
       user: "swift.trading.crypto@gmail.com",
       pass: "Milano12345"
   }
});
var rand,mailOptions,host,link;
/*------------------SMTP Over-----------------------------*/

/*------------------Routing Started ------------------------*/


app.get('/send',function(req,res){
       rand=Math.floor((Math.random() * 100) + 54);
  host=req.get('host');
  link="http://"+req.get('host')+"/verify?id="+rand;
  mailOptions={
     to : req.query.to,
     subject : "Please confirm your Email account",
     html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"	
  }
  console.log(mailOptions);
  smtpTransport.sendMail(mailOptions, function(error, response){
      if(error){
          console.log(error);
     res.end("error");
   }else{
          console.log("Message sent: " + response.message);
     res.end("sent");
       }
});
});

app.get('/verify',function(req,res){
console.log(req.protocol+":/"+req.get('host'));
if((req.protocol+"://"+req.get('host'))==("http://"+host))
{
  console.log("Domain is matched. Information is from Authentic email");
  if(req.query.id==rand)
  {
     console.log("email is verified");
     res.end("<h1>Email "+mailOptions.to+" is been Successfully verified");
  }
  else
  {
     console.log("email is not verified");
     res.end("<h1>Bad Request</h1>");
  }
}
else
{
  res.end("<h1>Request is from unknown source");
}
});

/*--------------------Routing Over----------------------------*/



app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));
app.use(express.static(path.join(__dirname, "/views/CSS")));
const { PORT=3000, LOCAL_ADDRESS='0.0.0.0' } = process.env
app.listen(PORT, LOCAL_ADDRESS, () => {
  
});




module.exports = app;
