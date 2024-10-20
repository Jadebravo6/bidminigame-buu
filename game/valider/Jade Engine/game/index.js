import JadeEngine from '../core/engine.js';
import Renderer from '../core/renderer.js';
import Physics from '../core/physics.js';
import Entity from '../core/entity.js';
import Scene from '../core/scene.js';
import InputManager from '../core/input.js';

// Initialisation du jeu
const canvas = document.getElementById('game-canvas');

if (!canvas) {
    console.error('Canvas element not found!');
    throw new Error('Canvas element not found');
}

const engine = new JadeEngine(canvas);
const renderer = new Renderer(canvas);
const inputManager = new InputManager();
const scene = new Scene(engine);

// Définir la taille du canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = new Entity(canvas.width / 2 - 25, canvas.height / 2 - 25, 50, 50, 'game-element');
scene.addEntity(player);
player.init();

const objects = [];
const objectCount = 5;
const objectSize = 30;

function createObject() {
    const x = Math.random() * (canvas.width - objectSize);
    const y = -objectSize;
    const obj = new Entity(x, y, objectSize, objectSize, 'game-element');
    obj.velocityY = 2;
    scene.addEntity(obj);
    obj.init();
    objects.push(obj);
}

function updateGame() {
    objects.forEach(obj => {
        Physics.applyVelocity(obj);
        obj.y += obj.velocityY;

        if (Physics.checkCollision(player, obj)) {
            obj.destroy();
            objects.splice(objects.indexOf(obj), 1);
            createObject();
        }

        if (obj.y > canvas.height) {
            obj.destroy();
            objects.splice(objects.indexOf(obj), 1);
            createObject();
        }
    });

    renderer.clear();
    scene.render();
}

function gameLoop() {
    updateGame();
    requestAnimationFrame(gameLoop);
}

for (let i = 0; i < objectCount; i++) {
    createObject();
}

gameLoop();

// Met à jour la position du joueur en fonction de la souris
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    player.x = mouseX - (player.width / 2); // Centrer le joueur sur la souris
    player.y = mouseY - (player.height / 2);
    
    player.render(); // Met à jour la position de l'entité dans le DOM
});
