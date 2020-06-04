class Renderer {

    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.width = this.canvas.clientWidth
        this.height = this.canvas.clientHeight

        this.direction_to_animation = new Map([["up", 0], ["down", 1], ["right", 2], ["left", 3]])

        this.font = document.getElementById("font")
        this.tilemap = document.getElementById("tilemap")
        this.ui_elements = document.getElementById("ui")
        this.effects = document.getElementById("effects")

        this.player_character = document.getElementById("player_character")
        this.merlock = document.getElementById("merlock")

        this.effects_map = new Map()
        this.effects_map.set("slash_up", {frame_delay: 2, steps: [{ x: 0, y: 0, w: 16, h: 16 }, { x: 0, y: 16, w: 16, h: 16 }]})
        this.effects_map.set("slash_down", {frame_delay: 2, steps: [{ x: 16, y: 0, w: 16, h: 16 }, { x: 16, y: 16, w: 16, h: 16 }]})
        this.effects_map.set("slash_right", {frame_delay: 2, steps: [{ x: 32, y: 0, w: 16, h: 16 }, { x: 32, y: 16, w: 16, h: 16 }]})
        this.effects_map.set("slash_left", {frame_delay: 2, steps: [{ x: 48, y: 0, w: 16, h: 16 }, { x: 48, y: 16, w: 16, h: 16 }]})

        this.ui_map = new Map()
        this.ui_map.set("arrow", { x: 0, y: 0, w: 3, h: 5 })
        this.ui_map.set("inventory", { x: 0, y: 78, w: 300, h: 50 })
        this.ui_map.set("time_bar", { x: 0, y: 6, w: 7, h: 36 })
        this.ui_map.set("empty_heart", { x: 8, y: 19, w: 7, h: 6 })
        this.ui_map.set("half_heart", { x: 16, y: 19, w: 7, h: 6 })
        this.ui_map.set("full_heart", { x: 24, y: 19, w: 7, h: 6 })
        this.ui_map.set("health_container", { x: 8, y: 0, w: 35, h: 18 })

        this.effects_to_render = [] // {Effects_map_key, x, y, frame_count}
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height)
    }

    draw_string(str, x, y) {
        str = str.toUpperCase()
        for (var i = 0; i < str.length; i++) {
            var code = str.charCodeAt(i)
            var index = -1
            if (code > 64 && code < 91) index += code - 64; // Alphabet A => 64
            else if (code > 47 && code < 58) index = 26 + code - 48 //Numbers 0 => 48

            // drawImage(img, start_clipx, start_clipy, w_clip, h_clip, x_pos, y_pos, draw_w, draw_h)
            if (index != -1) this.ctx.drawImage(this.font, 4 * index, 0, 3, 5, x + (i * 4), y, 3, 5)
        }
    }

    draw_tile(tile, x, y) {
        var index = tile
        // drawImage(img, start_clipx, start_clipy, w_clip, h_clip, x_pos, y_pos, draw_w, draw_h)
        this.ctx.drawImage(this.tilemap, 16 * index, 0, 16, 16, x, y, 16, 16)
    }

    draw_ui_element(element_name, x, y) {
        var clip_data = this.ui_map.get(element_name)

        if (clip_data !== undefined) {
            // drawImage(img, start_clipx, start_clipy, w_clip, h_clip, x_pos, y_pos, draw_w, draw_h)
            this.ctx.drawImage(this.ui_elements, clip_data.x, clip_data.y, clip_data.w, clip_data.h, x, y, clip_data.w, clip_data.h)
        } else {
            console.log("Did not find clip_data for : " + element_name)
        }
    }

    draw_character(character, dir, animation_step, x, y) {
        // Character sprite sheet is direction along x-axis and animation stage along y-axis
        // drawImage(img, start_clipx, start_clipy, w_clip, h_clip, x_pos, y_pos, draw_w, draw_h)
        if (dir) {
            this.ctx.drawImage(character, this.direction_to_animation.get(dir) * 16, animation_step * 16, 16, 16, x, y, 16, 16)
        } else {
            this.ctx.drawImage(character, 0, animation_step * 16, 16, 16, x, y, 16, 16)
        }
    }

    add_effect(key, x, y){
        // effect_map_key, x, y (world coords), frames since effect started 
        // world coords means camera moves the effect, but it is not based on tiles
        this.effects_to_render.push({map_key: key, x: x, y: y, frame_count: 0})
    }

    draw_effects(offsetx, offsety){
        let ended_animations = []
        for(let i = 0; i < this.effects_to_render.length; i++){                                       // loops through each effect and render their respective animation
            let effect = this.effects_to_render[i] 
            let frame_delay = this.effects_map.get(effect.map_key).frame_delay      // timedelay between each animation step
            let frame_count = effect.frame_count                                    // number of frames since start of effect
            let animation_step = Math.floor(frame_count / frame_delay)              // animation_step
            let frame = this.effects_map.get(effect.map_key).steps[animation_step]  // clipping of frame to be rendered
            
            this.ctx.drawImage(this.effects, frame.x, frame.y, frame.w, frame.h, effect.x + offsetx, effect.y + offsety, frame.w, frame.h)
            effect.frame_count += 1
            // If animation is finished: queue for removal
            if(frame_delay * this.effects_map.get(effect.map_key).steps.length <= effect.frame_count){
                ended_animations.push(i)
            }
        }
        // Remove ended animations
        for(let i = ended_animations.length - 1; i >= 0; i--){ // iterate backwards to not alter the index while removing
            this.effects_to_render.splice(ended_animations[i], 1)
        }
    }

    draw_rect(x, y, w, h) {
        this.ctx.fillStyle = "#FFFFE3"
        this.ctx.fillRect(x, y, w, h)
    }

    draw_fog(timestep) {
        let grd = this.ctx.createRadialGradient(150, 125, 100 + 10 * Math.sin(timestep * Math.PI / 120), 150, 125, 140 + 5 * Math.sin(timestep * Math.PI / 120))
        grd.addColorStop(0, "#12001900")
        grd.addColorStop(1, "#120019ff")
        this.ctx.fillStyle = grd;
        this.ctx.fillRect(0, 0, 300, 250);
    }

}