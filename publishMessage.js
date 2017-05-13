
var zmq = require('zeromq')
  , sock = zmq.socket('sub');


  //sock.connect('tcp://103.63.109.80:55551');
  sock.connect('tcp://127.0.0.1:55551');
 	console.log('Worker connected to port 55551');

sock.subscribe('');

 	sock.on('message', function(topic, msg){
    console.log('aaa');
	  console.log('work: %s', msg.toString());

 	});
  


 
