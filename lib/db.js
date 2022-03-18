var mysql=require('mysql');
 var connection=mysql.createConnection({
   host:'hwr4wkxs079mtb19.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
   user:'attq37mjzr2le0b8',
   password:'whqw64rt4vzs6ww6',
   database:'up7dx4m9o5x6kq7b',
  multipleStatements: true
 });
 var otherConnection=mysql.createConnection({
  host:'hwr4wkxs079mtb19.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user:'attq37mjzr2le0b8',
  password:'whqw64rt4vzs6ww6',
  database:'up7dx4m9o5x6kq7b',
  multipleStatements: true
});
var pool  = mysql.createPool({
  connectionLimit : 10,
  host:'hwr4wkxs079mtb19.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user:'attq37mjzr2le0b8',
  password:'whqw64rt4vzs6ww6',
  database:'up7dx4m9o5x6kq7b',
});
 
connection.connect(function(error){
   if(!!error){
     console.log(error);
   }else{
     console.log('Connected!:)');
   }
 });  
 otherConnection.connect(function(error){
  if(!!error){
    console.log(error);
  }else{
    console.log('Connected!:)');
  }
});
   
    

module.exports = connection, otherConnection, pool; 