import { JadeEngine, Scene } from '../core/engine.js';
import { Player } from './player.js';

// Initialisation du moteur de jeu
const engine = new JadeEngine();
const scene = new Scene();
engine.setScene(scene);

// Création du joueur
const player = new Player(100, 300); // Position initiale
scene.addEntity(player);

// Fonction de mise à jour
function update() {
    player.update();
    engine.render();
    requestAnimationFrame(update);
}

// Démarrer la boucle de jeu
update();
