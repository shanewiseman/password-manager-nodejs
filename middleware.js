var exports = module.exports = {}

var auth = require('./auth')

exports.list_entryRequest = function( request ){
    //var userSecret = '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
    //TODO Screen INPUTS
    var rFields = { 'user' : request.body['username'], 'password' : request.body['password'], 'token' : request.body['token'] }
        return new Promise(function(resolve,reject){
        
            console.log("Entry Middleware")
            auth.authenticate_user( { 'user' : rFields['user'], 'password' : rFields['password'] } ).then(function(userResult){
                auth.validate_token({ 'user' : userResult['uuid'], 'userSecret' : rFields['password'], 'token' : rFields['token']}).then(function(tokenResult){
                    resolve({ 'userSecret' : rFields['password'], 'user' : userResult['uuid']})
                }).catch(function(result){
                    console.log("Error With Token: " + result)
                        reject({})
                })
            }).catch(function(result){
                console.log("Error With Authentication")
                reject({})
            })
        })
    //return {'userSecret' : userSecret, 'url' : 'boa.com', 'user' : '531c30f6-f92d-11e6-bc64-92361f002671' }
    
}
exports.list_entryResponse = function( data ){
    
    return new Promise(function(resolve,reject){
        console.log("Exit Middleware")
        resolve({"urls" : data['urls'] })
    })
}

exports.create_entryRequest = function( request ){
    
    //TODO need to screen inputs!
    //TODO url should not have spaces!
    var rFields = { 'user' : request.body['username'], 'password' : request.body['password'], 
        'url' : request.body['url'], 'length' : request.body['length'], 'symbols' : request.body['symbols'], 
        'uppercase' : request.body['uppercase'], 'numbers' : request.body['numbers'], 'token' :  request.body['token']}
    
    return new Promise(function(resolve,reject){
        
        if(rFields['url'] == ""){
            console.log("No URL Present")
            reject({})
            return
        }
        
        console.log("Entry Middleware")
        auth.authenticate_user( { 'user' : rFields['user'], 'password' : rFields['password'] } ).then(function(userResult){
            auth.validate_token({ 'user' : userResult['uuid'], 'userSecret' : rFields['password'], 'token' : rFields['token']}).then(function(tokenResult){
                resolve(
                    { 'userSecret' : rFields['password'], 'url' : rFields['url'], 'user' : userResult['uuid'],
                        'password_spec' : { 'length' : rFields['length'], 'symbols' : rFields['symbols'], 
                        'uppercase' : rFields['uppercase'], 'numbers' : rFields['numbers']}
                    }
            )
                }).catch(function(result){
                    console.log("Error With Token")
                        reject({})
                })
        }).catch(function(result){
            console.log("Error With Authentication")
            reject({})
        })
        
    })
}
exports.create_entryResponse = function( data ){

    return new Promise(function(resolve,reject){
        console.log("Exit Middleware")
        resolve({"password" : data['password'] })
    })
}
//##############################################################################
exports.get_entries_Request = function( request ){
    //var userSecret = '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
    //TODO Screen Inputs
    var rFields = { 'user' : request.body['username'], 'password' : request.body['password'], 'urls' : request.body['urls'], 'token' : request.body['token']}
        return new Promise(function(resolve,reject){
        
            auth.authenticate_user( { 'user' : rFields['user'], 'password' : rFields['password'] } ).then(function(userResult){
                console.log("Entry Middleware")
                auth.validate_token({ 'user' : userResult['uuid'], 'userSecret' : rFields['password'], 'token' : rFields['token']}).then(function(tokenResult){
                    resolve({ 'userSecret' : rFields['password'], 'urls' : rFields['urls'], 'user' : userResult['uuid']})
                }).catch(function(result){
                    console.log("Error With Token: " + result)
                    reject({})
                })
            }).catch(function(result){
                console.log("Error With Authentication")
                reject({})
            })
        })
    //return {'userSecret' : userSecret, 'url' : 'boa.com', 'user' : '531c30f6-f92d-11e6-bc64-92361f002671' }
    
}
exports.get_entries_Response = function( data ){

    return new Promise(function(resolve,reject){
        console.log("Exit Middleware")
        resolve( data )
    })
}
//##############################################################################
exports.generate_token_Request = function( request ){

    var rFields = { 'user' : request.body['username'], 'password' : request.body['password'] }
        return new Promise(function(resolve,reject){
            console.log("Entry Middleware")
            auth.authenticate_user( { 'user' : rFields['user'], 'password' : rFields['password'] } ).then(
                    function(result){
                        resolve({ 'userSecret' : rFields['password'], 'user' : result['uuid']})
                    }).catch(function(result){
                        console.log("Error With Authentication")
                        reject({})
                    })
        })
}
exports.generate_token_Response = function( data ){

    return new Promise(function(resolve,reject){
        console.log("Exit Middleware")
        resolve( data )
    })
}
