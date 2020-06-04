class AudioManager{
    constructor(){
        this.RNG = new RNG()
        this.sound_effects_map = new Map()
        this.sound_effects_map.set("hit", [
            document.getElementById("hit_1"),
            document.getElementById("hit_2")
        ])
        this.sound_effects_map.set("miss", [
            document.getElementById("miss_1"),
            document.getElementById("miss_2")
        ])
        this.sound_effects_map.set("death", [
            document.getElementById("death_1"),
            document.getElementById("death_2")
        ])
    }

    play(sound){
        let sounds = this.sound_effects_map.get(sound)
        for(let sound of sounds){
            sound.pause()
            sound.currentTime = 0
        }
        this.RNG.choose(sounds).play()
    }
}