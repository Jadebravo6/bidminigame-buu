// Classe pour les items à collecter (hérite de OrbitalObject)
class Item extends OrbitalObject {
    constructor() {
        // Choisir un rayon aléatoire parmi les orbites disponibles
        const randomRadius = radiusOrbits[floor(random(radiusOrbits.length))];
        super(randomRadius, 0); // Pas de mouvement
        this.respawn(); // Initialiser la position lors de la création
    }

    display() {
        fill(255, 204, 0);
        noStroke();
        ellipse(this.x, this.y, 15); // Taille et couleur de l'item
    }

    checkTouch(px, py) {
        let d = dist(px, py, this.x, this.y);
        return d < 20; // Vérifie si le joueur touche l'item
    }

    respawn() {
        this.angle = random(TWO_PI); // Choisir un angle aléatoire
        this.radius = radiusOrbits[floor(random(radiusOrbits.length))]; // Choisir un rayon aléatoire parmi les orbites
        this.update(); // Met à jour la position en fonction du nouvel angle et du rayon
    }
}
