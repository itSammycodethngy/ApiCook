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

    User.findOne({
    name: user.name}, function(err, user) {

      if (err){

      throw err;}
              else if(user){
                res.json({ success:'false',
                           message:'user already exist'
        }); }
            else if(!user){
            User.addUsers(user ,function(err,user){
             if(err){
             res.status(500).json({ error: 'something is wrong',
             Succes:'true',
             message:"User has been Created " });
              } res.json(user);


  });

}

});


});


//Authentication Router

apiRoutes.post('/authenticate', function(req, res) {
  var user = req.body;
  // find the user
  User.findOne({
    name: user.name
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false,
        message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != user.password) {
        res.json({ success: false, message:
          'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, app.get('superSecret'), {
          // expiresInMinutes: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }

    }

  });
});


//Adds token to rest of API calls Below

apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['bearer-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }
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
