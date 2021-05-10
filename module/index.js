//Backend
function createClient(bot,port1,port2,port3){
	const express = require('express');
	const app = express();
	const http = require('http');
	const server = http.createServer(app);
	const { Server } = require("socket.io");
	const io = new Server(server);
	const mineflayer = require('mineflayer')
	const mineflayerViewer = require('prismarine-viewer').mineflayer
	const inventoryViewer = require('mineflayer-web-inventory')
	const Vec3 = require('vec3')
	const fs = require('fs')
	let mcData;
	let mcAssets;
	const thePort = port1 || 3000

	const faceToDirection = [
	new Vec3(0,-1,0), // BOTTOM
	new Vec3(0,1,0), // TOP
	new Vec3(0,0,-1), // NORTH
	new Vec3(0,0,1), // SOUTH
	new Vec3(-1,0,0), // WEST
	new Vec3(1,0,0), // EAST
	]

	bot.on('login', () => {
		 mcAssets= require('minecraft-assets')(bot.version)
			if(bot.webInventory)
			bot.webInventory.stop()
			if(bot.viewer)
			bot.viewer.close()
		mineflayerViewer(bot, { port: port2||3001, firstPerson : true}) // Start the viewing server on port 3000
		let options = {
			port: port3||3002,
		}
		inventoryViewer(bot, options)
		mcData = require('minecraft-data')(bot.version)
		bot.on('message',(msg)=>{
			io.emit("msg",msg.toString())
		})
	})

	app.get('/',(req,res)=>{
	res.sendFile(__dirname.split("module")[0]+"/public/ingame.html")
	})
	app.use(express.static('public'))

	io.on('connection', (socket) => {
	  socket.on('version', (msg) => {
		io.emit('version', bot.version);
	  });
	  socket.on('chat', (msg) => {
		  if(msg.indexOf("!select ")!=-1){
			  bot.equip(mcData.itemsByName[msg.split(" ")[1]].id, "hand")
			  return
		  }
		bot.chat(msg);
	  });
	  socket.on('quitGame', (msg) => {
		process.exit(0);
	  });
	  socket.on('splash', (msg) => {
		fs.readFile('./public/assets/splashes.json', 'utf8', function(err, data){
		io.emit("splashAwn",data)
		})
	});
	  socket.on('y', (msg) => {
	  bot.look(bot.entity.yaw,bot.entity.pitch-(parseInt(msg)/100))
	  });
	  socket.on('x', (msg) => {
	  bot.look(bot.entity.yaw-(parseInt(msg)/100),bot.entity.pitch)
	  });
	  socket.on('forward', (msg) => {
	  bot.setControlState('forward',msg)
	  });
	  socket.on('back', (msg) => {
	  bot.setControlState('back',msg)
	  });
	  socket.on('left', (msg) => {
	  bot.setControlState('left',msg)
	  });
	  socket.on('right', (msg) => {
	  bot.setControlState('right',msg)
	  });
	  socket.on('sprint', (msg) => {
	  bot.setControlState('sprint',msg)
	  });
	  socket.on('jump', (msg) => {
	  bot.setControlState('jump',true)
	  bot.setControlState('jump',false)
	  });
	  socket.on('sneak', (msg) => {
	  bot.setControlState('sneak',msg)
	  });
	  
	  socket.on('health', (msg) => {
	  io.emit('health',bot.health)
	  });
	  socket.on('food', (msg) => {
	  io.emit('food',bot.food)
	  });
	  socket.on('heldItem', (msg) => {
	  io.emit('heldItem',bot.heldItem)
	  });
	  socket.on('inventory', (msg) => {
	  io.emit('inventory',bot.inventory)
	  });
	  socket.on('toss', (msg) => {
	  bot.toss(bot.heldItem.type,null,1)
	  });
	  socket.on('equip', (msg) => {
		bot.equip(mcData.itemsByName[msg].id, "hand")
	  });
	  socket.on('dig', (msg) => {
		  let block = bot.blockAtCursor(maxDistance=5)
		  if(block!=undefined&&block!=null)
			bot.dig(block,false)
		else
			bot.attack(bot.nearestEntity())
	  });
	  socket.on('place', (msg) => {
		  block = bot.blockAtCursor(maxDistance=5)
		  if(block!=null)
			bot.placeBlock(block, faceToDirection[block.face])
	  });
	  socket.on('blockTexture', (msg) => {
		  if(mcAssets.textureContent[msg]!=undefined)
		io.emit('blockTexture',mcAssets.textureContent[msg].texture)
	  });
	});

	server.listen(thePort, () => {
	  console.log('listening on *:'+thePort);
	});

	// App
	if (process.argv[0].indexOf("electron")!=-1){
	const electron = require('electron');
	const appli = electron.app;
	const BrowserWindow = electron.BrowserWindow;
	const Tray = electron.Tray;

	function createWindow () {

	  mainWindow = new BrowserWindow({
		width: 1200,
		height: 900,
		icon: './public/favicon.png',
		maximized: true,
		transparent: false
	});
	  mainWindow.loadURL('http://localhost:'+thePort); // on doit charger un chemin absolu

	  mainWindow.on('closed', () => {
		mainWindow = null;
	  });
	}

	appli.on('ready', createWindow);
	appli.on('window-all-closed', () => {
	  if (process.platform !== 'darwin') {
		appli.quit();
	  }
	});

	  appli.on('browser-window-created',function(e,window) {
		  window.setMenu(null);
	  });
	}
}

exports.createClient = createClient