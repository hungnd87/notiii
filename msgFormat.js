//var noti = {"id":"SG_3300496804574921227","status":"CANCELLED","createdAt":1494413401290,"triggeredAt":1494415152488,"expiryDate":1495472399000,"symbols":["VND"],"userID":null,"operators":[{"@class":"notiii.sig.model.operator.SingleFunction","symbol":"VND","field":"matchedPrice","operator":">=","value":"15700.0"}],"signalID":"SG_3300496804574921227"}

var getConditionText = function(condition){
	var text = '';
	if (condition.field == "matchedPrice" ) {
		return condition.symbol + ' giá ' + condition.operator + ' ' + condition.value;
	}
	if (condition.field == "accumulatedVol" ) {
		return condition.symbol + ' khối lượng ' + condition.operator + ' ' + parseInt(condition.value);
	}
	return condition.symbol + ' ' + condition.field + ' ' + condition.operator + ' ' + condition.value;
}

var getNotiMessage = function(msg){
	var text = 'Thoả mãn điều kiện: ';
	for (var i=0; i<msg.operators.length; i++) {
		if (i>0) text += ', '
		text += getConditionText(msg.operators[i]);
	}

	return text;
}

//console.log(getNotiMessage(noti))
module.exports = {
	text: getNotiMessage
}