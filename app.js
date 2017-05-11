
var https = require('https');
var http = require('http');
var express = require('express')
var app = express();
var axios = require('axios');
var bodyParser = require('body-parser');
var fs = require('fs');


var zmq = require('zeromq')
  , sock = zmq.socket('pull');


var admin = require("firebase-admin");
var msgFormat = require('./msgFormat.js');

var serviceAccount = require("./serviceAccountKey.json");

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://103.63.109.80:27017/notiii';

var privateKey = fs.readFileSync( 'hostname.key' );
var certificate = fs.readFileSync( 'hostname.pem' );
var fcmKeyMap = {};

getPageAccessToken = function(){}

var port = process.env.PORT || 443;


app.use(express.static('public'));
app.use( bodyParser.json() );       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 



app.post('/facebookAuth', function (req, res) {

	axios.get('https://graph.facebook.com/me?access_token=' + req.body.accessToken).then(function (response) {
	    console.log(response.data);
	    res.end(JSON.stringify(response.data))
	})
	.catch(function (error) {
	    console.log(error);
	});
 	
})

app.get('/facebook/message', function(req, res){
	console.log(req.body);
	res.end('ok');
});

app.post('/users/:userID/fcm', function(req, res){
	var data = req.body;
	data['_id'] = data.userID;
	fcmKeyMap[data.userID] = data.fcmKey;
	saveUserFcm(data, res);
});

app.post('/users/:userID/sendTestMsg', function(req, res){
	sendMsg(req.body);
	res.end('ok');
})


//NOTIFICATION

var saveUserFcm = function(data, res){
	MongoClient.connect(url, function(err, db) {
	  	var collection = db.collection('user-fcm');
		collection.update({_id: data.userID},  data, { upsert: true}, function(e){
			if (e == null) {
				res.end(JSON.stringify(data));
			} else {
				res.status(500);
				res.end(e)
			}
		});
	});
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://notiiime-81086.firebaseio.com"
});

//console.log(serviceAccount)


var sendMsg = function(msg){

  var payload = {
    notification: {
      title: "Nottiii",
      body: msgFormat.text(msg)
    },
    //data: msg
  }

  //var key = 'fiJpT3VG2K8:APA91bGCNiueMwylF8OJ6DqIxb_t7WVGWsGW7AsmrB-8raKI94LXh_g68Q88YFnpW_sv39gH3VOIpya9OgK6MBupgIJXiOfpwLg_MDxHFiKcPRENJUyZ21D4PIHYpNZVlHEP4bAMqFwf'
  
	if (msg.userID in fcmKeyMap) {
	    var key = fcmKeyMap[msg.userID];


	    admin.messaging().sendToDevice(key, payload)
	    
	    .then(function(response) {
	      console.log("Successfully sent message:", response);
	    })
	    .catch(function(error) {
	      console.log("Error sending message:", error);
	    });
	}
   else {
   		console.log('Lỗi không tìm thấy fcmkey của user' + msg.userID);
   }
  
}

var loadFcmKey = function(){
  MongoClient.connect(url, function(err, db) {
    console.log("Connected correctly to server");
    var collection = db.collection('user-fcm');
    collection.find({}).toArray(function(err, docs) {
      docs.forEach(function(item){
        fcmKeyMap[item.userID] = item.fcmKey;
      })
    });
  });
}



loadFcmKey();

// var mqtt = require('mqtt')
// var client  = mqtt.connect('mqtt://localhost')
 
// client.on('connect', function () {
// 	console.log("connect mqtt")

sock.connect('tcp://127.0.0.1:55551');
 	console.log('Worker connected to port 55551');
	 
 	sock.on('message', function(msg){
	  console.log('work: %s', msg.toString());
    sendMsg(msg);

 	  //client.publish('signal', msg.toString());
});

// END NOTIFICATION BLOCK  

process.on('uncaughtException', function (err) {
  console.log(err);
});


// app.listen(port, function () {
//   console.log('Example app listening on port ' + port)
// })
// https.createServer({
//     key: privateKey,
//     cert: certificate
// }, app).listen(port);

http.createServer(app).listen(80);

