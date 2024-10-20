// engine.js
class JadeEngine {
    constructor(rootElement) {
        this.rootElement = rootElement;
        this.currentScene = null;
        this.isRunning = false;
    }

    start(scene) {
        this.currentScene = scene;
        this.isRunning = true;
        this.currentScene.init();
        this.loop();
    }

    loop() {
        if (!this.isRunning) return;

        this.currentScene.update();
        this.currentScene.render();

        requestAnimationFrame(() => this.loop());
    }

    stop() {
        this.isRunning = false;
    }

    changeScene(scene) {
        this.currentScene = scene;
        this.currentScene.init();
    }
}

export default JadeEngine;
