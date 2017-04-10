
var zmq = require('zeromq')
  , sock = zmq.socket('pull');

var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://localhost')


sock.connect('tcp://127.0.0.1:55551');
console.log('Worker connected to port 55551');
 
sock.on('message', function(msg){
  console.log('work: %s', msg.toString());
});

 

 
client.on('connect', function () {
	console.log("connect mqtt")
  //client.subscribe('signal')
  client.publish('signal', 'Test')
})
 
client.on('message', function (topic, message) {
  // message is Buffer 
  console.log(message.toString())
  //client.end()
});
