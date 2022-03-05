var mysql=require('mysql');
 var connection=mysql.createConnection({
   host:'hwr4wkxs079mtb19.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
   user:'c8ymkqvwipzrhir8',
   password:'q2wevn4v3nnvz9lb',
   database:'yytwzp1jjrb5ivur'
 });
 
connection.connect(function(error){
   if(!!error){
     console.log(error);
   }else{
     console.log('Connected!:)');
   }
 });  
module.exports = connection; 