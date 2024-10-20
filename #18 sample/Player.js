// Classe pour le joueur (hérite de OrbitalObject)
class Player extends OrbitalObject {
    constructor(radius) {
        super(radius, baseSpeed / radius);
    }

    display() {
        fill('#ffbc63');
        noStroke();
        ellipse(this.x, this.y, 25); // Taille et couleur du joueur
    }

    changeOrbit(newRadius) {
        this.radius = newRadius;
        this.speed = baseSpeed / newRadius; // Ajuste la vitesse selon l'orbite
    }
}
