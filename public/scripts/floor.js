class Floor {

    constructor(floor_size, room_size, seed, audio_manager) {
        this.floor_size = floor_size
        this.room_size = room_size
        this.floor = []
        this.RNG = new RNG(seed)
        this.audio_manager = audio_manager
        this.enemies = []
        this.distance_map = undefined

        console.log(this.RNG)
    }

    get(x, y) {
        return this.floor[x][y]
    }

    populate() {
        const spawnable_tiles = ["n1", "n2"]
        this.enemies = []
        for (let i = 0; i < this.floor.length; i++) {
            for (let j = 0; j < this.floor[i].length; j++) {
                if (spawnable_tiles.includes(this.floor[i][j]) && !this.is_tile_in_spawn_room(i, j)) {
                    if (this.RNG.next_float() > 0.98) {
                        this.enemies.push(new Enemy(i, j, this, this.audio_manager))
                    }
                }
            }
        }
    }

    is_tile_in_spawn_room(x, y){
        return x >= 24 && x <= 32 && y >= 24 && y <= 32 // Includes the spawn room doors
    }

    tile_contains_enemy(x, y){
        for(let e of this.enemies){
            if(e.x == x && e.y == y){
                return true
            }
        }
        return false
    }

    //Hits an enemy at a location if there is an enemy at that location, returns true or false depending on hit or not
    hit_enemy_at(x, y, dmg){
        for(let i = 0; i < this.enemies.length; i++){
            let  e = this.enemies[i]
            if(e.x == x && e.y == y){
                e.on_damaged(dmg)
                if(e.health <= 0){
                    e.on_death()
                    this.enemies.splice(i, 1)
                }
                return true
            }
        }
        return false
    }

    move_enemies_towards(x, y) {
        let random = new RNG()
        const is_enemy_on = (x, y) => {
            for(let e of this.enemies){
                if(e.x == x && e.y == y){
                    return true
                }
            }
            return false
        }
        // Create distance_map
        this.generate_distance_map(x, y)
        // Sort enemies on closeness
        this.enemies.sort((a, b) => this.distance_map[a.x][a.y] - this.distance_map[b.x][b.y])
        // Move enemies closer        
        for (let e of this.enemies) {
            if(this.is_line_between(e.x, e.y, x, y, this.room_size)){
                e.agro_timer = 3
            }else{
                e.agro_timer -= 1
            }
            //Move is enemy has agro and is not already close to the player
            if(e.agro_timer > 0 && this.distance_map[e.x][e.y] != 1){ 
                let available_moves = []
                let d = this.distance_map[e.x][e.y]
                // Find empty closer spaces
                if (d > this.distance_map[e.x + 1][e.y] && !is_enemy_on(e.x + 1, e.y)) available_moves.push([e.x + 1, e.y])
                if (d > this.distance_map[e.x - 1][e.y] && !is_enemy_on(e.x - 1, e.y)) available_moves.push([e.x - 1, e.y])
                if (d > this.distance_map[e.x][e.y + 1] && !is_enemy_on(e.x, e.y + 1)) available_moves.push([e.x, e.y + 1])
                if (d > this.distance_map[e.x][e.y - 1] && !is_enemy_on(e.x, e.y - 1)) available_moves.push([e.x, e.y - 1])
                // Choose an available space
                if (available_moves.length > 0) {
                    let np = random.choose(available_moves)
                    e.x = np[0]
                    e.y = np[1]
                }
            }            
        }
    }

    generate_floor() {
        //Fill floor with empty tiles
        this.floor = []
        for (let i = 0; i < this.room_size * this.floor_size; i++) {
            this.floor[i] = []
        }

        let _floor_size = this.floor_size // local variable for accessing floor_size in local functions

        let num_rooms = this.RNG.next_range(10, 18)
        console.log("Num_rooms: " + num_rooms)
        let open_slots = [[Math.floor(this.floor_size / 2), Math.floor(this.floor_size / 2)]] // Center of nxn map
        let used_slots = []

        //Adding all room blueprints to the floor
        for (let i = 0; i < num_rooms; i++) {
            let slot_index = this.RNG.next_range(0, open_slots.length)
            let blueprint = this.RNG.next_range(0, this.room_blueprints.length)
            let slot = open_slots.splice(slot_index, 1)[0] // removes 1 element at slot_index
            used_slots.push(slot)

            add_open_slots_around(slot)

            // Add room to floor map
            for (var j = 0; j < this.room_size; j++) {
                for (var k = 0; k < this.room_size; k++) {
                    var x = slot[0] * (this.room_size - 1) + j // room_size - 1 create overlap between walls
                    var y = slot[1] * (this.room_size - 1) + k

                    // first room is an empty room
                    if (i == 0) {
                        this.floor[x][y] = this.room_blueprints[0][k][j]
                        continue
                    }

                    // Add doors between every room
                    // Checks if the current tile is in the middle of a wall and if there is a wall (tile) there already, there is a room on the other side
                    if (((j == Math.floor(this.room_size / 2) && (k == 0 || k == this.room_size - 1)) || (k == Math.floor(this.room_size / 2) && (j == 0 || j == this.room_size - 1))) && this.floor[x][y]) {
                        this.floor[x][y] = "n"
                        continue
                    }

                    this.floor[x][y] = this.room_blueprints[blueprint][k][j]
                }
            }
        }

        // Fix artifacts
        for (let i = 0; i < this.floor.length; i++) {
            for (let j = 0; j < this.floor[i].length; j++) {
                // Horizontal walls turned to vertical walls if there is no tile under or tile is empty
                if (this.floor[i][j] == "h" && (this.floor[i][j + 1] == "n" || this.floor[i][j + 1] === undefined)) {
                    this.floor[i][j] = "v"
                }
            }
        }

        //Handle random tiles
        for (let i = 0; i < this.floor.length; i++) {
            for (let j = 0; j < this.floor[i].length; j++) {
                if (this.floor[i][j] == "n") {
                    if (this.RNG.next_float() > 0.9) {
                        this.floor[i][j] = "n1"
                    } else {
                        this.floor[i][j] = "n2"
                    }
                }

                if (this.floor[i][j] == "h") {
                    if (this.RNG.next_float() > 0.99) {
                        this.floor[i][j] = "h2"
                    } else {
                        this.floor[i][j] = "h1"
                    }
                }
            }
        }

        function add_open_slots_around(slot) {
            let busy_slots = used_slots.concat(open_slots)
            if (slot[0] + 1 < _floor_size && !slot_list_contains(busy_slots, [slot[0] + 1, slot[1]])) open_slots.push([slot[0] + 1, slot[1]]) // Add slot to the right
            if (slot[0] - 1 >= 0 && !slot_list_contains(busy_slots, [slot[0] - 1, slot[1]])) open_slots.push([slot[0] - 1, slot[1]]) // Add slot to the left
            if (slot[1] + 1 < _floor_size && !slot_list_contains(busy_slots, [slot[0], slot[1] + 1])) open_slots.push([slot[0], slot[1] + 1]) // Add slot down
            if (slot[1] - 1 >= 0 && !slot_list_contains(busy_slots, [slot[0], slot[1] - 1])) open_slots.push([slot[0], slot[1] - 1]) // Add slot up
        }

        function slot_list_contains(slot_list, slot) {
            for (let s of slot_list) {
                if (s[0] == slot[0] && s[1] == slot[1]) return true
            }
            return false
        }
    }

    generate_distance_map(player_x, player_y) {
        const walkable_tiles = ["n1", "n2"]
        this.distance_map = []
        for (let x = 0; x < this.room_size * this.floor_size; x++) {
            this.distance_map[x] = []
            for (let y = 0; y < this.room_size * this.floor_size; y++) {
                this.distance_map[x][y] = Infinity
            }
        }

        // entries in queue are on the form of [x, y, distance]
        let queue = []
        queue.push([player_x, player_y, 0])
        this.distance_map[player_x][player_y] = 0

        const try_add_to_queue_with_distance = (x, y, d) => {
            if (walkable_tiles.includes(this.floor[x][y]) && this.distance_map[x][y] === Infinity) {
                this.distance_map[x][y] = d
                queue.push([x, y, d])
            }
        }

        while (queue.length > 0) {
            let c = queue.shift()
            let x = c[0]
            let y = c[1]
            let d = c[2]
            try_add_to_queue_with_distance(x + 1, y, d + 1)
            try_add_to_queue_with_distance(x - 1, y, d + 1)
            try_add_to_queue_with_distance(x, y + 1, d + 1)
            try_add_to_queue_with_distance(x, y - 1, d + 1)
        }
    }

    // Implementation of bresenhams line algorithem
    is_line_between(x1, y1, x2, y2, max_distance) {
        const wall_tiles = ["h1", "h2", "v"]
        let dx = Math.abs(x2 - x1)
        let dy = -Math.abs(y2 - y1)
        let sx = Math.sign(x2 - x1)
        let sy = Math.sign(y2 - y1)
        let err = dx + dy

        if (max_distance) {
            if (dx * dx + dy * dy > max_distance * max_distance) return false // Outside max distance
        }

        while (true) {
            if (wall_tiles.includes(this.floor[x1][y1])) {
                return false
            }
            if (x1 == x2 && y1 == y2) {
                return true
            }
            let e2 = 2 * err
            if (e2 >= dy) {
                err += dy
                x1 += sx
            }
            if (e2 <= dx) {
                err += dx
                y1 += sy
            }
        }
    }

    //n = "nothing" (1, 2)
    //h = "horizontal_wall" (1, 2)
    //v = "vertical_wall"
    //r = "rock"

    room_blueprints = [
        [// Empty room
            ["h", "v", "v", "v", "v", "v", "v", "v", "h"],
            ["h", "n", "n", "n", "n", "n", "n", "n", "h"],
            ["h", "n", "n", "n", "n", "n", "n", "n", "h"],
            ["h", "n", "n", "n", "n", "n", "n", "n", "h"],
            ["h", "n", "n", "n", "n", "n", "n", "n", "h"],
            ["h", "n", "n", "n", "n", "n", "n", "n", "h"],
            ["h", "n", "n", "n", "n", "n", "n", "n", "h"],
            ["h", "n", "n", "n", "n", "n", "n", "n", "h"],
            ["h", "v", "v", "v", "v", "v", "v", "v", "h"],
        ],
        [//Empty room with center pillar
            ["h", "v", "v", "v", "v", "v", "v", "v", "h"],
            ["h", "n", "n", "n", "n", "n", "n", "n", "h"],
            ["h", "n", "n", "n", "n", "n", "n", "n", "h"],
            ["h", "n", "n", "h", "h", "h", "n", "n", "h"],
            ["h", "n", "n", "h", "h", "h", "n", "n", "h"],
            ["h", "n", "n", "v", "v", "v", "n", "n", "h"],
            ["h", "n", "n", "n", "n", "n", "n", "n", "h"],
            ["h", "n", "n", "n", "n", "n", "n", "n", "h"],
            ["h", "v", "v", "v", "v", "v", "v", "v", "h"],
        ],
        [// Corner wall
            ["h", "h", "v", "v", "v", "v", "v", "h", "h"],
            ["h", "v", "n", "n", "n", "n", "n", "v", "h"],
            ["h", "n", "n", "n", "n", "n", "n", "n", "h"],
            ["h", "n", "n", "n", "n", "n", "n", "n", "h"],
            ["h", "n", "n", "n", "n", "n", "n", "n", "h"],
            ["h", "n", "n", "n", "n", "n", "n", "n", "h"],
            ["h", "n", "n", "n", "n", "n", "n", "n", "h"],
            ["h", "h", "n", "n", "n", "n", "n", "h", "h"],
            ["h", "v", "v", "v", "v", "v", "v", "v", "h"],
        ],
        [// Stone room
            ["h", "v", "v", "v", "v", "v", "v", "v", "h"],
            ["h", "r", "r", "n", "n", "n", "n", "n", "h"],
            ["h", "r", "r", "n", "n", "n", "n", "n", "h"],
            ["h", "r", "n", "n", "n", "n", "n", "n", "h"],
            ["h", "n", "n", "n", "n", "n", "n", "n", "h"],
            ["h", "n", "n", "n", "n", "n", "n", "r", "h"],
            ["h", "n", "n", "n", "n", "n", "n", "r", "h"],
            ["h", "n", "n", "n", "n", "n", "n", "r", "h"],
            ["h", "v", "v", "v", "v", "v", "v", "v", "h"],
        ],
    ]
}