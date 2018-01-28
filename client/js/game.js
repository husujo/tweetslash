
 

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

////////////////////////////////// SOCKETS ^^^^^^^^^ ///////////////////////////////////

var player;
var boxes = [];
const width = window.innerWidth;
const height = window.innerHeight;
var dist = Math.max(width,height)*1.5;
var slow = 800;
var mousex=0;
var mousey=0;
var lightsaberImg;
var slashImg;
var explosionImg;
var whitehouseImg;
var slashes = []; // the list of slashes present to be drawn
var explosions = [];
var trumpPic;
var intenseTrump;
var generateBoxes;
var health = 90;
var score = 0;
var audio = new Audio('/sounds/stab.mp3');
audio.volume = 1;
audio.playbackRate = 2;
var song = new Audio('/sounds/freebird.mp3');
song.volume = 0.6;
song.play();
var china = new Audio('/sounds/china.mp3');
china.volume = 0.2;
china.playbackRate = 1.3;

var directions = true;
var gameover = false;
var directionsText = "";//"Click to slash the trump tweets!\nNeed 20 points to build the wall";


// load the player sprites
var player_sprites = ['down1.png','down2.png','down3.png','left1.png','left2.png','left3.png','right1.png','right2.png','right3.png','top1.png','top2.png','top3.png'];
for (var s=0; s<player_sprites.length; s+=1) {
	var tmp = player_sprites[s];
	player_sprites[s] = new Image();
	player_sprites[s].src = 'img/sprites/'+tmp;
}


var gameArea = {
	canvas : document.getElementById("myCanvas"),
  prep : function() {
		this.canvas.width = width;
		this.canvas.height = height;    
		this.context = this.canvas.getContext("2d");
		var ctx = gameArea.context;
		ctx.fillStyle = "48pt Calibri";
		ctx.fillText(directionsText,100,100);
		//document.body.insertBefore(this.canvas, document.body.childNodes[0]); // ?
  },
	start : function() {
    this.interval = setInterval(this.update, 5);
	},
	clear : function() {
		this.context.clearRect(0, 0, width, height);
	},  
  // function to use to update the game area. lots happens here
  update : function() { 
		document.getElementById("tut").style.display = "none";
    gameArea.clear();
    var ctx = gameArea.context; 
		
		ctx.globalAlpha = 0.5;
		ctx.drawImage(whitehouseImg,0,0,width,height);
		ctx.globalAlpha = 1;
		
		
    player.update(width/2,height/2,mousex,mousey);
    
    // draw the boxes
    for (var i=0; i<boxes.length; i++) {
      outofboundsCheck(boxes[i]); // is the box in the canvas?
      var b = boxes[i];
      if (b.display === true) {
				updateBox(b);
      }
      boxes[i].x+=b.vx;
      boxes[i].y+=b.vy;
    }
    // remove a box from the list if there are any finished boxes
    var remove = -1;
    for (var j=0; j< boxes.length; j+=1) {
      if (boxes[j].done === true) {
        remove = j;
        break;
      }
    }
    if (remove > -1) {
      boxes.splice(j, 1);
    }
		
		// draw the slashes
		var rem = [];
		for (var l=0; l<slashes.length; l+=1) {
			ctx.drawImage(slashImg,slashes[l].x,slashes[l].y,100,100);
			slashes[l].time -= 1;
			if (slashes[l].time <= 0) {
				rem.push(l);
			}
		}
		for (var r=0; r<rem.length; r+=1) {
			slashes.splice(rem[r],1);
		}
		
		var erem = [];
		for (var e=0; e<explosions.length; e+=1) {
			ctx.drawImage(explosionImg,explosions[e].x+25,explosions[e].y+25,100,100);
			explosions[e].time -=1;
			if (explosions[e].time <= 0) {
				erem.push(e);
			}
		}
		for (var er=0; er<erem.length; er+=1) {
			explosions.splice(erem[er],1);
		}
		
		if (directions===true) {
			ctx.fillStyle = "48pt Calibri";
			ctx.fillText(directionsText,100,100);
		}
		
		
  }

}

function Player() {
  var pl = {};
	pl.width = 70;
	pl.height = 70;
	pl.x = width/2-pl.width/2;
	pl.y = height/2-pl.height/2;
  pl.orientation = 0; // 0 to 2pi
	pl.pic = player_sprites[6]; // the current sprite of the player. start with passive right facing.
	pl.picnum = 6;
	pl.update = function(x,y,mx,my) {
    pl.x=x-pl.width/2;
    pl.y=y-pl.height/2;
    
		var negx = (mx-x < 0) ? true : false;
		var negy = (my-y < 0) ? true : false;
    var angle = Math.atan((my-y)/(mx-x));
		pl.orientation = (!negx && negy) ? angle+Math.PI+Math.PI : (negx) ? angle + Math.PI : angle;
		//console.log(pl.orientation);
       
    ctx = gameArea.context;
    ctx.save();
    ctx.translate( width/2, height/2 );
    ctx.rotate( pl.orientation );
    ctx.translate( -pl.width/2, -pl.height/2 );
// 		console.log("drawing player sprite ,",pl.picnum);
		ctx.drawImage(pl.pic,0,0,pl.width,pl.height);
		ctx.drawImage(lightsaberImg,50,10,100,10);
    ctx.restore();

	}
  return pl;
}

function swing(picnum) {
// 	console.log("swing");
	setPlayerSprite(picnum+1);
	setTimeout(function() {setPlayerSprite(picnum+2);},100);
	setTimeout(function() {setPlayerSprite(picnum);},200);
}
function setPlayerSprite(sprite_index) {
// 	console.log("swing",sprite_index);
	player.pic = player_sprites[sprite_index];
}

function Box(text, angle) {
  this.height=30;
  this.width=250;
  this.angle=angle; // make this random
  this.x=player.x+(dist*Math.cos(angle))-this.width/2;
  this.y=player.y+(dist*Math.sin(angle))-this.height/2;
  //console.log("box: x=",this.x,"y=",this.y);
  var tmpx = player.x-this.x;
  var tmpy = player.y-this.y;  
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

function updateBox(box) {
	var px = box.x-box.width/2;
  var py = box.y-box.height/2;
  var dx = 400;
  var dy = 120;
  
  function wrapText(context, text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';

        for(var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = context.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
          }
          else {
            line = testLine;
          }
        }
        context.fillText(line, x, y);
      }
      
      var ctx = gameArea.context;

      ctx.font = '18pt Calibri';
      ctx.fillStyle = '#333';
      ctx.fillStyle = "pink";
      ctx.fillRect(px,py,dx,dy);
      ctx.fillStyle = "black";
      wrapText(ctx, box.text, px+70, py+30, 350, 20);
    	ctx.drawImage(intenseTrump, px, py, 70, 85);
	
			var d = Math.sqrt(Math.pow(player.x-box.x,2)+Math.pow(player.y-box.y,2));
			if (d < 5) {
					// hit!
				console.log("got hit!");
				health -= 5;
				var bar = document.getElementById("bar");
				bar.style.width = (health+"%");
				
				if (health < 30) {
					bar.style.backgroundColor = "red";
				}
				box.done = true;
				// explode
				china.play();
				explosions.push({'x':box.x-50,'y':box.y-50,'time':70});
				
			}
	
}


      


function init() {
	
	
	
	whitehouseImg = new Image();
	whitehouseImg.src = "/img/whitehouse.jpg";
	//trumpPic = new Image();
  //trumpPic.src = "https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_400x400.jpg";
	intenseTrump = new Image();
	intenseTrump.src = "/img/intensetrump.png";
	lightsaberImg = new Image();
	lightsaberImg.onerror = function() {
		console.log("image is broken");
	}
	lightsaberImg.src = '/img/lightsaber1.png'
	slashImg = new Image();
	slashImg.src = "/img/slash.png";
	explosionImg = new Image();
	explosionImg.src = "/img/explosion.png";
	
	
	
  gameArea.prep();
	
	
	
	
	player = Player();
	
	
  
  // get mouse coortinates for rotation
  gameArea.canvas.addEventListener('mousemove', function(evt) { 
    var mousePos = getMousePos(gameArea.canvas, evt); 
    mousex = mousePos.x;
    mousey = mousePos.y;
  }, false);
	gameArea.canvas.addEventListener('click', function(evt) {
		
		swing(player.picnum);
// 		console.log(player.orientation);
		var toDelete = [];
		
		// calculate sword coordinates
		var swordlen = 100;
		var swordx = player.x + swordlen*Math.cos(player.orientation);
		var swordy = player.y + swordlen*Math.sin(player.orientation);
		
    for (var i=0; i<boxes.length; i+=1) {
			var b = boxes[i];
			var d = Math.sqrt(Math.pow(swordx-b.x,2)+Math.pow(swordy-b.y,2));
			
			if (d < 80) { // distance from box to sword
				  //gameArea.context.drawImage(slashImg,b.x-50,b.y-50,100,100);
					audio.play();
				  score += 1;
					var sc = document.getElementById("score");
					sc.innerHTML = "score:"+score;
					slashes.push({'x':b.x-50,'y':b.y-50,'time':100}); // the array of slashes to render during the update function
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




window.onblur = function () { // do not load boxes 
		generateBoxes = false;
}

window.onfocus = function() {
	generateBoxes = true;
}






