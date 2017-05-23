var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://103.63.109.80:27017/notiii';

var countMap = {};

var saveToDb = function(userID, count){
	MongoClient.connect(url, function(err, db) {
	  	var collection = db.collection('fcm-notiii-count');
	  	var data = {
	  		userID: userID,
	  		count: count
	  	}
		collection.update({_id: userID},  data, { upsert: true}, function(e){
			db.close();
		});
	});
}

module.exports = {
	reset: function(userID){
		countMap[userID] = 0;
		saveToDb(userID, 0);
	},
	count: function(userID){
		if (typeof countMap[userID] !== 'undefined') return 0;
		return countMap[userID]

	},
	increase: function(userID){
		countMap[userID]++;
		saveToDb(userID, countMap[userID]);
	},
	init: function(){
		MongoClient.connect(url, function(err, db) {
		    console.log("Starting load noti count...");
		    var collection = db.collection('fcm-notiii-count');
		    collection.find({}).toArray(function(err, docs) {
		    	docs.forEach(function(item){
		    		countMap[item.userID] = item.count;
		    	});
		    	console.log('Finish loading noticount')
		    	db.close();
		    });
		    
		});
	}
}