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

        this.floor = new Floor(this.floor_size, this.room_size, this.RNG.next_float(), this.audio_manager)
        this.floor.generate_floor()
        this.floor.populate()

        this.player = new Player(
            (this.room_size - 1) * this.floor_size / 2,
            (this.room_size - 1) * this.floor_size / 2,
            this.floor,
            this.input_handler,
            this.renderer,
            this.audio_manager
        )

        this.center_camera_on_player()
        this.tick_timer = 0
        this.time_step = 0 // Increases by 1 for each tick
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

        for (let x = 0; x < this.floor_size * this.room_size; x++) {
            for (let y = 0; y < this.floor_size * this.room_size; y++) {
                // Only redering things inside the canvas
                if (this.floor.get(x, y)) {
                    if (x * this.tile_size + this.offsetx >= -this.tile_size && x * this.tile_size + this.offsetx < this.canvas_size + this.tile_size) {
                        if (y * this.tile_size + this.offsety >= -this.tile_size && y * this.tile_size + this.offsety < this.view_height) {
                            this.renderer.draw_tile(this.floor.get(x, y).get_tile_sprite_index(), x * this.tile_size + this.offsetx, y * this.tile_size + this.offsety)

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

        var enemy_animation_step = Math.floor(this.time_step / 30) % 2
        for (let enemy of this.floor.enemies) {
            //Render an enemy param: sprite_sheet, direction, timestep (for animation), xpos (in pixles), ypos (in pixels) 
            this.renderer.draw_character(this.renderer.merlock, undefined, enemy_animation_step, enemy.x * this.tile_size + this.offsetx, enemy.y * this.tile_size + this.offsety)
        }

        this.time_step += 1
        this.tick_timer += 0.02
        if (this.tick_timer >= 1) {
            this.tick_timer %= 1
            this.on_tick_timer()
        }

        //Render a the player param: sprite_sheet, direction, animation_step, xpos (in pixles), ypos (in pixels)
        var player_animation_step = Math.floor(this.time_step / 20) % 3
        this.renderer.draw_character(this.renderer.player_character, this.player.direction, player_animation_step, this.player.x * this.tile_size + this.offsetx, this.player.y * this.tile_size + this.offsety)

        this.renderer.draw_fog(this.time_step)

        this.renderer.draw_ui_element("inventory", 0, 250)
        this.renderer.draw_ui_element("time_bar", 286, 257)
        this.renderer.draw_rect(288, 290, 3, -30 * this.tick_timer)
        this.renderer.draw_ui_element("health_container", 6, 256)
        for(let i = 0; i < this.player.MAX_HEALTH; i+=2){
            let x = 8 + 4 * (i%(this.player.MAX_HEALTH/2))
            let y = 258 + 8*Math.floor(i / (this.player.MAX_HEALTH/2))
            if(this.player.health >= i + 2){
                this.renderer.draw_ui_element("full_heart", x, y)
            }else if(this.player.health == i + 1){
                this.renderer.draw_ui_element("half_heart", x, y)
            }else{
                this.renderer.draw_ui_element("empty_heart", x, y)
            }
        }

        this.renderer.draw_effects(this.offsetx, this.offsety)
    }

    on_tick_timer() {
        //Deal damage to player
        if(this.floor.tile_contains_enemy(this.player.x + 1, this.player.y)) this.player.health -= 1
        if(this.floor.tile_contains_enemy(this.player.x - 1, this.player.y)) this.player.health -= 1
        if(this.floor.tile_contains_enemy(this.player.x, this.player.y + 1)) this.player.health -= 1
        if(this.floor.tile_contains_enemy(this.player.x, this.player.y - 1)) this.player.health -= 1

        this.floor.move_enemies_towards(this.player.x, this.player.y)
    }

    on_exit(data) {
        if (data) { }
    }

}