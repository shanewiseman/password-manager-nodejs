var crypto = require('./crypto.js')
var db     = require('./database.js')
var middleware = require('./middleware.js')
var Promise = require('promise');


exports.create_entry = function(data){
    
    var userSecret    = data['userSecret']
    var spec_length   = data['password_spec']['length']
    var spec_symbols  = data['password_spec']['symbols']
    var spec_case     = data['password_spec']['uppercase']
    var spec_numbers  = data['password_spec']['numbers']
    
    var url           = data['url']
    var user          = data['user']

    var crypto_data = {
        "length" : spec_length,
        "numbers": spec_numbers,
        "symbols": spec_symbols,
        "uppercase": spec_case,
        "userSecret" : userSecret,
        "masterSecret" : crypto.masterSecret,
        "entry_seed" : user + ":" + url
        
    }

    return new Promise(function (resolve,reject){
        console.log("Creating Password")
        var password = crypto.encrypt(crypto_data)

        var db_data = {
            "user": user,
            "url": url,
            "data": password['encrypted']
        }
        
        db.insert_record( db_data ).then(function(result){
            
            console.log("RECORD INSERTED")
            resolve({ 'password' : password['plaintext'] })
        }).catch(function(result){
            console.log(result)
            reject({})
        })
        
    });
}
exports.get_entry = function (data){
    
    return new Promise( function(resolve,reject){
        var userSecret  = data['userSecret']
        var url         = data['url']
        var user        = data['user']
        
        var db_data = {
            "url" : url,
            "user": user,
        }
        
        db.get_record( db_data ).then(function(data){
            var crypto_data = {
                "userSecret" : userSecret,
                "masterSecret" : crypto.masterSecret,
                "encrypted" : data['data'],
                "entry_seed" : user + ":" + url
            }
            
            console.log("Record Retrieved")
            resolve({ 'password' : crypto.decrypt(crypto_data) } )
            
        }).catch(function(data){
            reject("ERROR ON GET")
        })
    })
}
exports.get_all_entries = function (data){
    
    var userSecret  = data['userSecret']
    var user        = data['user']
    
    var dbPromises = [];
    for( i in data["urls"]){

        var db_data = {
            "url" : data["urls"][i],
            "user": user,
        }
        
        promise = db.get_record( db_data ).then(function(data){
            
            console.log("Record Retrieved")
            return ({ 'url' : data["url"], 'password' : \
                crypto.decrypt(userSecret, data['data'], data['user'] + ":" + data["url"]) } )
            
        }).catch(function(data){
            reject("ERROR Record Retrieval")
        })

        dbPromises.push(promise);

    }

    return Promise.all(dbPromises)
}
exports.list_entry = function(data){
   
   return new Promise( function(resolve,reject){
        var user        = data['user']
        
        var db_data = {
            "user": user,
        }
        
        db.list_urls( db_data ).then(function(data){

            console.log("Records Retrieved")
            resolve({ 'urls' : data['urls'] } )
            
        }).catch(function(data){
            reject("ERROR ON LIST")
        })
    })  
}
exports.generate_token = function(data){
    return new Promise( function(resolve,reject){

        var user        = data['user']
        var userSecret  = data['userSecret']
        var time        = new Date().getTime()
        var nounce      = sha256(time)
        var token       = crypto.generate_token(user, userSecret, nounce) 

        var db_data = {
            "user"   : user,
            "nounce" : nounce,
            "time"   : time,
        }

        db.insert_token(db_data).then(function(data){
            console.log("Inserted Token For " + user)
            resolve({ 'token' : data['token'].substr(0,9)})
        }).catch(function(data){
            reject("FAILURE TO INSERT TOKEN")
        })

}
        
