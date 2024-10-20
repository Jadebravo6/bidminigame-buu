// Classe pour les orbites (cercle tracé)
class Orbit {
    constructor(radius) {
        this.radius = radius;
    }

    display() {
        noFill();
        stroke(255, 100);
        strokeWeight(2);
        ellipse(width / 2, height / 2, this.radius * 2); // Dessine l'orbite
    }
}
