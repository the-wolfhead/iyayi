//users.js in routes/users.js
const express = require('express');
var async = require('async'), connection;
const router = express.Router();
const helpers = require('../helpers');
const date = require('date-and-time');
var connection  = require('../lib/db');
var pool  = require('../lib/db');
var otherConnection = require('../lib/db');
var randtoken = require('rand-token');
var nodemailer = require("nodemailer");
const multer = require('multer');
var path = require('path');
//login handle
router.get('/login',(req,res)=>{
    res.render('login');
})
router.get('/dashboard/notif',(req,res)=>{
    res.render('dashboard/notif');
})
router.get('/dashboard/payment',(req,res)=>{
    var sql ="SELECT * FROM deposit WHERE deposit_id="+dep_id;
    connection.query(sql, function (err, result){
        if (err) {
            throw err;
        } else {
            Object.keys(result).forEach(function(key) {
                var row = result[key];
                coli=row;
                res.render('dashboard/payment', {obj, coli});
            console.log(row);
              });
            
            
        }
    });
})
router.get('/dashboard/mplans',(req,res)=>{
         res.render('dashboard/mplans',);    
        });

router.get('/dashboard/pl_record',(req,res)=>{
    res.render('dashboard/pl_record');
})
router.get('/dashboard/profile',(req,res)=>{
    var sql = "SELECT * FROM users WHERE id="+user_id;
        connection.query(sql, function (err, result) {
            if (err) {
                throw err;
            } else {
                obj = result;
                res.render('dashboard/profile', {obj});
                console.log(obj.first);
            }

            
        });
})
router.get('/dashboard/referuser',(req,res)=>{
    res.render('dashboard/referuser');
})
router.get('/dashboard/support',(req,res)=>{
    res.render('dashboard/support');
})
router.get('/dashboard/transact',(req,res, next)=>{
    var sql ="SELECT * FROM notif WHERE user_id="+user_id;
    connection.query(sql, function (err, result){
        if (err) {
            throw err;
        } else {
            coli = result;
                var sqo ="SELECT * FROM deposit WHERE user_id="+user_id;
                connection.query(sqo, function (err, resu){
                    if (err) {
                        throw err;
                    } else {
                        obj = resu;
                            res.render('dashboard/transact', {obj, coli});
                        
                        
                        
                    }
                });
            }
            
            

    });

   
    
})
    

router.get('/dashboard/withdraw_h',(req,res)=>{
    var sql ="SELECT * FROM users WHERE id="+user_id;
    connection.query(sql, function (err, result){
        if (err) {
            throw err;
        } else {
            Object.keys(result).forEach(function(key) {
                var row = result[key];
                coli=row;
                res.render('dashboard/withdraw_h', {obj, coli});
            console.log(row);
              });
            
            
        }
    });
    
})
router.get('/dashboard/withdraw',(req,res)=>{
    res.render('dashboard/withdraw');
})
router.get('/dashboard/deposit_h',(req,res)=>{
    res.render('dashboard/deposit_h');
})
router.get('/register',(req,res)=>{
    res.render('register')
    })
    router.get('/admin',(req,res)=>{
        var sql = "SELECT * FROM users";
        connection.query(sql, function (err, result) {
            if (err) {
                throw err;
            } else {
                obj = result;
                res.render('admin', {obj});
                console.log(obj.first);
            }

            
        });
        })
router.get('/deleteuser/(:id)', function(req, res, next){
            connection.query('DELETE FROM users WHERE id = ' + req.params.id, function(err, rows, fields) {
                if (err) throw err;
                res.redirect('/users/admin');
        })
    })
router.get('/edituser/(:id)', function(req, res, next){
            
                connection.query('SELECT * FROM users WHERE id = ' + req.params.id, function(err, rows, fields) {
                    if(err) throw err
                    
                    // if user not found
                    if (rows.length <= 0) {
                        
                        req.flash('error', 'User not found with id = ' + req.params.id)
                        res.redirect('/admin')
                    }
                    else { // if user found
                        // render to views/user/edit.ejs template file
                        res.render('edituser', {
                            title: 'Edit User', 
                            //data: rows[0],
                            id: rows[0].id,
                            first: rows[0].first,
                            last: rows[0].last,
                            phone: rows[0].phone,
                            deposit: rows[0].deposit,
                            email: rows[0].email,
                            balance: rows[0].balance,
                            charge_per: rows[0].charge_per,
                            charge_fix: rows[0].charge_fix,
                        })
                    }			
                })
            
        })

        // EDIT USER POST ACTION
router.post('/edituser/(:id)', function(req, res, next) {
    req.assert('first', 'First Name is required').notEmpty()           //Validate name
    req.assert('last', 'Last Name is required').notEmpty()           //Validate name
    req.assert('phone', 'Phone Number is required').notEmpty() 
    req.assert('balance', 'Balance is required').notEmpty()   //Validate password
    req.assert('email', 'A valid email is required').isEmail()  //Validate email
    req.assert('deposit', 'Deposit is required').notEmpty()  
    req.assert('charge_per', 'Charge Percentage is required').notEmpty()  
    req.assert('charge_fix', 'Fixed Charge is required').notEmpty()  
    req.assert('bonus', 'Bonus is required').notEmpty() 
    req.assert('profit', 'Profit is required').notEmpty() 
    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a <span>comment</span>'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		var user = {
			first: req.sanitize('first').escape().trim(),
last: req.sanitize('last').escape().trim(),
phone: req.sanitize('phone').escape().trim(),
email: req.sanitize('email').escape().trim(),
balance: req.sanitize('balance').escape().trim(),
profit: req.sanitize('profit').escape().trim(),
deposit: req.sanitize('deposit').escape().trim(),
bonus: req.sanitize('bonus').escape().trim(),
charge_per:req.sanitize('charge_per').escape().trim(),
charge_fix: req.sanitize('charge_fix').escape().trim(),
		}
		
		
			connection.query('UPDATE users SET ? WHERE id = ' + req.params.id, user, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					// render to views/user/add.ejs
					res.render('editauser', {
						title: 'Edit User',
						id: req.params.id,
						name: req.body.name,
						age: req.body.age,
						email: req.body.email
					})
				} else {
					req.flash('success', 'Data updated successfully!')
					
					// render to views/user/add.ejs
					res.redirect('/users/admin');
				}
			})
		
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('editbuser', { 
            title: 'Edit User',            
			id: req.params.id, 
			name: req.body.name,
			age: req.body.age,
			email: req.body.email
        })
    }
})
router.post('/dashboard/profile',(req,res)=>{
    req.assert('first', 'First Name is required').notEmpty()           //Validate name
req.assert('last', 'Last Name is required').notEmpty()           //Validate name
          //Validate name
req.assert('phone', 'Phone Number is required').notEmpty() 

var errors = req.validationErrors()
if( !errors ) {   //No errors were found.  Passed Validation!
var user = {
first: req.sanitize('first').escape().trim(),
last: req.sanitize('last').escape().trim(),

phone: req.sanitize('phone').escape().trim(),}

connection.query('UPDATE users SET ? WHERE id='+user_id, user, function(err, result)  {
    if (err) {
        req.flash('error', err)
        
        // render to views/user/add.ejs
        res.render('dashboard/profile', {
            title: 'Edit User',
            id: req.params.id,
            name: req.body.name,
            age: req.body.age,
            email: req.body.email
        })
    } else {
        req.flash('success', 'Data updated successfully!')
        
        // render to views/user/add.ejs
        res.redirect('/users/dashboard/profile');
    }
})
}
})
router.get('/dashboard',(req,res)=>{
        var sql = "SELECT * FROM users WHERE id="+user_id;
        connection.query(sql, function (err, result) {
            if (err) {
                throw err;
            } else {
                obj = result;
                res.render('dashboard', {obj});
                console.log(obj.first);
            }

            
        });
        })
//Register handle
router.post('/login',(req,res)=>{
    var email = req.body.email;
var password = req.body.password;
if ((email == 'admin@SwiftXchange.com')&&(password =='admin01')){
    res.redirect('/users/admin');
}
else{
    connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], function(err, rows, fields) {

        if(err) throw err
        // if user not found
        if (rows.length <= 0) {
        req.flash('error', 'Please enter correct email and Password!')
        res.redirect('/users/login')
        }
        else { // if user found
        // render to views/user/edit.ejs template file
        req.session.loggedin = true;
        req.session.uniqueSID = req.session.id;
        req.session.email = email;
        Object.keys(rows).forEach(function(key) {
            var row = rows[key];
            user_id=row.id;
            console.log(row.id)
          });
            res.redirect('/dashboard')
        
        }            
        })
}
  })
  //register post handle
router.post('/register',(req,res)=>{
    req.assert('first', 'First Name is required').notEmpty()           //Validate name
req.assert('last', 'Last Name is required').notEmpty()           //Validate name
req.assert('country', 'Country is required').notEmpty()           //Validate name
req.assert('phone', 'Phone Number is required').notEmpty() 
req.assert('password', 'Password is required').notEmpty()   //Validate password
req.assert('email', 'A valid email is required').isEmail()  //Validate email
var errors = req.validationErrors()
if( !errors ) {   //No errors were found.  Passed Validation!
var user = {
first: req.sanitize('first').escape().trim(),
last: req.sanitize('last').escape().trim(),
country: req.sanitize('country').escape().trim(),
phone: req.sanitize('phone').escape().trim(),
email: req.sanitize('email').escape().trim(),
password: req.sanitize('password').escape().trim(),
balance: 10,
bonus: 10,
charge_per: 10,
charge_fix: 2,
}
var email = req.body.email;
connection.query('INSERT INTO users SET ?', user, function(err, result)  {
//if(err) throw err
if (err) {
req.flash('error', err)
// render to views/user/add.ejs
res.render('auth/register', {
title: 'Registration Page',
first: '',
last: '',
country: '',
phone: 00,
password: '',
email: ''                   
})
} else {                
req.flash('success', 'You have successfully signed up!');
user_id=result.insertId;
res.redirect('/users/send' );
}
})
}
else {   //Display errors to user
var error_msg = ''
errors.forEach(function(error) {
error_msg += error.msg + '<br>'
})                
req.flash('error', error_msg)        
/**
* Using req.body.name 
* because req.param('name') is deprecated
*/
res.render('/users/register', { 
title: 'Registration Page',
first: req.body.first,
last: req.body.last,
country: req.body.country,
phone: req.body.phone,
email: req.body.email,
password: ''
})
}
    })
//logout
router.get('/logout',(req,res)=>{
    res.redirect('/welcome')
 })
 router.post('/logout',(req,res)=>{
    res.redirect('/')
 })
 router.post('/dashboard/withdraw_h',(req,res)=>{
      //No errors were found.  Passed Validation!
        var amount= req.body.amount;
        var prev= coli.balance;
        var charge= coli.charge_per;
        var charg= coli.charge_fix;
        console.log(charge);
        var perc = charge/100;
        var perco= amount*perc;
        var deduct = perco+ charg;
        var deduc=deduct+amount;
        var balance = prev- deduc;
        const now  =  new Date();
        const value = date.format(now,'YYYY/MM/DD');
        console.log(balance);
        if (balance <= 0) throw err;
        var note = {
        payment_mode: req.sanitize('payment_mode').escape().trim(),
        amount: req.sanitize('amount').escape().trim(),
        method_id: req.sanitize('method_id').escape().trim(),
        payment_status: "Withdrawal Pending",
        user_id: user_id,
        date: value
        }
        connection.query('INSERT INTO notif SET ?', note, function(err, result)  {
            res.redirect('/users/dashboard/transact');
        })
        connection.query('UPDATE users SET balance='+balance + ' WHERE id ='+user_id, balance, function(err, result) {
            if (err) throw err;});
    } 
 )
 router.post('/dashboard/deposit_h', (req, res)=> {
      var deposit= req.body.amount;
      var note ={
        deposit: req.sanitize('amount').escape().trim(),
        user_id: user_id
      }
      connection.query('INSERT INTO deposit SET ?', note, function(err, result)  {
        dep_id=result.insertId;
        console.log(dep_id);
        res.redirect('/users/dashboard/payment');
    })

 } )
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
 
 
 router.get('/send',function(req,res){
    var sql ="SELECT * FROM users WHERE id="+user_id;
    connection.query(sql, function (err, result){
        if (err) {
            throw err;
        } else {
            Object.keys(result).forEach(function(key) {
                var row = result[key];
                email=row.email;
                id=row.id;
                rand=Math.floor((Math.random() * 100) + 54);
                host=req.get('host');
                link="http://"+req.get('host')+"/users/verify?id="+rand;
                mailOptions={
                   to : email,
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
                   res.render("sent");
                     }
              });
              });
            
            
        }
    });
       
 });
 
 router.get('/verify',function(req,res){
 console.log(req.protocol+":/"+req.get('host'));
 if((req.protocol+"://"+req.get('host'))==("http://"+host))
 {
   console.log("Domain is matched. Information is from Authentic email");
   if(req.query.id==rand)
   {
      console.log("email is verified");
      res.redirect('dashboard');
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

 router.get('/verifier',function(req,res){
    console.log(req.protocol+":/"+req.get('host'));
    if((req.protocol+"://"+req.get('host'))==("http://"+host))
    {
      console.log("Domain is matched. Information is from Authentic email");
      if(req.query.id==dep_id && req.body.user==user_id)
      {
          var sql="UPDATE deposit SET * WHERE user_id="+user_id+"AND dep_id="+dep_id;
           var nat ={
               deposit_stat: "Deposit Verified"
           }
           connection.query(sql, nat,)
          res.render('verified');
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
 router.post('/dashboard/join', (req,res) =>{
     res.redirect('/users/dashboard/deposit_h')
 })
 const storage = multer.diskStorage({
    destination: (req, file, cb)=> {
        cb(null, 'public');
    },

    // By default, multer removes file extensions so let's add them back
    filename:(req, file, cb) =>{
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({storage: storage});
 router.post('/dashboard/payment', upload.single('proof'), (req,res)=>{
    var image= req.file.filename; 
    console.log(image);
    const now  =  new Date();
    const value = date.format(now,'YYYY/MM/DD');
    


   
    var note = {
        deposit_method: req.sanitize('deposit_method').escape().trim(),
        deposit_stat: "Pending Verification",
        
        dater: value
        }
        connection.query('UPDATE deposit SET ? WHERE deposit_id='+dep_id+'AND user_id='+user_id, note, function(err, result)  {
        var sql ="SELECT * FROM deposit WHERE user_id="+user_id+" AND deposit_id="+dep_id;
        connection.query(sql, function (err, result){
        if (err) {
            throw err;
        } else {
            Object.keys(result).forEach(function(key) {
                var row = result[key];
                dep_id=row.deposit_id;
                user_id=row.user_id;
                host=req.get('host');
                link="http://"+req.get('host')+"/users/verifier?id="+dep_id+", user="+user_id;
                linka="http://"+req.get('host')+"/"+image;
                mailOptions={
                   to : 'danieldamianotabor@gmail.com',
                   subject : "Please confirm Payment",
                   html : "Hello,<br> Please Click on the link to verify payment.<br><img src= "+linka+"><a href="+link+">Click here to verify</a>"	
                }
                console.log(mailOptions);
                smtpTransport.sendMail(mailOptions, function(error, response){
                    if(error){
                        console.log(error);
                   res.end("error");
                    }else{
                        console.log("Message sent: " + response.message);
                   res.render("sent");
                     }
              });
              });
            
            
        }
    });
            res.redirect('/users/dashboard/transact');
 })

 });
module.exports  = router;


