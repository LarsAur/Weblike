class MenuState extends GameState {

    on_enter(data) {
        if (data) { }
        this.selection = 0
    }

    tick() {
        this.renderer.draw_string("Play", 0, 16)
        this.renderer.draw_string("Options", 0, 26)
        this.renderer.draw_string("Credits", 0, 36)

        this.renderer.draw_ui_element("arrow", 48, 16 + 10 * this.selection)

        if (this.input_handler.is_key_pressed("s")) {
            this.selection = this.mod(this.selection + 1, 3)
        }

        if (this.input_handler.is_key_pressed("w")) {
            this.selection = this.mod(this.selection - 1, 3)
        }

        if (this.input_handler.is_key_pressed("Enter")){
            switch(this.selection){
                case 0: this.gamestate_manager.set_gamestate("play")
                break
            }
        }
    }

    on_exit(data) {
        if (data) { }
    }

    mod(n,m){
        return (n % m + m)%m
    }
}