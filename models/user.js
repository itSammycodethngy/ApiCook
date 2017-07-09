var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
name:{
  type:String
},

password:{
type:String
},

admin:{
type:Boolean
}


});


var User = module.exports = mongoose.model('User',UserSchema);



module.exports.getUsers= function(callback,limit){

    User.find(callback).limit(limit);
}

//Adding new User

module.exports.addUsers= function(userObject,callback){

User.create(userObject,callback);

}


//Get Tips By ID
module.exports.getUserById= function(id,callback){

    User.findById(id,callback);
}



//Edit Tips
module.exports.editUser = function(id,user,options,callback){
var query = {_id:id};

var update = {
name: user.name,
password: user.password,
admin: user.admin

}

User.findOneAndUpdate(query,update,options,callback);

}


module.exports.deleteUsers = function(id,callback){
var query = {_id:id};

User.remove(query,callback);

}
