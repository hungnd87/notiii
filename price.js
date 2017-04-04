var SockJS = require('sockjs-client');
var axios = require('axios');
var PubSub = require('./PubSub.js');
var MessageUnmarshaller = require('./MessageUnmarshaller');
var kafka = require('kafka-node'),
    Producer = kafka.Producer,
    kafkaClient = new kafka.Client('localhost:2181', 'notiii-node'),
    kafkaProducer = new Producer(kafkaClient);

var Constant = {
	STOCK : 'STOCK',
	AD_ORDER : 'AD_ORDER',
	PT_ORDER : 'PT_ORDER',
	MARKETINFO : 'MARKETINFO',
	MARKET_STATUS: 'MARKET_STATUS',
	TRANSACTION : 'TRANSACTION',
	CATEGORY : 'CATEGORY',
	CEILING_FLOOR_COUNT: 'CEILING_FLOOR_COUNT', 
	MARKET_BEGIN : 'MARKET_BEGIN',
	MARKET_END : 'MARKET_END',
	MARKET_END_RECOVERY : 'MARKET_END_RECOVERY',
	COMPANY: 'COMPANY'
};

var FLOOR_CODES = ['02', '03', '10' ,'11' , '12', '13'];

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

 

function consumePriceService() {

	getStockList().then(function(data){
		var sock = new SockJS('https://price-hn01.vndirect.com.vn/realtime');
		console.log("Total " + stockCodes.length + " symbols. Start registConsumer");

		sock.onopen = function() {
			console.log('open socket');

			sock.emit('registConsumer', {
			 	sequence: 0,
			 	params: {
			 		name: 'STOCK',
			 		codes: stockCodes
			 	},
			 	isIntervalRegist: false
			});

			sock.emit('registConsumer', {
			 	sequence: 0,
			 	params: {
			 		name: Constant.MARKETINFO,
			 		codes: FLOOR_CODES
			 	},
			 	isIntervalRegist: false
			});
		};

		sock.onmessage = function(e) {
			try {
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
						var stock = MessageUnmarshaller.unmarshal('STOCK', msg.data.data)
						kafkaProducer.send([{
							topic: 'price', 
							messages: JSON.stringify(stock), 
							partition: 0 
						}]);

						break
					case 'MARKETINFO':
						var market = MessageUnmarshaller.unmarshal('MARKETINFO', msg.data.data)
						kafkaProducer.send([{
							topic: 'price', 
							messages: JSON.stringify(market), 
							partition: 0
						}]);
						break
				}

			} catch (e) {
				console.log(e);
			}
			
		};
		sock.onclose = function() {
			console.log('socket close');
			PubSub.publish("socket_disconnect");
		};
	});
}

PubSub.subscribe('socket_disconnect', function(){
	consumePriceService();
});

kafkaProducer.on('ready', function () {
    console.log("connect kafka")
    consumePriceService();
});



