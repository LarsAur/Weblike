class GamestateManager {

    constructor(gamestate){
        this.current_gamestate_name = undefined
        this.name_to_gamestate = new Map()
    }

    set_gamestate(gamestate_name, data) {
        this.current_gamestate_name = gamestate_name
        console.log("set state: " + this.current_gamestate_name)
        this.get_current_gamestate().on_enter(data)
    }
    
    tick_current_gamestate(){
        this.get_current_gamestate().tick()
    }

    register_gamestate(name, gamestate){
        this.name_to_gamestate.set(name, gamestate)
    }

    get_current_gamestate_name(){
        return this.current_gamestate_name
    }

    get_current_gamestate(){
        return this.name_to_gamestate.get(this.current_gamestate_name)
    }
    


}
