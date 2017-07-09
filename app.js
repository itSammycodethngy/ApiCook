var express = require('express');
var app=express();
var mongoose= require('mongoose');
var bodyparser= require('body-parser');

var Jimp = require("jimp");

Tips = require('./models/tips');
User = require('./models/user');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file

app.use(bodyparser.json());


var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable


app.get("/", function(req,res){

    res.send("Use API/Tips");

});

//Middleware
var apiRoutes = express.Router();

//Add User to System

apiRoutes.post("/user", function(req,res){
    var user = req.body;
    User.addUsers(user ,function(err,user){

        if(err){

            res.status(500).json({ error: 'something is wrong',
                                    Succes:'true',
                                    message:"User has been Created " });
        }

        res.json(user);
    })


});



//Get The tips
apiRoutes.get("/tips", function(req,res){

    Tips.getTips(function(err,tips){

        if(err){

          throw err;

            res.status(500).json({ error: 'something is wrong'});
        }

        res.status(200).json(tips);
    })


});


//Insert Tips
apiRoutes.post("/tips", function(req,res){
    var tips = req.body;
    Tips.addTips(tips ,function(err,tips){

        if(err){

            res.status(500).json({ error: 'something is wrong' });
        }

        res.json(tips);
    })


});


//Update Tips
apiRoutes.put("/tips/:_id", function(req,res){
     var id = req.params._id;
    var tips = req.body;
    Tips.editTips(id,tips ,{},function(err,tips){

        if(err){

            res.status(500).json({ error: 'something is wrong' });
        }

        res.json(tips);
    })


});


//Delete Tips
apiRoutes.delete("/tips/:_id", function(req,res){
     var id = req.params._id;
    Tips.deleteTips(id,function(err,tips){

        if(err){

            res.status(500).json({ error: 'something is wrong' });
        }

        res.json({success:"Succesfully deleted"});
    })


});





//Tips By ID
apiRoutes.get("/tips/:_id", function(req,res){

Tips.getTipsById(req.params._id,function(err,bookid){

if(err){


  res.status(500).json({ error: 'something is wrong' });
}

res.json(bookid);


})



});




app.use('/api', apiRoutes);





//Last Route

app.get("*", function(req,res){

res.send("404 error");

});

//This is to set the port for listening
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
