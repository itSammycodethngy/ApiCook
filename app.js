var express = require('express');
var app=express();
var mongoose= require('mongoose');
var bodyparser= require('body-parser');

var Jimp = require("jimp");

Tips = require('./models/tips');
User = require('./models/user');

app.use(bodyparser.json());


mongoose.connect('mongodb://localhost:27017/health');

var db = mongoose.connection;

app.get("/", function(req,res){

    res.send("Use API/Tips");

});


//Get The tips
app.get("/api/tips/", function(req,res){

    Tips.getTips(function(err,tips){

        if(err){

          throw err;

            res.status(500).json({ error: 'something is wrong'});
        }

        res.status(200).json(tips);
    })


});


//Insert Tips
app.post("/api/tips/", function(req,res){
    var tips = req.body;
    Tips.addTips(tips ,function(err,tips){

        if(err){

            res.status(500).json({ error: 'something is wrong' });
        }

        res.json(tips);
    })


});


//Update Tips
app.put("/api/tips/:_id", function(req,res){
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
app.delete("/api/tips/:_id", function(req,res){
     var id = req.params._id;
    Tips.deleteTips(id,function(err,tips){

        if(err){

            res.status(500).json({ error: 'something is wrong' });
        }

        res.json({success:"Succesfully deleted"});
    })


});





//Tips By ID
app.get("/api/tips/:_id", function(req,res){

Tips.getTipsById(req.params._id,function(err,bookid){

if(err){


  res.status(500).json({ error: 'something is wrong' });
}

res.json(bookid);


})



});










//Last Route

app.get("*", function(req,res){

res.send("404 error");

});

//This is to set the port for listening
app.listen(3000);
console.log("Running on PORT 3000");
