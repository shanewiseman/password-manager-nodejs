var generator = require('generate-password');
var sha256 = require("sha256")

var masterSecret = '20D8A361ACEE4BF0570C540E6202BA34FE870D30E2BAB802B59F14425F1BA93779FDC6245C7DBEC1CA458D77F4FB802F293B4536E775227560A6EC75EE3AD442'



var exports = module.exports = {}


exports.encrypt = function( data ){
    
    var userSecret   = data['userSecret']
    var entry_seed   = data['entry_seed']
    
    var product = sha256( userSecret  + sha256( this.masterSecret )) + 
        sha256(entry_seed + sha256( this.masterSecret ))
    
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
    
    console.log("ENCRYPTED")
    return {'encrypted' : JSON.stringify(encrypted), 'plaintext' : password }
}

exports.decrypt = function( userSecret, encrypted, entry_seed){
    
    var encrypted    = JSON.parse(data['encrypted'])
    
    var product = sha256( userSecret  + sha256( this.masterSecret )) + 
        sha256(entry_seed + sha256( this.masterSecret ))

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
exports.create_token = function(user,c_secret, nounce){
    return sha256( masterSecret + sha256( user + c_secret + nounce ) ).substr(0,9)
}
