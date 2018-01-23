var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

var router = express();
var server = http.createServer(router);
//var io = socketio.listen(server);

var Twitter = require('twitter-node-client').Twitter;

router.use(express.static(path.resolve(__dirname, 'client')));

//////////////////////////////////////


console.log("test")

//Callback functions
	var error = function (err, response, body) {
    	console.log('ERROR [%s]', err);
    	console.log(err);
	};
	var success = function (data) {
	  var obj = JSON.parse(data);
	  console.log("*************");
    	console.log(obj["statuses"][0]["text"]);
	};
	
	
	
 //Get this data from your twitter apps dashboard
	var config = {
    	"consumerKey": "Oc8wVFDK8MvK0LxG3tkmIG7wr",
    	"consumerSecret": "JTRO06J9xTDYemqiX34XGmjY1s9qqIkOuLRI4OwHC5WoX2uJP1",
    	"accessToken": "3374762296-inLE1UjRROjsWMRKdhZJJAyjX0HuZmkSJEPVBra",
    	"accessTokenSecret": "kwLL036MQGHODjMdtFFzMSvrT1NOnOGbJO6xeBtAxLO4P",
    	"callBackUrl": ""
	}

    var twitter = new Twitter(config);
    
twitter.getSearch({'q':'#haiku','count': 1}, error, success);

























/////////////////////////////////////////////////////////////////////////


server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
