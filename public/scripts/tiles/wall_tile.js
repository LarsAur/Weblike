class WallTile extends Tile {

    constructor(x, y, floor, rand) {
        super(x, y, floor)
        if (rand > 0.99) this.tile_index = 4 // Vertical wall with eyes
        else this.tile_index = 1 // Vertical wall
    }

    get_tile_sprite_index() {
        // Display vertical wall if there is a wall in the tile below
        // If null / undefined is returned by floor, the wall is horizontal
        if (this.floor.get(this.x, this.y + 1) instanceof WallTile) {
            return this.tile_index
        }
        return 0 // Horizontal wall 
    }

    is_see_through() {
        return false
    }

    is_walkable() {
        return false
    }

}