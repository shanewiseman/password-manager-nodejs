var db     = require('./database.js')
var crypto = require('./crypto.js')
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
           console.log("Error Getting User")
           reject({})
       })
       
       
   })
    
}
exports.validate_token = function(data){
    return new Promise( function(resolve,reject){

        var user        = data['user']
        var userSecret  = data['userSecret']
        var userToken   = data['token']

        var db_data = {
            "user" : user
        }


        db.get_token(db_data).then(function(data){

            t_nounce = data['nounce']
            t_time   = data['time']
            ctime = new Date().getTime()

            console.log((ctime - t_time) / 1000)
            if( ctime - t_time < 0 || ctime - t_time > (300 * 1000) ){
                reject("Expired Token Attempted")
            }
            
            computedToken = crypto.create_token(user, userSecret, t_nounce)

            if( computedToken == userToken ){
                console.log("Validated Token")
                resolve({})
            }else{
                reject("Token Mismatch")
            }
        }).catch(function(data){
            reject("Failure To Retrieve Token")
        })

    })

}
exports.generate_token = function(user,c_secret, nounce){
    return sha256( crypto.masterSecret + sha256( user + userSecret + t_nounce ) ).substr(0,9)
}
