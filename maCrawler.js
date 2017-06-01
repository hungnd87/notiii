var schedule = require('node-schedule');
var axios = require('axios');
var dateFormat = require('dateformat');
var MongoClient = require('mongodb').MongoClient;
var PubSub = require('./PubSub.js');

var url = 'mongodb://103.63.109.80:27017/notiii';

MongoClient.connect(url, function(err, db) {
  	console.log("Connected correctly to server");
  	var collection = db.collection('ma-stock');
 	PubSub.subscribe('ma_data', function(stocks){

 		stocks.forEach(function(stock, i){
 			stock['_id'] = stock.id;
 			stock.date = new Date(stock.tradingDate);
 			try {
	 			collection.update({_id: stock.id},  stock, { upsert: true}, function(e){
	 			});
 			} catch(err){
 				console.log('save ma fail ' + stock.id);
 				console.log(err)
 			}
 			
 		});
 	});
});

	
var getStockData = function(stocks, index){

	if(stocks.length == index) {
		console.log("Finish crawl");
		return;
	}

	var symbol = stocks[index].symbol;
	index++;

	var to = new Date();
	var from = new Date();
 	from.setDate(from.getDate()-300);

 	var fromDate = dateFormat(from, "yyyy-mm-dd");
 	var toDate = dateFormat(to, "yyyy-mm-dd");

	var url = 'https://finfoapi-hn.vndirect.com.vn/stocks/adPrice?symbols=' + symbol + '&fromDate=' + fromDate + '&toDate=' + toDate;
	
	console.log('get data from ' + url);
	axios.get(url).then(function(response){
		//console.log(response.data);
		PubSub.publish("ma_data",response.data.data);
		getStockData(stocks, index);
	});
}

var crawl = function() {
	console.log('Start crawl from finfo')
	axios.get('https://finfoapi-hn.vndirect.com.vn/stocks').then(function(response){
		var stocks = response.data.data;
		getStockData(stocks, 0);
	});
}

var job = schedule.scheduleJob('1 0 0 * * *', function(){
  	crawl();
});

crawl();