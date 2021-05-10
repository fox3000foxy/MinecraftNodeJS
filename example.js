const mineflayer = require('mineflayer')
const createClient = require('./module').createClient
//Create a bot
const bot = mineflayer.createBot({
	username: "MinecraftJS",
	port: 6257
})

//Connect a client to an existing bot
createClient(bot)