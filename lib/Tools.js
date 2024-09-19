const { GatewayIntentBits } = require('discord.js');
class Tools {
    ItentsAll(){
        return Object.keys(GatewayIntentBits).map((intent) => GatewayIntentBits[intent])
    }
}

module.exports = Tools