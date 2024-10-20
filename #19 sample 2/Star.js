// Classe pour les étoiles dans le fond
class Star {
    constructor() {
        this.x = random(width);
        this.y = random(height);
        this.size = random(2, 5);
        this.speed = random(0.5, 2);
    }

    update() {
        this.y += this.speed;
        if (this.y > height) {
            this.y = 0;
            this.x = random(width);
        }
    }

    display() {
        fill(255);
        noStroke();
        ellipse(this.x, this.y, this.size);
    }
}
