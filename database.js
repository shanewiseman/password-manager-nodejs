const cassandra = require('cassandra-driver');
const uuidV1 = require('uuid/v1');
var sha256 = require("sha256")


var client = new cassandra.Client({contactPoints: ['cassandra'], keyspace: 'password_manager'})


var exports = module.exports = {}

exports.insert_record = function(data){
    
    return new Promise(function(resolve,reject){
        
        //TODO insert via uuid instead of integer key
        var query = "INSERT into password_manager.password_entry (entry_key, uuid, user_uuid, data, url )" +
            "VALUES (?,?,?,?,?);";
        
        var entry_key = sha256( data['user'] + ":" + data['url'])
        
        var values = [entry_key, uuidV1(), data['user'], data['data'], data['url'] ]
        client.execute(query, values, function(err, result) {
    
            if(err){
                console.log(err);
                reject(err)
                return
            }
            console.log("Created Password Entry")
            resolve({})
        });

    })
}

exports.get_record = function(data){
    
    return new Promise(function(resolve,reject){
        var query = 'SELECT data,entry_key FROM password_manager.password_entry WHERE user_uuid=? and url=?';
        var entry_key = sha256( data['user'] + ":" + data['url'])
        
        client.execute(query, [ data['user'], data['url'] ], function(err, result) {
    
            if(err){
                console.log(err);
                reject(err)
                return
            }
            if(result.rows.length < 1){
                console.log("No Password Found")
                reject({})
                return
            }
            
            console.log('Found Password');
            
            //ensuring we're getting the correct for the user and url
            if(result.rows[0].entry_key == entry_key){
                resolve({ 'user': data['user'], 'url' : data['url'], 'data' : result.rows[0].data })
            } else {
                console.log("Record Confirm Failed")
                reject({})
            }
        });

    }) 
}

exports.get_user = function(data){
    
    return new Promise(function(resolve,reject){
        var query = 'SELECT password,uuid from password_manager.users where user_name=?'
        
        client.execute(query, [ data['user'] ], function(err, result){
            
            if(err){
                console.log(err)
                reject({})
                return
            }
            
            if(result.rows.length < 1){
                console.log("No User Found")
                reject({})
                return
            }
            
            console.log("USER FOUND")
            resolve({ 'uuid': result.rows[0].uuid, 'password' : result.rows[0].password})
        })
        
    })
}
exports.list_urls = function(data){
    
    var query = 'SELECT url from password_manager.password_entry where user_uuid=?'
    
    return new Promise(function(resolve,reject){
        client.execute(query,[ data['user'] ], function(err,result){
             if(err){
                console.log(err)
                reject({})
                return
            }
            
            if(result.rows.length < 1){
                console.log("No URLS FOUND")
                resolve({})
                return
            }
            
            console.log("Found " + result.rows.length + " URLS")
            
            var urls = []
            for(var x in result.rows){
                urls.push(result.rows[x].url)
            }
            
            console.log(urls)
            
            resolve({ 'urls' : urls})
        })
    })
    
}


