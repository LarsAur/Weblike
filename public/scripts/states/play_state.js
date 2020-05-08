class PlayState extends GameState {

    on_enter(data) {
        if (data) {
            this.RNG = new RNG(data.seed)
        } else {
            this.RNG = new RNG()
        }

        this.floor_size = 7
        this.room_size = 9
        this.tile_size = 16
        this.canvas_size = 300
        this.view_height = 250

        this.floor = new Floor(this.floor_size, this.room_size, this.RNG.next_float())
        this.floor.generate_floor()
        this.floor.populate()

        this.player = new Player(
            (this.room_size - 1) * this.floor_size / 2,
            (this.room_size - 1) * this.floor_size / 2,
            this.floor,
            this.input_handler
        )

        this.center_camera_on_player()
        this.tick_timer = 0
    }

    center_camera_on_player() {
        this.offsetx = -this.player.x * this.tile_size + this.canvas_size / 2 - this.tile_size / 2
        this.offsety = -this.player.y * this.tile_size + this.view_height / 2 - this.tile_size / 2
    }

    tick() {

        if (this.input_handler.is_key_pressed("Escape")) {
            this.gamestate_manager.set_gamestate("menu")
        }

        if (this.input_handler.is_key_pressed("r")) {
            this.floor.generate_floor()
            this.floor.populate()
            this.center_camera_on_player()
            this.player.reset()
            this.tick_timer = 0
        }

        this.player.tick()
        this.center_camera_on_player()

        let letter_to_tile_index = new Map()
        letter_to_tile_index.set("h1", 1)
        letter_to_tile_index.set("h2", 4)
        letter_to_tile_index.set("v", 0)
        letter_to_tile_index.set("n1", 2)
        letter_to_tile_index.set("n2", 5)
        letter_to_tile_index.set("r", 3)

        for (let x = 0; x < this.floor_size * this.room_size; x++) {
            for (let y = 0; y < this.floor_size * this.room_size; y++) {
                // Only redering things inside the canvas
                if (this.floor.get(x, y)) {
                    if (x * this.tile_size + this.offsetx >= -this.tile_size && x * this.tile_size + this.offsetx < this.canvas_size + this.tile_size) {
                        if (y * this.tile_size + this.offsety >= -this.tile_size && y * this.tile_size + this.offsety < this.view_height) {
                            this.renderer.draw_tile(letter_to_tile_index.get(this.floor.get(x, y)), x * this.tile_size + this.offsetx, y * this.tile_size + this.offsety)

                            /*if(this.floor.distance_map){
                                if(this.floor.distance_map[x][y] !== Infinity){
                                    this.renderer.draw_string(this.floor.distance_map[x][y] + "", x * this.tile_size + this.offsetx, y * this.tile_size + this.offsety)
                                }
                            }*/
                        }
                    }
                }
            }
        }

        for (let enemy of this.floor.enemies) {
            this.renderer.draw_character(this.renderer.merlock, undefined, 0, enemy.x * this.tile_size + this.offsetx, enemy.y * this.tile_size + this.offsety)
        }

        this.tick_timer += 0.03
        if (this.tick_timer >= 1) {
            this.tick_timer %= 1
            this.on_tick_timer()
        }

        this.renderer.draw_character(this.renderer.player_character, this.player.direction, 0, this.player.x * this.tile_size + this.offsetx, this.player.y * this.tile_size + this.offsety)

        this.renderer.draw_fog()

        this.renderer.draw_ui_element("inventory", 0, 250)
        this.renderer.draw_ui_element("time_bar", 286, 257)
        this.renderer.draw_rect(288, 290, 3, -30 * this.tick_timer)


    }

    on_tick_timer() {
        this.floor.move_enemies_towards(this.player.x, this.player.y)
    }

    on_exit(data) {
        if (data) { }
    }

}