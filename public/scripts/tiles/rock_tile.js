class RockTile extends Tile{

    get_tile_sprite_index(){
        return 3 // Rock tile
    }

    is_walkable(){
        return false
    }

    is_see_through(){
        return true
    }
}