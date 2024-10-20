// Classe de base pour les objets en orbite
class OrbitalObject {
    constructor(radius, speed) {
        this.angle = random(TWO_PI);
        this.radius = radius;
        this.speed = speed;
        this.x = 0;
        this.y = 0;
    }

    update() {
        this.angle += this.speed;
        this.x = width / 2 + cos(this.angle) * this.radius;
        this.y = height / 2 + sin(this.angle) * this.radius;
    }

    display() {
        // Affiche un point simple pour la classe de base
        fill(255);
        ellipse(this.x, this.y, 10);
    }
}
