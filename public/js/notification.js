
function showMsg (msg, icon, time) {
    if(window.Notification && Notification.permission !== "denied") {
      Notification.requestPermission(function(status) {
        var n = new Notification('Notiii', {
          body: msg,
          icon: icon
        });
        // setTimeout(function(){
        //     n.close();
        // }, time)
      });
    }
}

// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("onConnect");
  client.subscribe("signal");
  // message = new Paho.MQTT.Message("Hello");
  // message.destinationName = "World";
  // client.send(message);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  console.log("onMessageArrived:"+message.payloadString);
  showMsg(message.payloadString, 'images/bell.png')
}

// Create a client instance
client = new Paho.MQTT.Client('notiii.com', 1884,"clientId" );

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({onSuccess:onConnect});