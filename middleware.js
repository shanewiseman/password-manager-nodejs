var exports = module.exports = {}

var auth = require('./auth')

exports.list_entryRequest = function( request ){
    //var userSecret = '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
    console.log(request.body)
    //TODO Screen INPUTS
    var rFields = { 'user' : request.body['username'], 'password' : request.body['password'] }
        return new Promise(function(resolve,reject){
        
            auth.authenticate_user( { 'user' : rFields['user'], 'password' : rFields['password'] } ).then(function(result){
                
                console.log("Entry Middleware")
                resolve({ 'userSecret' : rFields['password'], 'url' : rFields['url'], 'user' : result['uuid']})
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
    
    console.log(request.body)
    
    //TODO need to screen inputs!
    //TODO url should not have spaces!
    var rFields = { 'user' : request.body['username'], 'password' : request.body['password'], 'url' : request.body['url'], 'length' : request.body['length'], 
        'symbols' : request.body['symbols'], 'uppercase' : request.body['uppercase'], 'numbers' : request.body['numbers'] }
    
    
    
    
    
    return new Promise(function(resolve,reject){
        
        if(rFields['url'] == ""){
            console.log("No URL Present")
            reject({})
            return
        }
        
        auth.authenticate_user( { 'user' : rFields['user'], 'password' : rFields['password'] } ).then(function(result){
            console.log("Entry Middleware")
            resolve(
                { 'userSecret' : rFields['password'], 'url' : rFields['url'], 'user' : result['uuid'],
                    'password_spec' : { 'length' : rFields['length'], 'symbols' : rFields['symbols'], 
                        'uppercase' : rFields['uppercase'], 'numbers' : rFields['numbers']}
                }
            )
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
exports.get_entryRequest = function( request ){
    //var userSecret = '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
    console.log(request.body)
    //TODO Screen Inputs
    var rFields = { 'user' : request.body['username'], 'password' : request.body['password'], 'url' : request.body['url'] }
        return new Promise(function(resolve,reject){
        
            auth.authenticate_user( { 'user' : rFields['user'], 'password' : rFields['password'] } ).then(function(result){
                console.log("Entry Middleware")
                resolve({ 'userSecret' : rFields['password'], 'url' : rFields['url'], 'user' : result['uuid']})
            }).catch(function(result){
                console.log("Error With Authentication")
                reject({})
            })
        })
    //return {'userSecret' : userSecret, 'url' : 'boa.com', 'user' : '531c30f6-f92d-11e6-bc64-92361f002671' }
    
}
exports.get_entryResponse = function( data ){

    return new Promise(function(resolve,reject){
        console.log("Exit Middleware")
        resolve({ 'password' : data['password'] } )
    })
}
