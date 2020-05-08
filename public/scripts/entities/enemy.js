class Enemy{
    constructor(x, y, floor){
        this.x = x
        this.y = y
        this.floor = floor
        this.agro_timer = 0
    }

    tick(){

    }

    on_tick_timer(){
        this.agro_timer = Math.max(0, this.agro_timer - 1)
    }

    move_towards(x, y){
        let path = this.floor.path_between(this.x, this.y, x, y)
        if(path && path.length != 0){
            this.x = path[0][0]
            this.y = path[0][1]
        }
    }
}