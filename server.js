/**************************** Imports ****************************************/


var async = require('async');  // dont worry
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io');
io = io.listen(http);

var path = require('path'); // dont worry

var Twitter = require('twitter-node-client').Twitter; // twitter api
const NewsAPI = require('newsapi'); // news api

var csv = require("fast-csv");

app.use(express.static(path.resolve(__dirname, 'client'))); //tells what path the client is  // dont worry

////////////////////////////////// the server running VVVV ///////////////////////////////////////  // dont worry

http.listen(8080, "0.0.0.0", function(){
//server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = http.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});

/////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////// TWITTER API //////////////////////////////////

//Callback functions for twitter
var error = function (err, response, body) {
	console.log('ERROR [%s]', err);
	//console.log(err);
};
var success = function (data) {
	var obj = JSON.parse(data);
	console.log("*************");
 //	console.log(obj);
	//console.log(obj[0].text);
};
	
//  Get this data from your twitter apps dashboard
var twitterconfig = {
		"consumerKey": "Oc8wVFDK8MvK0LxG3tkmIG7wr",
		"consumerSecret": "JTRO06J9xTDYemqiX34XGmjY1s9qqIkOuLRI4OwHC5WoX2uJP1",
		"accessToken": "3374762296-inLE1UjRROjsWMRKdhZJJAyjX0HuZmkSJEPVBra",
		"accessTokenSecret": "kwLL036MQGHODjMdtFFzMSvrT1NOnOGbJO6xeBtAxLO4P",
		"callBackUrl": ""
}

var twitter = new Twitter(twitterconfig);
twitter.getUserTimeline({'screen_name':"realDonaldTrump", 'count': 20}, error, success);
//twitter.getSearch({'q':'#haiku','count': 1}, error, success);


/************************* Read CSV File ****************************************/

var fnews = [];  /* Fake news to be sent to client */
csv
 .fromPath("fakenews.csv")
 .on("data", function(data){
	   fnews.push(data[4])
     //console.log(data[4]);
 })
 .on("end", function(){
    // console.log("done");
 });


///////////////////////////////// NEWS API //////////////////////////////////

const newsapi = new NewsAPI('2ccceac2fcb24cbfa1e0c97d75c9f809');
newsapi.v2.topHeadlines({
  language: 'en',
  country: 'us'
}).then(response => {
  //console.log(response);
});



////////////////// SOCKET STUFF /////////////////////////////////////////////////////////////////////////////

io.sockets.on('connection', function (socket) {
	console.log("someone connected");
	socket.emit('hello','hello world');
});















