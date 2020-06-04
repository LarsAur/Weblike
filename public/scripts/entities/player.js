class Player {

    constructor(x, y, floor, input_handler, renderer, audio_manager) {
        this.start_x = x
        this.start_y = y
        this.direction = "down"
        this.x = x
        this.y = y
        this.floor = floor
        this.input_handler = input_handler
        this.renderer = renderer
        this.audio_manager = audio_manager
        this.MAX_HEALTH = 16
        this.health = this.MAX_HEALTH

        this.attack_timer = 0
        this.attack_position = [0, 0]
        this.attack_direction = "down"
        this.ction_delta_map = new Map([
            ["up", [0, 1]],
            ["down", [0, 1]],
            ["left", [0, 1]],
            ["right", [0, 1]]
        ])
    }

    reset() {
        this.x = this.start_x
        this.y = this.start_y
        this.health = this.MAX_HEALTH
    }

    tick() {
        // Player walking
        const walkable_tiles = ["n1", "n2"]
        if (this.input_handler.is_key_pressed("s")) {
            if (walkable_tiles.includes(this.floor.get(this.x, this.y + 1)) && !this.floor.tile_contains_enemy(this.x, this.y + 1)) {
                this.y += 1
            }
            this.direction = "down"
        }
        if (this.input_handler.is_key_pressed("w")) {
            if (walkable_tiles.includes(this.floor.get(this.x, this.y - 1)) && !this.floor.tile_contains_enemy(this.x, this.y - 1)) {
                this.y -= 1
            }
            this.direction = "up"
        }
        if (this.input_handler.is_key_pressed("a")) {
            if (walkable_tiles.includes(this.floor.get(this.x - 1, this.y)) && !this.floor.tile_contains_enemy(this.x - 1, this.y)) {
                this.x -= 1
            }
            this.direction = "left"
        }
        if (this.input_handler.is_key_pressed("d")) {
            if (walkable_tiles.includes(this.floor.get(this.x + 1, this.y)) && !this.floor.tile_contains_enemy(this.x + 1, this.y)) {
                this.x += 1
            }
            this.direction = "right"
        }

        //Player attack
        if (this.input_handler.is_key_pressed("ArrowDown")){
            this.direction = "down"
            this.renderer.add_effect("slash_down", this.x * 16, (this.y + 0.5) * 16)
            if(this.floor.hit_enemy_at(this.x, this.y + 1, 1)){this.audio_manager.play("hit")}
            else{this.audio_manager.play("miss")}
        }
        if (this.input_handler.is_key_pressed("ArrowUp")){
            this.direction = "up"
            this.renderer.add_effect("slash_up", this.x * 16, (this.y - 0.5) * 16)
            if(this.floor.hit_enemy_at(this.x, this.y - 1, 1)){this.audio_manager.play("hit")}
            else{this.audio_manager.play("miss")}
        }
        if (this.input_handler.is_key_pressed("ArrowLeft")){
            this.direction = "left"
            this.renderer.add_effect("slash_left", (this.x - 0.5) * 16, this.y * 16)
            if(this.floor.hit_enemy_at(this.x - 1, this.y, 1)){this.audio_manager.play("hit")}
            else{this.audio_manager.play("miss")}
        }
        if (this.input_handler.is_key_pressed("ArrowRight")){
            this.direction = "right"
            this.renderer.add_effect("slash_right", (this.x + 0.5) * 16, this.y * 16)
            if(this.floor.hit_enemy_at(this.x + 1, this.y, 1)){this.audio_manager.play("hit")}
            else{this.audio_manager.play("miss")}
        }

        // Attack on pressing Space
        this.attack_timer -= 1
        if (this.input_handler.is_key_pressed("Space")) {
            if (this.attack_timer == 0) {
                this.attack_timer = 2
                this.attack_direction = this.direction
                this.attack_position = [this.x, this.y]

            }
        }

    }

    move() {

    }
}