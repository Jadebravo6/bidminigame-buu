// Classe Ball pour gérer la balle
class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speedY = 5; // Vitesse de déplacement vers le haut
        this.radius = 15; // Rayon de la balle
    }

    update() {
        // Simuler le déplacement vers le haut
        this.y -= this.speedY;
    }

    display() {
        fill(255, 0, 0);
        ellipse(this.x, this.y, this.radius * 2, this.radius * 2); // Dessiner la balle
    }
}