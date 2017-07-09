var mongoose = require("mongoose");

var healthSchema = mongoose.Schema({

    title:{
    type:String,
    required: true

    },

    url:{
    type:String,
    required: true

    },

    content:{
    type:String,
    required:true

    },


    publisher:{
    type:String,
    required:true

  },

  createdAt:{
      type:Number,
      default:new Date().getTime()
  }


});

//returns all Books
var Tips = module.exports = mongoose.model('Tips',healthSchema);


module.exports.getTips= function(callback,limit){

    Tips.find(callback).limit(limit);
}

//Adding new Tips

module.exports.addTips= function(genreObject,callback){

Tips.create(genreObject,callback);

}


//Get Tips By ID
module.exports.getTipsById= function(id,callback){

    Tips.findById(id,callback);
}



//Edit Tips
module.exports.editTips = function(id,tips,options,callback){
var query = {_id:id};

var update = {
title: tips.title,
url: tips.url,
content: tips.content,
publisher: tips.publisher



}

Tips.findOneAndUpdate(query,update,options,callback);

}


module.exports.deleteTips = function(id,callback){
var query = {_id:id};

Tips.remove(query,callback);

}
