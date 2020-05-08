class InputHandler {

    static next_mouse_listener_id = -1

    constructor() {
        this.mouse_listeners = new Map()
        this.key_down = new Map()

        document.getElementById("canvas").addEventListener("click", event => {
            var canvas_scale = Math.min(window.innerHeight, window.innerWidth) * 0.8
            const canvas_pixel_size = 300
            var x = event.offsetX * canvas_pixel_size / canvas_scale
            var y = event.offsetY * canvas_pixel_size / canvas_scale
            this.onMousePressed(x, y)
        })

        window.addEventListener("keydown", event => {
            if(!event.repeat){
                this.key_down.set(event.key, true)
            }
        })

        window.addEventListener("keyup", event => {
            if (!event.repeat) {
                this.key_down.set(event.key, false)
            }
        })
    }

    tick(){
        this.prev_keydown = new Map(this.key_down)
    }

    is_key_down(key){
        return this.key_down.get(key) // can return undefined, but undefined == false
    }

    is_key_pressed(key){
        return this.key_down.get(key) && !this.prev_keydown.get(key) // can return undefined, but undefined == false
    }

    onMousePressed(x, y) {
        for (listener of this.mouse_listeners) {
            if (listener.x > x || listener.x + listener.w < x) continue
            if (listener.y > y || listener.y + listener.h < y) continue
            listener.callback()
        }
    }

    register_mouse_listener(x, y, w, h, callback) {
        next_mouse_listener_id++
        this.mouse_listeners.set(next_mouse_listener_id, { x: x, y: y, W: w, h: h, callback: callback })
        return next_mouse_listener_id
    }

    unregister_mouse_listener(listner_id) {
        this.mouse_listeners.delete(listner_id)
    }
}