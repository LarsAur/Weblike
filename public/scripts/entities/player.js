class Player {

    constructor(x, y, floor, input_handler) {
        this.start_x = x
        this.start_y = y
        this.direction = "down"
        this.x = x
        this.y = y
        this.floor = floor
        this.input_handler = input_handler
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
        const walkable_tiles = ["n1", "n2"]
        if (this.input_handler.is_key_pressed("s")) {
            if (this.direction == "down") {
                if (walkable_tiles.includes(this.floor.get(this.x, this.y + 1)) && !this.floor.tile_contains_enemy(this.x, this.y + 1)) {
                    this.y += 1
                }
            }
            this.direction = "down"
        }

        if (this.input_handler.is_key_pressed("w")) {
            if (this.direction == "up") {
                if (walkable_tiles.includes(this.floor.get(this.x, this.y - 1)) && !this.floor.tile_contains_enemy(this.x, this.y - 1)) {
                    this.y -= 1
                }
            }
            this.direction = "up"
        }

        if (this.input_handler.is_key_pressed("a")) {
            if (this.direction == "left") {
                if (walkable_tiles.includes(this.floor.get(this.x - 1, this.y)) && !this.floor.tile_contains_enemy(this.x - 1, this.y)) {
                    this.x -= 1
                }
            }
            this.direction = "left"
        }

        if (this.input_handler.is_key_pressed("d")) {
            if (this.direction == "right") {
                if (walkable_tiles.includes(this.floor.get(this.x + 1, this.y)) && !this.floor.tile_contains_enemy(this.x + 1, this.y)) {
                    this.x += 1
                }
            }
            this.direction = "right"
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