let player;
let obstacles = [];
let walls = [];
let wallWidth = 50;  // Largeur ajustée des murs
let cameraOffset = 0;
let wallSegmentHeight = 200;  // Hauteur de chaque segment de mur
let baseSpeed = 2;  // Vitesse de base

function setup() {
    createCanvas(windowWidth, windowHeight);
    player = new Player();

    // Créer des segments de mur initiaux
    for (let i = 0; i < 10; i++) {
        walls.push(new WallSegment(-i * wallSegmentHeight));
    }

    // Générer des obstacles au début
    obstacles.push(new Obstacle());
}

function draw() {
    background(255, 50, 50);

    // Suivre le joueur avec la caméra
    translate(0, cameraOffset);

    // Afficher et prolonger les murs
    for (let i = walls.length - 1; i >= 0; i--) {
        walls[i].display();

        // Ajouter de nouveaux segments si des murs sortent de l'écran
        if (walls[i].offscreen()) {
            walls.splice(i, 1);
            walls.push(new WallSegment(walls[walls.length - 1].y - wallSegmentHeight));
        }
    }

    // Gérer le joueur
    player.update();
    player.display();

    // Mettre à jour la caméra
    cameraOffset = -player.y + height / 2;

    // Générer et afficher des obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].update();
        obstacles[i].display();

        // Retirer les obstacles hors de l'écran et en générer de nouveaux
        if (obstacles[i].offscreen()) {
            obstacles.splice(i, 1);
            obstacles.push(new Obstacle());
        }
    }

    // Générer de nouveaux obstacles de façon régulière
    if (frameCount % 75 === 0) {
        obstacles.push(new Obstacle());
    }
}

// Classe joueur
class Player {
    constructor() {
        this.x = width / 2;
        this.y = height / 2;
        this.size = 20;
        this.xSpeed = 3;  // Vitesse horizontale
        this.ySpeed = baseSpeed;  // Vitesse verticale
        this.isReversing = false;
    }

    update() {
        // Déplacement vertical constant
        this.y -= this.ySpeed;

        // Déplacement diagonal
        this.x += this.xSpeed;

        // Rebondir sur les murs
        if (this.x <= wallWidth || this.x >= width - wallWidth) {
            this.xSpeed *= -1; // Change la direction
        }

        // Gestion de l'inversion temporaire
        if (this.isReversing) {
            this.xSpeed *= -1; // Change la direction temporairement
            this.isReversing = false; // Réinitialise l'inversion
        }
    }

    display() {
        fill(255);
        noStroke();
        ellipse(this.x, this.y, this.size);
    }

    reverseDirection() {
        this.isReversing = true;
    }
}

// Classe obstacle (attaché aux murs)
class Obstacle {
    constructor() {
        this.w = random(10, 50);
        this.h = random(20, 50);
        this.y = -this.h + cameraOffset;

        // Positionner l'obstacle sur le mur gauche ou droit
        if (random() > 0.5) {
            this.x = wallWidth;
        } else {
            this.x = width - wallWidth - this.w;
        }
    }

    update() {
        this.y += baseSpeed;  // Bouge les obstacles vers le bas
    }

    display() {
        fill(0);
        noStroke();
        rect(this.x, this.y, this.w, this.h);
    }

    offscreen() {
        return (this.y > height + cameraOffset);
    }
}

// Classe segment de mur
class WallSegment {
    constructor(y) {
        this.y = y;
        this.h = wallSegmentHeight;
    }

    display() {
        // Mur gauche
        fill(0);
        rect(0, this.y, wallWidth, this.h);

        // Mur droit
        rect(width - wallWidth, this.y, wallWidth, this.h);
    }

    offscreen() {
        return this.y > height + cameraOffset;
    }
}

// Gestion de l'inversion de la direction
function touchStarted() {
    player.reverseDirection();  // Inverser la direction du joueur
    return false;
}
