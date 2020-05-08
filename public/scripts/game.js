
var game = undefined
document.addEventListener("DOMContentLoaded", () => {
    game = new Game()
    game.init()

    setInterval(() => game.tick(), 1000 / 60)
})

class Game {

    init() {
        console.log("DOM elements loaded")
        this.gamestate_manager = new GamestateManager()
        this.renderer = new Renderer()
        this.input_handler = new InputHandler()

        this.menu_state = new MenuState(this.gamestate_manager, this.renderer, this.input_handler)
        this.play_state = new PlayState(this.gamestate_manager, this.renderer, this.input_handler)

        this.gamestate_manager.register_gamestate("menu", this.menu_state)
        this.gamestate_manager.register_gamestate("play", this.play_state)

        this.gamestate_manager.set_gamestate("menu")
        console.log("Game initialized")
    }

    tick() {
        this.renderer.clear()
        this.gamestate_manager.tick_current_gamestate()
        this.input_handler.tick() //logs current keys down as prev keys down, call at end of loop
    }
}

