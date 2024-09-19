class Event {
    constructor(name, once=false){
        this.name = name
        this.once = once
    }

    build(func){
        return {
            name: this.name,
            once: this.once,
            execute: func
        }
    }
}

module.exports = Event