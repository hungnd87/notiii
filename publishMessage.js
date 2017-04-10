
var zmq = require('zeromq')
  , sock = zmq.socket('pull');

var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://localhost')
 
client.on('connect', function () {
	console.log("connect mqtt")

  	sock.connect('tcp://127.0.0.1:55551');
	console.log('Worker connected to port 55551');
	 
	sock.on('message', function(msg){
	  console.log('work: %s', msg.toString());
	  client.publish('signal', msg.toString());
	});
})
 
