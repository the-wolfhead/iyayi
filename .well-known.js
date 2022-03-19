const express = require('express');
const router = express.Router();
var path = require('path');
router.get('/pki-validation/DF03C354AD0A79E9DB49C2F104A56527.txt',(req,res, next)=>{
    var options = {
        root: path.join(__dirname)
    };
     
    var fileName = 'pki-validation/DF03C354AD0A79E9DB49C2F104A56527.txt';
    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', fileName);
        }
    });
    
})
module.exports = router;