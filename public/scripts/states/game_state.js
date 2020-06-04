class GameState{

    constructor(gamestate_manager, renderer, input_handler, audio_manager){
        this.gamestate_manager = gamestate_manager
        this.renderer = renderer
        this.input_handler = input_handler
        this.audio_manager = audio_manager
    }

    on_enter(data){
        throw new Error("on_enter not implemented")
    }

    tick(){
        throw new Error("tick not implemented")
    }
    
    on_exit(data){
        throw new Error("on_exit not implemented")
    }

}