const { EmbedBuilder } = require("@discordjs/builders");

class MessageSender {
    constructor(client){
        if(!client) return;
        this.client = client

    }
    embed(title, color=0x0099FF, footer){
        const guild = this.client;
        const IFooter = footer ?? { text: guild.user.displayName, iconURL: guild.user.avatarURL()}
        const IEmbed = new EmbedBuilder()
            .setTitle(title)            
            .setColor(color)
            .setFooter(IFooter)
        return IEmbed
    }
    async send(embed, id, ...components){
        const guild = this.client
        if(id){
            const channel = guild.channels.cache.get(id)
            return await channel.send({ embeds: [embed], components: components })
        }
        return await guild.reply({ embeds: [embed], components: components })

    }
    async sendContent(content, id, ...components){
        if(!content) return
        const guild = this.client
        if(id){
            const channel = guild.channels.cache.get(id)
            return await channel.send({
                content: content,
                components: components,
            })
        }
        await guild.reply({
            content: content,
            components: components,
        })
    }

}

module.exports = MessageSender