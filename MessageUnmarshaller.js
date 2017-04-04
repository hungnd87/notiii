MessageUnmarshaller = {
	SEPARATOR: "|",
	map: {
		//default message type
		//"STOCK", "MARKETINFO", "TRANSACTION", "PUT", "PUTEXEC"
		STOCK: function (mess){
			if (!mess) {
				return;
			}
			var arr = mess.split(MessageUnmarshaller.SEPARATOR);
			if (arr.length < 40){
				console.error("StockInfo message structre is change. ");
				//return;
			}
			itemInfo = {};
			itemInfo.floorCode = arr[0];
			itemInfo.tradingDate = arr[1];
			itemInfo.time = arr[2];
			itemInfo.code = arr[3];
			itemInfo.companyName = arr[4];
			itemInfo.stockType = arr[5];
			itemInfo.totalRoom = arr[6];
			itemInfo.currentRoom = arr[7];
			itemInfo.basicPrice = arr[8];
			itemInfo.openPrice = arr[9];
			itemInfo.closePrice = arr[10];
			itemInfo.currentPrice = arr[11];
			itemInfo.currentQtty = arr[12];
			itemInfo.highestPrice = arr[13];
			itemInfo.lowestPrice = arr[14];
			itemInfo.ceilingPrice = arr[15];
			itemInfo.floorPrice = arr[16];
			itemInfo.totalOfferQtty = arr[17];
			itemInfo.totalBidQtty = arr[18];
			itemInfo.matchPrice = arr[19];
			itemInfo.matchQtty = arr[20];
			itemInfo.matchValue = arr[21];
			itemInfo.averagePrice = arr[22];
			itemInfo.bidPrice01 = arr[23];
			itemInfo.bidQtty01 = arr[24];
			itemInfo.bidPrice02 = arr[25];
			itemInfo.bidQtty02 = arr[26];
			itemInfo.bidPrice03 = arr[27];
			itemInfo.bidQtty03 = arr[28];
			itemInfo.offerPrice01 = arr[29];
			itemInfo.offerQtty01 = arr[30];
			itemInfo.offerPrice02 = arr[31];
			itemInfo.offerQtty02 = arr[32];
			itemInfo.offerPrice03 = arr[33];
			itemInfo.offerQtty03 = arr[34];
			itemInfo.accumulatedVal = arr[35];
			itemInfo.accumulatedVol = arr[36];
			itemInfo.buyForeignQtty = arr[37];
			itemInfo.sellForeignQtty = arr[38];
			itemInfo.projectOpen = arr[39];
			itemInfo.sequence = arr[40];
			return itemInfo;
		},
		MARKETINFO: function (mess){
			var arr = mess.split(MessageUnmarshaller.SEPARATOR);
			itemInfo = {};
			itemInfo.marketID = arr[0];
			itemInfo.totalTrade = arr[1];
			itemInfo.totalShareTraded = arr[2];
			itemInfo.totalValueTraded = arr[3];
			itemInfo.advance = arr[4];
			itemInfo.decline = arr[5];
			itemInfo.noChange = arr[6];
			itemInfo.indexValue = arr[7];
			itemInfo.changed = arr[8];
			itemInfo.tradingTime = arr[9];
			itemInfo.tradingDate = arr[10];
			itemInfo.floorCode = arr[11];
			itemInfo.marketIndex = arr[12];
			itemInfo.priorMarketIndex = arr[13];
			itemInfo.highestIndex = arr[14];
			itemInfo.lowestIndex = arr[15];
			itemInfo.shareTraded = arr[16];
			itemInfo.status = arr[17];
			itemInfo.sequence = arr[18];
			itemInfo.predictionMarketIndex = arr[19];
			return itemInfo;
		},
		PT_ORDER: function (mess){
			var arr = mess.split(MessageUnmarshaller.SEPARATOR);
			itemInfo = {};

			itemInfo.floorCode = arr[0];
			itemInfo.symbol = arr[1];
			itemInfo.price = parseFloat(arr[2]);
			itemInfo.volume = parseFloat(arr[3]);
			itemInfo.time = arr[4];
			itemInfo.sequence = arr[5];
			itemInfo.basicPrice = arr[6];
			itemInfo.ceilingPrice = arr[7];
			itemInfo.floorPrice = arr[8];

			return itemInfo;
		},
		AD_ORDER: function (mess){
			var arr = mess.split(MessageUnmarshaller.SEPARATOR);
			itemInfo = {};

			itemInfo.floorCode = arr[0];
			itemInfo.stockSymbol = arr[1];
			itemInfo.price = arr[2];
			itemInfo.vol = arr[3];
			itemInfo.type = arr[4];
			itemInfo.status = arr[5];
			itemInfo.time = arr[6];
			itemInfo.sequence = arr[7];
			itemInfo.basicPrice = arr[8];
			itemInfo.ceilingPrice = arr[9];
			itemInfo.floorPrice = arr[10];

			return itemInfo;
		},
		TRANSACTION: function(mess){
			var arr = mess.split(MessageUnmarshaller.SEPARATOR);
			itemInfo = {};

			itemInfo.floorCode = arr[0];
			itemInfo.symbol = arr[1];
			itemInfo.highest = arr[2];
			itemInfo.last = arr[3];
			itemInfo.lastVol = arr[4];
			itemInfo.lowest = arr[5];
			itemInfo.matchType = arr[6];
			itemInfo.openPrice = arr[7];
			itemInfo.time = arr[8];
			itemInfo.sequence = arr[9];
			itemInfo.basicPrice = arr[10];
			return itemInfo;
		}
	},
	regist: function(messType, unmarshaller){
		if (typeof unmarshaller == "function"){
			this.map[messType] = unmarshaller;
		}
	},
	unmarshal: function(messType, mess){
		if (typeof this.map[messType] == "undefined" ){
			return mess;
		}
		return this.map[messType](mess);
	}
};

module.exports = MessageUnmarshaller;