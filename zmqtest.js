
var zmq = require('zeromq')
  , sock = zmq.socket('pull');

var mosca = require('mosca');

sock.connect('tcp://127.0.0.1:55551');
console.log('Worker connected to port 55551');
 
sock.on('message', function(msg){
  console.log('work: %s', msg.toString());
});

 
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://localhost')
 
client.on('connect', function () {
  client.subscribe('presence')
  client.publish('presence', 'Hello mqtt')
})
 
client.on('message', function (topic, message) {
  // message is Buffer 
  console.log(message.toString())
  client.end()
})
