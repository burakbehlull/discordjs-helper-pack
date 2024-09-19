class EmojiReact {
    constructor(content, channelId, interaction){
        if(!content) return
        this.content = content
        this.channelId = channelId
        this.interaction = interaction
        
    }
    async build(emoji, reactionAdd, reactionRemove, reactionUpdate){
        if(!emoji || reactionAdd) return
        let msj;
        if(this.channelId){
            const getChannel = await this.interaction.channels.cache.get(this.channelId)
            msj = await getChannel.send(this.content)
        } else {
            msg = this.interaction.reply(this.content) 
        }
        await msj.react(emoji)
        if(reactionAdd){
            client?.on('messageReactionAdd', async (reaction, user)=>{  
                if (reaction.emoji.name === emoji && reaction.message.id === msj.id) {
                    reactionAdd(reaction, user)
                }
            })
        }
        if(reactionRemove){
            client?.on('messageReactionRemove', (reaction, user) => {
                if (reaction.emoji.name === emoji && reaction.message.id === msj.id) {
                    reactionRemove(reaction, user)
                }
            })
        }
        if(reactionUpdate){
            client?.on('messageReactionUpdate', (reaction, user) => {
                if (reaction.emoji.name === emoji && reaction.message.id === msj.id) {
                    reactionUpdate(reaction, user)
                }
            })
        }


        return;
        
    }
}

module.exports = EmojiReact