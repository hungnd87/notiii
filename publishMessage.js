
var zmq = require('zeromq')
  , sock = zmq.socket('pull');


var registrationToken =  process.env.firebasekey;
var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://103.63.109.80:27017/notiii';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://notiiime-81086.firebaseio.com"
});

//console.log(serviceAccount)
var fcmKeyMap = {};

var sendMsg = function(msg){

  var payload = {
    notification: {
      title: "Nottiii",
      body: "Mã đã thoả mãn điều kiện"
    },
    data: msg
  }

  //var key = 'fiJpT3VG2K8:APA91bGCNiueMwylF8OJ6DqIxb_t7WVGWsGW7AsmrB-8raKI94LXh_g68Q88YFnpW_sv39gH3VOIpya9OgK6MBupgIJXiOfpwLg_MDxHFiKcPRENJUyZ21D4PIHYpNZVlHEP4bAMqFwf'
  var key = fcmKeyMap[msg.userID];

  admin.messaging().sendToDevice(key, payload)
  
  .then(function(response) {
    console.log("Successfully sent message:", response);
  })
  .catch(function(error) {
    console.log("Error sending message:", error);
  });
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
  


 
