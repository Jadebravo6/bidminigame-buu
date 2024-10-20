// audio.js
class AudioManager {
    constructor() {
        this.sounds = {};
    }

    loadSound(name, src) {
        const audio = new Audio(src);
        this.sounds[name] = audio;
    }

    playSound(name, loop = false) {
        if (this.sounds[name]) {
            this.sounds[name].loop = loop;
            this.sounds[name].play();
        }
    }

    stopSound(name) {
        if (this.sounds[name]) {
            this.sounds[name].pause();
            this.sounds[name].currentTime = 0;
        }
    }
}

export default AudioManager;
