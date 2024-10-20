// Classe pour les particules (effet visuel)
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = random(5, 10);
        this.lifespan = 255; // Durée de vie
    }

    update() {
        this.lifespan -= 5;
    }

    display() {
        fill(255, this.lifespan);
        noStroke();
        ellipse(this.x, this.y, this.size);
    }

    isFinished() {
        return this.lifespan < 0;
    }
}
