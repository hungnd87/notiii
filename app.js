
var https = require('https');
var http = require('http');
var express = require('express')
var app = express();
var axios = require('axios');
var bodyParser = require('body-parser');
var fs = require('fs');

var privateKey = fs.readFileSync( 'hostname.key' );
var certificate = fs.readFileSync( 'hostname.pem' );


getPageAccessToken = function(){}

var port = process.env.PORT || 443;


app.use(express.static('public'));
app.use( bodyParser.json() );       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 



app.post('/facebookAuth', function (req, res) {

	axios.get('https://graph.facebook.com/me?access_token=' + req.body.accessToken).then(function (response) {
	    console.log(response.data);
	    res.end(JSON.stringify(response.data))
	})
	.catch(function (error) {
	    console.log(error);
	});
 	
})

app.get('/facebook/message', function(req, res){
	console.log(req.body);
	res.end('ok');
})

// app.listen(port, function () {
//   console.log('Example app listening on port ' + port)
// })
// https.createServer({
//     key: privateKey,
//     cert: certificate
// }, app).listen(port);

http.createServer(app).listen(8080);

