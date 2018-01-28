var fnews = [];
var tweets = [];
var socket = io.connect('http://tweetslash-hjohnsto298358.codeanyapp.com:8080/');

var fakenews = false;
var trumptweets = false;
socket.on('Fake News', function(data) {
	//console.log(data);
	fnews = data;
	fakenews = true;
	if (fakenews && trumptweets) {
			init();
	}
})
socket.on('Trump Tweets', function(data) {
	//console.log(data);
	tweets = data;
	trumptweets = true;
	if (fakenews && trumptweets) {
			init();
	}
})

var player;
var boxes = [];
const width = window.innerWidth;
const height = window.innerHeight;
var dist = Math.max(width,height)*1.5;
var slow = 400;
var mousex=0;
var mousey=0;
var lightsaberImg;
var generateBoxes;

var gameArea = {
	canvas : document.createElement("canvas"),
  prep : function() {
    //console.log("starting the game");
		this.canvas.width = width;
		this.canvas.height = height;
    
		// this.canvas.addEventListener("mousedown", handleMouseDown);
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]); // ?
  },
	start : function() {
		
    this.interval = setInterval(this.update, 10);
		// this.context.drawImage(base_image, 20, 20);
	},
	clear : function() {
		this.context.clearRect(0, 0, width, height);
	},  
  // function to use to update the game area. lots happens here
  update : function() { 
    
    gameArea.clear();
    
    var ctx = gameArea.context; 
    //ctx.fillStyle = "yellow";
    //ctx.fillRect(0,0,width-10,height-10);
    
    //console.log("canvas is ",gameArea.canvas.width, "wide");
    player.update(width/2,height/2,mousex,mousey);
    
    
    // draw the boxes
    for (var i=0; i<boxes.length; i++) {
      
      outofboundsCheck(boxes[i]); // is the box in the canvas?
      var b = boxes[i];
      if (b.display === true) {
        ctx.fillStyle = "red";
        ctx.fillRect(b.x-b.width/2,b.y-b.height/2,b.width,b.height);
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText(b.text,b.x-b.width/2,b.y+b.height/2);
      }
      boxes[i].x+=b.vx;
      boxes[i].y+=b.vy;
      
      
    }
    
    // remove a box from the list if there are any finished boxes
    var remove = -1;
    for (var j=0; j< boxes.length; j+=1) {
      if (boxes[j].done === true) {
        //console.log("done")
        remove = j;
        break;
      }
    }
    if (remove > -1) {
      boxes.splice(j, 1);
      //console.log(boxes)
    }
    
  
	  //console.log("updating\n");
  }

}


function Player() {
  var pl = {};
	pl.width = 40;
	pl.height = 40;
	pl.x = width/2-pl.width/2;
	pl.y = height/2-pl.height/2;
  pl.orientation = 0; // 0 to 2pi?
  //console.log("creating player with x=",pl.x," y=",pl.y);
	pl.update = function(x,y,mx,my) {
    pl.x=x-pl.width/2;
    pl.y=y-pl.height/2;
    
		var neg = (mx-x < 0) ? true : false;
    var angle = Math.atan((my-y)/(mx-x));
		pl.orientation = (neg) ? angle + Math.PI : angle;
		//console.log(pl.orientation);
    
    //console.log((my-y)/(mx-x),"   ",pl.orientation)
    
    ctx = gameArea.context;
    ctx.save();
    ctx.translate( width/2, height/2 );
    ctx.rotate( pl.orientation );
    ctx.translate( -pl.width/2, -pl.height/2 );
    // ctx.drawImage( myImageOrCanvas, 0, 0 );
	  ctx.fillStyle = "blue";
    //ctx.fillRect(x-pl.width/2, y-pl.height/2, pl.width, pl.height);
    ctx.fillRect(0, 0, pl.width, pl.height);
		
		ctx.drawImage(lightsaberImg,50,10,100,10);
		
    ctx.restore();
		
		
	}
  return pl;
}
function Box(text, angle) {
  
  this.height=30;
  this.width=250;
  this.angle=angle; // make this random
  // this.x=0;
  // this.y=0;
  this.x=player.x+(dist*Math.cos(angle))-this.width/2;
  this.y=player.y+(dist*Math.sin(angle))-this.height/2;
  //console.log("box: x=",this.x,"y=",this.y);
  var tmpx = player.x-this.x;
  var tmpy = player.y-this.y;
  // this.vx = (tmpx == 0) ? 0 : ((tmpx < 0) ? -1 : 1);
  // this.vy = (tmpy == 0) ? 0: ((tmpy < 0) ? -1 : 1);
  
  this.vx = tmpx/slow;
  this.vy = tmpy/slow; 
  this.display = false;
  this.done = false;
  
  this.text = text;
  
}

function createBox() {
	if (generateBoxes === false) {
		return;
	}
	/* Randomly select text from tweets and fake news */
	var n = Math.floor(Math.random() * 100);
	var text;
	if(n % 2 === 0){
		//console.log("F news lenght: %d", fnews.length);
		//console.log(fnews);
		text = "";
		while((text === "") || (typeof text === "undefined")){
				
				text = fnews[Math.floor(Math.random() * fnews.length)];	
			  //console.log("loop",text)
		}
		//console.log("even",text)
	}
	else{
		//console.log("Tweets length: %d", tweets.length);
		text = "";
		while((text === "") || (typeof text === "undefined")){
			text = tweets[Math.floor(Math.random() * tweets.length)];
		}
		//console.log("odd:",text);
	}
  var angle = Math.random() * Math.PI*2;     // returns a number between 0 and 100
  boxes.push(new Box(text, angle));
}

function outofboundsCheck(box) {
  if (box.x > width || box.x<0 || box.y > height || box.y<0) {
    //console.log("out of bounds");
    if (box.display === true) {
      box.display = false;
      box.done = true; 
    }
    return true;
  }
  box.display = true;
  return false; // not out of bounds
}


function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}




      


function init() {

	lightsaberImg = new Image();

	lightsaberImg.onerror = function() {
		console.log("image is broken");
	}
	lightsaberImg.src = '/img/lightsaber1.png'
	
  gameArea.prep();
	player = Player();
  
  // get mouse coortinates for rotation
  gameArea.canvas.addEventListener('mousemove', function(evt) { 
    var mousePos = getMousePos(gameArea.canvas, evt); 
    mousex = mousePos.x;
    mousey = mousePos.y;
  }, false);
	gameArea.canvas.addEventListener('click', function(evt) { 
		console.log(player.orientation);
		var toDelete = [];
		
		// calculate sword coordinates
		var swordlen = 100;
		var swordx = player.x + swordlen*Math.cos(player.orientation);
		var swordy = player.y + swordlen*Math.sin(player.orientation);
		
    for (var i=0; i<boxes.length; i+=1) {
			var b = boxes[i];
			var d = Math.sqrt(Math.pow(swordx-b.x,2)+Math.pow(swordy-b.y,2));
			
			if (d < 80) { // distance from box to sword
					toDelete.push(i);
			}
		}
		// delete boxes in toDelete
		for (var j=0; j<toDelete.length; j+=1) {
			boxes.splice(toDelete[j],1);
		}
		
  }, false);

  setInterval(createBox, 1000); 
   
	gameArea.start();
}

window.onload = function() {
		generateBoxes = true;
}


window.onblur = function () { // do not load boxes 
		generateBoxes = false;
}

window.onfocus = function() {
	generateBoxes = true;
}






