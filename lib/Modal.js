const { ModalBuilder, TextInputStyle, TextInputBuilder, ActionRowBuilder } = require("discord.js")

class Modal {
    constructor(customId, title){
        if(!customId || !title) return;
        this.customId = customId
        this.title = title
        this.inputs = []
        this.modal = new ModalBuilder()
            .setCustomId(customId)
            .setTitle(title)
    }
    add(customId, label, value, props= {
        paragraph: false,
        required: undefined,
        placeholder: undefined, 
        max: undefined, 
        min: undefined,
    }){
        if(!customId || !label) return;
        const input = new TextInputBuilder()
            .setCustomId(customId)
            .setLabel(label)
        if(props?.paragraph){
            input.setStyle(TextInputStyle.Paragraph)
        } else {
            input.setStyle(TextInputStyle.Short)
        }
        if(value) input.setValue(value)
        if(props?.placeholder) input.setPlaceholder(placeholder)
        if(props?.required) input.setRequired(required)
        if(props?.max) input.setMaxLength(max)
        if(props?.min) input.setMinLength(min)
        this.inputs.push(input)
        return;
    }
    build(){
		const rows = this.inputs.map((component) =>
            new ActionRowBuilder().addComponents(component),
        )
        return this.modal.addComponents(...rows)
    }
}

module.exports = Modal