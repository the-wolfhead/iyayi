//users.js in routes/users.js
const express = require('express');
const router = express.Router();
const date = require('date-and-time');
var connection  = require('../lib/db');
var otherConnection = require('../lib/db');

//login handle
router.get('/login',(req,res)=>{
    res.render('login');
})
router.get('/dashboard/notif',(req,res)=>{
    res.render('dashboard/notif');
})
router.get('/dashboard/payment',(req,res)=>{
    res.render('dashboard/payment');
})
router.get('/dashboard/mplans',(req,res)=>{
    var sql = "SELECT * FROM users WHERE";
        con.query(sql, function (err, result) {
            if (err) {
                throw err;
            } else {
                obj = {print: result};
                res.render('dashboard/mplans', {obj: obj});
                
            }
        });
})
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
router.get('/dashboard/transact',(req,res)=>{
    var sql ="SELECT * FROM notif WHERE user_id="+user_id;
    connection.query(sql, function (err, result){
        if (err) {
            throw err;
        } else {
            obj = result;
            res.render('dashboard/transact', {obj});
            console.log(obj.first);
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
res.redirect('/send');
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
    res.redirect('/ q`1q')
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
        var deduct = perco+ charg + amount;
        var balance = prev- deduct;
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
      res.redirect('/users/dashboard/payment')

 } )
module.exports  = router;


