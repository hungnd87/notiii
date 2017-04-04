 var SockJS = require('sockjs-client');
 var axios = require('axios');
var MessageUnmarshaller = require('./MessageUnmarshaller');

SockJS.prototype.emit = function(){
	var msg;
	if (arguments.length == 2){
		msg = JSON.stringify({
			type: arguments[0],
			data: arguments[1]
		});	
	}else {
		msg = JSON.stringify(arguments[0]);
	}
	
	this.send(msg);	
};

var stockDictionary = {}
var stockCodes = []

function getStockList(){
	return axios.get('https://finfoapi-hn.vndirect.com.vn/stocks').then(function(response){
		var stocks = response.data.data;
		stocks.forEach(function(stock, i){
			//console.log(stock)
			stockDictionary[stock.symbol] = stock;
			stockCodes.push(stock.symbol);
		})
		
	})
}



getStockList().then(function(data){
	var sock = new SockJS('https://price-hn01.vndirect.com.vn/realtime');
	sock.onopen = function() {

	console.log('open');
	sock.emit('registConsumer', {
	 	sequence: 0,
	 	params: {
	 		name: 'STOCK',
	 		codes: stockCodes
	 	},
	 	isIntervalRegist: false
	 })
	};

	sock.onmessage = function(e) {
		var msg = JSON.parse(e.data);

		switch (msg.type) {
			case 'returnData': 
				var stockMap = msg.data.data
				for (var stockCode in stockMap) {
					var stockInfo = stockMap[stockCode];

					//console.log(MessageUnmarshaller.unmarshal('STOCK', stockInfo))
				}
				break
			case 'STOCK':
				console.log(msg.data)
		}
		
	};
	sock.onclose = function() {
		console.log('close');
	};
});

 

