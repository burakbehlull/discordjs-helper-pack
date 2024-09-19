const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js")


class TextSelectBox {
    constructor(customId, placeholder){
        this.customId = customId
        this.placeholder = placeholder
        this.options = []
        this.select = new StringSelectMenuBuilder()
        .setCustomId(this.customId)
        .setPlaceholder(this.placeholder)
    }
    optionComponent(label, value, description, boxDefault, emoji){
        const option = new StringSelectMenuOptionBuilder()
        .setLabel(label)
        .setValue(value)
        if(description) option.setDescription(boxDefault)
        if(emoji) option.setEmoji(emoji)
        if(boxDefault) option.setDefault(boxDefault)
        
        return option
    }
    add(label, value, description, boxDefault, emoji){
        this.options.push(this.optionComponent(label, value, description, boxDefault, emoji))
    }
    build(){
        return this.select.addOptions(...this.options)
    }
}

module.exports = TextSelectBox