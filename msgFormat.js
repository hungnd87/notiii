//var noti = {"id":"SG_3300496804574921227","status":"CANCELLED","createdAt":1494413401290,"triggeredAt":1494415152488,"expiryDate":1495472399000,"symbols":["VND"],"userID":null,"operators":[{"@class":"notiii.sig.model.operator.SingleFunction","symbol":"VND","field":"matchedPrice","operator":">=","value":"15700.0"}],"signalID":"SG_3300496804574921227"}

var getConditionText = function(condition, isAddSymbol){
	var text = '';
	var preText = isAddSymbol ? condition.symbol : '';
	if (condition.field == "matchedPrice" ) {
		var price = parseFloat(condition.value)/1000;
		return preText + ' giá ' + condition.operator + ' ' + price;
	}
	if (condition.field == "accumulatedVol" ) {
		return preText + ' khối lượng ' + condition.operator + ' ' + parseInt(condition.value);
	}
	if (condition.field == "ma20_x_ma50_cu" ) {
		return preText + " MA20 cắt lên MA50"
	}
	if (condition.field == "ma20_x_ma50_cd") {
		return preText + " MA20 cắt xuống MA50"
	}
	return preText + ' ' + condition.field + ' ' + condition.operator + ' ' + condition.value;
}

var getNotiMessage = function(msg){
	var text = 'Thoả mãn điều kiện: ';
	for (var i=0; i<msg.operators.length; i++) {
		if (i>0) text += ', '
		text += getConditionText(msg.operators[i], i==0);
	}

	return text;
}

//console.log(getNotiMessage(noti))
module.exports = {
	text: getNotiMessage
}