const express = require('express')
var bodyParser = require('body-parser');
const ApiMethods = require('./api_methods.js')
const Middleware  = require('./middleware.js')
const app = express()
const port = 8080

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
})
app.post('/GETALL', function( req, resp ){
    
    console.log("GET ALL CALLED")
    Middleware.get_entries_Request(req).then(function(result){
        ApiMethods.get_all_entries(result).then(function(result){
            Middleware.get_entries_Response(result).then(function(result){
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
app.post('/GET/TOKEN', function( req, resp){
    console.log("Generating Token")
    Middleware.generate_token_Request(req).then(function(result){
        ApiMethods.generate_token(result).then(function(result){
            Middleware.generate_token_Response(result).then(function(result){
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
