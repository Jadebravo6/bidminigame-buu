let player;
let obstacles = [];
let gameOver = false;
let marginWidth = 80; // Largeur des marges à gauche et à droite
let cameraOffset = 0; // Décalage de la caméra pour suivre le joueur

function setup() {
    createCanvas(windowWidth, windowHeight);
    player = new Player();
}

function draw() {
    background(255, 50, 50);

    // Dessiner l'espace noir sur les côtés
    fill(0);
    rect(0, 0, marginWidth, height); // Mur gauche
    rect(width - marginWidth, 0, marginWidth, height); // Mur droit

    // Suivi du joueur par la caméra
    translate(0, cameraOffset);  // Décalage de la caméra vers le haut pour suivre le joueur

    if (!gameOver) {
        player.update();
        player.display();

        // Mise à jour de la position de la caméra pour suivre le joueur
        cameraOffset = -player.y + height / 2;

        // Générer de nouveaux obstacles à intervalles réguliers
        if (frameCount % 50 === 0) { // Moins de frames pour générer les obstacles plus souvent
            obstacles.push(new Obstacle('left'));
            obstacles.push(new Obstacle('right'));
        }

        // Affichage et mise à jour des obstacles
        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].update();
            obstacles[i].display();

            // Vérifier les collisions avec le joueur
            if (obstacles[i].hits(player)) {
                gameOver = true;
            }

            // Retirer les obstacles qui sortent de l'écran
            if (obstacles[i].offscreen()) {
                obstacles.splice(i, 1);
            }
        }
    } else {
        // Afficher le message de fin de partie
        fill(0);
        textSize(48);
        textAlign(CENTER);
        text("Game Over", width / 2, -cameraOffset + height / 2);
        textSize(24);
        text("Tap to restart", width / 2, -cameraOffset + height / 2 + 50);
    }
}

function touchStarted() {
    if (gameOver) {
        resetGame();
    } else {
        player.startReverse();  // Inverser la direction
    }
}

function touchEnded() {
    if (!gameOver) {
        player.endReverse();  // Arrêter l'inversion
    }
}

class Player {
    constructor() {
        this.x = width / 2;
        this.y = height / 2;
        this.size = 20;
        this.xSpeed = 3; // Vitesse horizontale (gauche/droite)
        this.ySpeed = -3; // Vitesse verticale (vers le haut)
        this.isReversing = false;
        this.reverseStartX = 0;
        this.reverseStartY = 0;
    }

    update() {
        this.y += this.ySpeed; // Le joueur monte en permanence
        this.x += this.xSpeed; // Le joueur se déplace en diagonale

        // Rebondir sur les marges gauche et droite
        if (this.x <= marginWidth || this.x >= width - marginWidth) {
            this.xSpeed *= -1; // Inverser la direction horizontale
        }

        // Gestion de l'inversion de direction
        if (this.isReversing) {
            if (dist(this.x, this.y, this.reverseStartX, this.reverseStartY) >= 100) {
                this.xSpeed *= -1; // Retour à la direction normale
                this.isReversing = false;
            }
        }
    }

    startReverse() {
        this.reverseStartX = this.x;
        this.reverseStartY = this.y;
        this.xSpeed *= -1;  // Inverser la direction diagonale
        this.isReversing = true;
    }

    endReverse() {
        this.isReversing = false;
        this.xSpeed *= -1; // Inverser à nouveau si on relâche avant la fin
    }

    display() {
        fill(255);
        noStroke();
        ellipse(this.x, this.y, this.size);
    }
}

class Obstacle {
    constructor(side) {
        this.h = random(20, 50);   // Hauteur aléatoire
        this.y = -this.h + cameraOffset;  // Commence au-dessus de l'écran
        this.speed = 3;    // Vitesse de descente

        // Générer les obstacles attachés aux marges
        if (side === 'left') {
            // Obstacle attaché à la marge gauche
            this.w = random(10, 50);
            this.x = marginWidth;  // Position sur la marge gauche
        } else {
            // Obstacle attaché à la marge droite
            this.w = random(10, 50);
            this.x = width - marginWidth - this.w;  // Position sur la marge droite
        }
    }

    update() {
        this.y += this.speed;  // Descente
    }

    display() {
        fill(0);
        noStroke();
        rect(this.x, this.y, this.w, this.h);
    }

    offscreen() {
        return (this.y > height + cameraOffset);  // Vérifier si l'obstacle est sorti de l'écran
    }

    hits(player) {
        return (
            player.y < this.y + this.h &&
            player.y + player.size > this.y &&
            player.x > this.x &&
            player.x < this.x + this.w
        );
    }
}

function resetGame() {
    gameOver = false;
    player = new Player();
    obstacles = [];
    cameraOffset = 0;  // Réinitialiser la caméra
}
