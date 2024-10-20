// dom-based.js
import JadeEngine from '../core/engine.js';
import Scene from '../core/scene.js';
import Entity from '../core/entity.js';

const rootElement = document.getElementById('gameRoot');
const engine = new JadeEngine(rootElement);

class DOMEntity extends Entity {
    constructor(x, y, width, height, cssClass) {
        super(x, y, width, height, cssClass);
    }

    update() {
        // Mettre à jour la logique DOM
    }

    render() {
        super.render();
    }
}

class DOMScene extends Scene {
    init() {
        const element1 = new DOMEntity(100, 100, 150, 150, 'game-box');
        const element2 = new DOMEntity(300, 200, 150, 150, 'game-circle');
        this.addEntity(element1);
        this.addEntity(element2);
    }
}

const scene = new DOMScene(engine);
engine.start(scene);
