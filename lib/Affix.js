class Affix {
    constructor(name, description, usage){
        if(!name) return
        this.name = name
        this.description = description
        this.usage = usage
    }
    build(commandName, func, enable=true){
        return {
            name: this.name,
            description: this.description,
            usage: this.usage,
        
            command: commandName,
            enabled: enable,
            execute: func,
        }
    }
}

module.exports = Affix