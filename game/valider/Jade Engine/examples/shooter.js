// shooter.js
import JadeEngine from '../core/engine.js';
import Scene from '../core/scene.js';
import Entity from '../core/entity.js';
import Renderer from '../core/renderer.js';
import InputManager from '../core/input.js';

const canvas = document.getElementById('gameCanvas');
const engine = new JadeEngine(canvas);
const renderer = new Renderer(canvas);
const input = new InputManager();

class Player extends Entity {
    constructor(x, y) {
        super(x, y, 30, 30);
        this.color = '#00ff00';
    }

    update() {
        const touchPositions = input.getTouchPositions();
        if (touchPositions['mouse'] || Object.keys(touchPositions).length > 0) {
            this.x = touchPositions['mouse'] ? touchPositions['mouse'].x : Object.values(touchPositions)[0].x;
            this.y = touchPositions['mouse'] ? touchPositions['mouse'].y : Object.values(touchPositions)[0].y;
        }
    }

    render() {
        renderer.renderEntity(this);
    }
}

class ShooterScene extends Scene {
    init() {
        const player = new Player(150, 150);
        this.addEntity(player);
    }
}

const scene = new ShooterScene(engine);
engine.start(scene);
