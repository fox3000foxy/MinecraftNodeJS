// helper function
  var socket = io();
const RADIUS = 20;
let pointUsed = false

function degToRad(degrees) {
  var result = Math.PI / 180 * degrees;
  return result;
}

function escapeMCMenu(){
	if(inv==true) return;
	if(chatDisp==true) return;
	escapeMenu.style.display = "block"
	bgOverlay.style.display = "block"
	cible.style.display = "none"
}

function hideEscapeMenu(){
	escapeMenu.style.display = "none"
	bgOverlay.style.display = "none"
	cible.style.display = "block"
}
let chatTime;
function Chat(){
	if(inv==true) return;
	tchatSender.style.display = "block"
	tchatSender.focus()
	tchatContainer.style.display = "flex"
	document.exitPointerLock()
	if(chatTime!=undefined)
	clearTimeout(chatTime)
}

function hideChat(){
	tchatSender.style.display = "none"
	canvas.requestPointerLock()
	chatTime = setTimeout(()=>{tchatContainer.style.display = "none"},5000)
}

function displayChat(){
	chatDisp = chatDisp==true?false:true
	if(chatDisp==true){
		Chat()
	}
	else hideChat()
}
chatDisp=false

// setup of the canvas

var canvas = document.getElementById('canvas');
var bgOverlay = document.getElementById('bgOverlay');
var overlay = document.getElementById('overlay');
var inventory = document.getElementById('inventory');
var escapeMenu = document.getElementById('MCEscapeMenu');
var cible = document.getElementById('cible');
var tchatSender = document.getElementById('tchat-sender');
var tchatContainer = document.getElementById('tchat-container');

// pointer lock object forking for cross browser

canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

function historyUp()
{
	if(chatDisp==false || history.length <1) return
	if(historyIndex>0)
	historyIndex--
	elem.value = historyArray[historyIndex]
}

function historyDown()
{
	if(chatDisp==false || history.length <1) return
	if(historyIndex<historyArray.length-1)
	historyIndex++
	elem.value = historyArray[historyIndex]
}

document.body.onkeydown = function() {
	switch(event.keyCode){
		case 38: if(chatDisp==false)socket.emit("forward",true);if(chatDisp==true) historyUp();break;
		case 40: if(chatDisp==false)socket.emit("back",true);if(chatDisp==true) historyDown();break;
		case 39: if(chatDisp==false)socket.emit("left",true);break;
		case 37: if(chatDisp==false)socket.emit("right",true);break;
		case 16: if(chatDisp==false)socket.emit("sprint",true);break;
		case 17: if(chatDisp==false)socket.emit("sneak",true);break;
		
		case 35: if(chatDisp==false)socket.emit("jump",true);break;
		case 73: displayInv();break;
		case 13: displayChat();break;
		case 65: if(chatDisp==false) socket.emit("toss",null);break;
		
		case 49: if(chatDisp==false) socket.emit("equip",hotbar[0].name);break;
		case 50: if(chatDisp==false) socket.emit("equip",hotbar[1].name);break;
		case 51: if(chatDisp==false) socket.emit("equip",hotbar[2].name);break;
		case 52: if(chatDisp==false) socket.emit("equip",hotbar[3].name);break;
		case 53: if(chatDisp==false) socket.emit("equip",hotbar[4].name);break;
		case 54: if(chatDisp==false) socket.emit("equip",hotbar[5].name);break;
		case 55: if(chatDisp==false) socket.emit("equip",hotbar[6].name);break;
		case 56: if(chatDisp==false) socket.emit("equip",hotbar[7].name);break;
		case 57: if(chatDisp==false) socket.emit("equip",hotbar[8].name);break;
	}
}
document.body.onkeyup = function() {
	switch(event.keyCode){
		case 38: socket.emit("forward",false);break;
		case 40: socket.emit("back",false);break;
		case 39: socket.emit("left",false);break;
		case 37: socket.emit("right",false);break;
		case 16: socket.emit("sprint",false);break;
		case 17: socket.emit("sneak",false);break;
		
		
		case 27: menu();break;
	}
}
overlay.onclick = ()=>{
	if(inv==true) return;
	canvas.requestPointerLock()
	pointUsed=true
}

function menu(){
	if(document.pointerLockElement === canvas || document.mozPointerLockElement === canvas)
	document.exitPointerLock()
	else
	returnInGame()
}

function returnInGame(){
	if(inv==true) return;
	canvas.requestPointerLock()
	pointUsed=true
}

function Block(){
	//console.log(event.button)
	if (event.button == 0)
	socket.emit("dig","")
	else
	socket.emit("place","")
}
// pointer lock event listeners

function displayInv(){
	if(chatDisp==true) return;
	inv = inv==false?true:false
	if (inv==false){
		canvas.requestPointerLock()
		inventory.style.display = "none"
			pointUsed=true
	}
	else {
		document.exitPointerLock()
		inventory.style.display = "block"
			pointUsed=false
	}
}
inv = false

// setInterval(()=>{
	// console.log(pointUsed)
// },500)

document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

function lockChangeAlert() {
  if (document.pointerLockElement === canvas || document.mozPointerLockElement === canvas) {
	  hideEscapeMenu()
	  document.addEventListener("mousemove", updatePosition, false);
	  document.addEventListener("click", Block, false);
	  }
  else {
		pointUsed=false
		escapeMCMenu()
	  document.removeEventListener("mousemove", updatePosition, false);
	  document.removeEventListener("click", Block, false);
	  }
}

var tracker = document.getElementById('tracker');
function updatePosition(e) {
  socket.emit('x', e.movementX);
  socket.emit('y', e.movementY);
}



