const express = require('express')
var bodyParser = require('body-parser');
const ApiMethods = require('./api_methods.js')
const Middleware  = require('./middleware.js')
const app = express()
const port = 80

app.use(bodyParser.json())

app.post('/CREATE', function( req, resp ){

    console.log("POST CALLED")
    Middleware.create_entryRequest( req ).then(function(result){
     
        ApiMethods.create_entry(result).then(function(result){
          
          Middleware.create_entryResponse(result).then(function(result){
              console.log("DONE\n")
              resp.json(result)
          
              
          }).catch(function(result){
              resp.status(500).end();
          })
      }).catch(function(result){
         resp.status(500).end(); 
      })
  }).catch(function(result){
      resp.status(500).end();
  })
  
  
})
app.post('/GET', function( req, resp ){
    
    console.log("GET CALLED")
    Middleware.get_entryRequest(req).then(function(result){
        ApiMethods.get_entry(result).then(function(result){
            Middleware.get_entryResponse(result).then(function(result){
                console.log("DONE\n")
                resp.json(result)
            }).catch(function(result){
                resp.status(500).end();
            })
        }).catch(function(result){
            resp.status(500).end();
        })
    }).catch(function(result){
         resp.status(500).end();
    })

    //ApiMethods.get_entry( Middleware.get_entryRequest(req) ).then(function(result){
    //    resp.json( Middleware.get_entryResponse( result ))
    //})
})
app.post('/LIST', function( req, resp){
    console.log("LIST CALLED")
    Middleware.list_entryRequest(req).then(function(result){
        ApiMethods.list_entry(result).then(function(result){
            Middleware.list_entryResponse(result).then(function(result){
                console.log("DONE\n")
                resp.json(result)
            }).catch(function(result){
                resp.status(500).end();
            })
        }).catch(function(result){
            resp.status(500).end();
        })
    }).catch(function(result){
         resp.status(500).end();
    })
    
})






app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
})
