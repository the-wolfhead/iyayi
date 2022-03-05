module.exports = {
    ensureAuthenticated : function(req,res,next) {
    if(req.isAuthenticated()) {
        res.redirect('/dashboard');
    return next();
    }
    else{
    req.flash('error_msg' , 'please login to view this resource');
    res.redirect('/users/dashboard');
    }
    }
    }