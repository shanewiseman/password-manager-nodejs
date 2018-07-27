var crypto = require('./crypto.js')
var db     = require('./database.js')
var middleware = require('./middleware.js')
var Promise = require('promise');

var masterSecret = '20D8A361ACEE4BF0570C540E6202BA34FE870D30E2BAB802B59F14425F1BA93779FDC6245C7DBEC1CA458D77F4FB802F293B4536E775227560A6EC75EE3AD442'

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
        "masterSecret" : masterSecret,
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
                "masterSecret" : masterSecret,
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
    
    return new Promise( function(resolve,reject){
        var userSecret  = data['userSecret']
        var user        = data['user']
        
        var entries = {};
        var dbPromises = [];
        for( i in data["urls"]){

            var db_data = {
                "url" : data["urls"][i],
                "user": user,
            }
            
            promise = db.get_record( db_data ).then(function(data){
                var crypto_data = {
                    "userSecret" : userSecret,
                    "masterSecret" : masterSecret,
                    "encrypted" : data['data'],
                    "entry_seed" : data['user'] + ":" + data["url"]
                }
                
                console.log("Record Retrieved")
                resolve({ 'url' : data["url"], 'password' : crypto.decrypt(crypto_data) } )
                
            }).catch(function(data){
                reject("ERROR ON GET")
            })

            dbPromises.push(promise);

        }

        Promise.all(dbPromises).then(function(values){
            resolve( values )
        })
    })
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
