// Classe Wall pour représenter les murs
class Wall {
    constructor(x, y, w, h) {
        this.x = x; // Position X du mur
        this.y = y; // Position Y du mur
        this.w = w; // Largeur du mur
        this.h = h; // Hauteur du mur (prend toute la hauteur de l'écran)
    }

    // Affichage du mur
    display() {
        fill(255); // Couleur blanche pour les murs
        noStroke();
        rect(this.x, this.y, this.w, this.h); // Dessiner le mur comme un rectangle
    }
}