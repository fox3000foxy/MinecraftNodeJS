# Minecraftjs _by fox3000foxy_
## Short description
Minecraft client running in [NodeJS](https://nodejs.org/en/download/)<br>
He can be used like module or like minecraft client.<br><br>

## Installation
### Like client
For install minecraftjs like client:
```bash
npm i -g minecraftjs (not if already installed)
```
### Like module
For install for use minecraftjs like a module like example:
```bash
npm i minecraftjs (not if already installed)
```

## How to use
### Like Client
When it installed globally, you can use `minecraft` command for launch my nodejs minecraft client.<br>
He can connect to server without mods and offline mode. Auth will be added maybe later...<br><br>

`Singleplayer` will connect you to your personal flying-squid server.<br>
`Multiplayer` purpose you a list of servers, which you can change in `public/assets/serverList.json`. Click on a server for connect to him.<br>
`Options` is just here for decroation for the moment.<br><br>

### Like module
```js
const mineflayer = require('mineflayer')
const createClient = require('./module').createClient
//Create a bot
const bot = mineflayer.createBot({
	username: "MinecraftJS",
	port: 6257
})

//Connect a client to an existing bot
createClient(bot)
```

Copy & paste this example for connect a client to an existing bot.

## Controls
### In game
`Arrows` for move,<br>
`I` for inventory,<br>
`Enter` for chat,<br>
`RShift` for sprint,<br>
`RCtrl` for sneak,<br>
`End` for jump,<br>
`A` for drop the selected item,<br>
`1-9` for select the item (or `!select <item_string_id>` in chat for select the item),<br><br>

### In chat
`Enter` for send a message,<br>
`ArrowUp` for go up in history of sended messages or commands,<br>
`ArrowDown` for go down in history of sended messages or commands,<br>

## About
There are some bugs, so issue me if you caught one for correct them...
