class GroundTile extends Tile {

    constructor(x, y, floor, rand) {
        super(x, y, floor)
        if (rand > 0.9) this.sprite_index = 2 // Gravel ground tile
        else this.sprite_index = 5 // Blank ground tile
    }

    get_tile_sprite_index() {
        return this.sprite_index
    }

    is_walkable() {
        return true
    }

    is_see_through() {
        return true
    }
}