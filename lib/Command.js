const { SlashCommandBuilder } = require('discord.js');

class Command {
    constructor(name, description){
        if(!name || !description) return
        this.command = new SlashCommandBuilder()
            .setName(name)
            .setDescription(description)
    }
    build(func){
        return {
            data: this.command,
            execute: func,
        }
    }
}

module.exports = Command
