// Classe pour les obstacles (hérite de OrbitalObject)
class Obstacle extends OrbitalObject {
    constructor(radius) {
        super(radius, random(0.02, 0.04));
        this.direction = 1;
    }

    display() {
        fill(255, 0, 0);
        noStroke();
        ellipse(this.x, this.y, 30); // Taille de l'obstacle
    }

    checkCollision(px, py) {
        let d = dist(px, py, this.x, this.y);
        return d < 30; // Vérifie la collision avec le joueur
    }
}
