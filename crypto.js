var generator = require('generate-password');
var sha256 = require("sha256")


var exports = module.exports = {}


exports.encrypt = function( data ){
    
    var userSecret   = data['userSecret']
    var masterSecret = data['masterSecret']
    var entry_seed   = data['entry_seed']
    
    var product = sha256( userSecret  + sha256( masterSecret )) + 
        sha256(entry_seed + sha256( masterSecret ))
    
    var password = generator.generate({
        length  : data['length'],
        numbers : data['numbers'],
        symbols : data['symbols'],
        uppercase: data['uppercase'],
        exclude: '`!$%^&[]"><:{}()',
        strict  : true
    })
    //@ # * ( ) + = { } / ? ~ ; , . - _

    var encrypted = []
    for ( x in password.split("") ){
        encrypted.push( password.charCodeAt(x)  )
    }
    
    for( var j = 1; j <= 9; j++ ){
        for(var i = 0; i < product.length; i++){
            encrypted[i] = ( encrypted[i] ^ product.charCodeAt( ( i + (j * i) ) % product.length ) )
        }
    }
    
    //var temp = '';
    //for ( var i = 0; i < encrypted.length; i++ ){
       // temp += String.fromCharCode(encrypted[i])
    //}
    
    console.log("ENCRYPTED")
    return {'encrypted' : JSON.stringify(encrypted), 'plaintext' : password }
}

exports.decrypt = function( data ){
    
    var userSecret   = data['userSecret']
    var masterSecret = data['masterSecret']
    var encrypted    = JSON.parse(data['encrypted'])
    var entry_seed   = data['entry_seed']
    
    var product = sha256( userSecret  + sha256( masterSecret )) + 
        sha256(entry_seed + sha256( masterSecret ))

    for( var j = 9; j > 0 ; j-- ){
        for(var i = ( product.length - 1 ); i > -1; i--){
            encrypted[i] = ( encrypted[i] ^ product.charCodeAt( ( i + (j * i) ) % product.length ) )
        }
    }

    var decrypted = ''
    for( var x in encrypted){
        if( encrypted[x] == 0){
            continue;
        }
        decrypted += String.fromCharCode(encrypted[x])
    }
    
    console.log("DECRYPTED")
    return decrypted
}
