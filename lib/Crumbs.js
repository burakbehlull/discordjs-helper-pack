const { UserSelectMenuBuilder, ActionRowBuilder,
    ActivityType, Collection } = require("discord.js")
const path = require('path')
const fs = require('fs')
class Crumbs {
    randomColor() {
        return Math.floor(Math.random() * (0xffffff + 1))
    }
}
class UserSelectBox {
    constructor(id, placeholder, max, min, disabled,setUsers,addUsers){
        if(!id || !placeholder) return
        this.id = id
        this.placeholder = placeholder
        this.select = new UserSelectMenuBuilder()
            .setCustomId(id)
            .setPlaceholder(placeholder)
        if(max) this.select.setMaxValues(max)
        if(min) this.select.setMinValues(min)
        if(disabled) this.select.setDisabled(disabled)
        if(setUsers) this.select.setDefaultUsers(setUsers)
        if(addUsers) this.select.addDefaultUsers(addUsers)
    }

    build(){
        return this.select
    }
}

class ButtonAction {
    constructor(interaction){
        if(!interaction) return
        this.interaction = interaction
        const filter = i => i.user.id === this.interaction.user.id
        this.collector = this.interaction.channel.createMessageComponentCollector({ filter, time: 60000 })
    }
    async on(func){
		await this.collector.on('collect', async interaction => {
            await func(interaction)
        })
        return;
    }
    async end(func){
        this.collector.on('end', async collected => {
            await func(collected)
        })
        return
    }
}

class ModalAction {  
    async on(func){
        await client.on('interactionCreate', async interaction => {
            if(interaction.isModalSubmit()){
                await func(interaction)
            }
        })
        return;
    }
}

function ActionRow(...childrens){
    const rows = childrens.map((component) => new ActionRowBuilder().addComponents(component))
    return rows
}

function Configuration({
    client=null,
    dirname=undefined,
    eventsFileName=undefined,
    commandsFileName=undefined,
    chatInputCommand=false,
    prefixCommandsFileName=undefined,
    prefix= undefined
}){
    if(!dirname) return console.log('[ERROR]: dirname is undefined')
    if(eventsFileName){
        const eventsPath = path.join(dirname, eventsFileName)
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'))
        
        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file)
            const event = require(filePath)
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, ActivityType))
            } else {
                client.on(event.name, (...args) => event.execute(...args, client))
            }
        }
        console.log(`${eventFiles.length} events has been loaded.`)


        
    }
    if(!client) return console.log('[ERROR]: in configuration to client is undefined')
    client.commands = new Collection()
    if(commandsFileName){
        const commandsPath = path.join(dirname, commandsFileName);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
        
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file)
            const command = require(filePath)
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command)
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
            }
        }
        console.log(`${commandFiles.length} commands has been loaded.`)

    }
    if(chatInputCommand){
        client.on('interactionCreate', async (interaction)=>{
            if (!interaction.isChatInputCommand()) return;

            const command = interaction.client.commands.get(interaction.commandName);
    
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
    
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Error executing ${interaction.commandName}`);
                console.error(error);
            }
        })
    }
    if(prefix && prefixCommandsFileName){
        const commands = []

        fs.readdir(dirname+`/${prefixCommandsFileName}/`, (err, files)=>{
            files.forEach(f => {
                let props = require(dirname+`/${prefixCommandsFileName}/${f}`);
                
                commands.push(props)
            })
        })
        
        client.on('messageCreate', async (message)=> {
            if(message.author.bot) return
        
            let input = message.content.split(" ")[0].slice(prefix?.length);
            let f = commands.find(c => c.command == input)
            let args = message.content.split(' ')
            let helpers = {
                client: client,
                getArgs: (arg=1)=> {
                    return args[arg]
                },
                getUser: ()=> {
                    if(args==undefined) return
                    return message?.author.id
                },
                bot: ()=>{
                    if(args==undefined) return
                    return message?.author.bot
                }
            }
            if(f?.enabled){
                await f?.execute(message, helpers)
            } else return
        })
    }
}

module.exports = {
    Crumbs,
    UserSelectBox,
    ButtonAction,
    ModalAction,
    ActionRow,
    Configuration
}

