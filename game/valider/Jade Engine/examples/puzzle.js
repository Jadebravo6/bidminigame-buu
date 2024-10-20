// puzzle.js
import JadeEngine from '../core/engine.js';
import Scene from '../core/scene.js';
import Entity from '../core/entity.js';

const rootElement = document.getElementById('gameRoot');
const engine = new JadeEngine(rootElement);

class PuzzlePiece extends Entity {
    constructor(x, y, width, height) {
        super(x, y, width, height, 'puzzle-piece');
    }

    update() {
        // Logique pour la mise à jour de la pièce du puzzle
    }

    render() {
        super.render();
    }
}

class PuzzleScene extends Scene {
    init() {
        const piece1 = new PuzzlePiece(50, 50, 100, 100);
        const piece2 = new PuzzlePiece(200, 50, 100, 100);
        this.addEntity(piece1);
        this.addEntity(piece2);
    }
}

const scene = new PuzzleScene(engine);
engine.start(scene);
