var db     = require('./database.js')
var sha256 = require("sha256")

exports.authenticate_user = function(data){
   
   return new Promise(function( resolve, reject){
       
       db.get_user({ 'user' : data['user']}).then(function(result){
           
           if(sha256(data['password']) == result['password']){
               console.log("User Authenticated")
               resolve({ 'uuid' : result['uuid'] })
           } else {
               console.log("Rejecting Login ( "+data['user']+" ) Based on Password")
               reject({})
           }
       
       }).catch(function(result){
           console.log(result)
           console.log("Error Getting User")
           reject({})
       })
       
       
   })
    
}