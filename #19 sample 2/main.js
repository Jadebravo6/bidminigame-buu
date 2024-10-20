// Gestion du jeu
let player;
let orbits = [];
let radiusOrbits = [70, 100, 130];
let obstacles = [];
let item;
let particles = [];
let stars = [];
let score = 0;
let gameOver = false;
let menuActive = true;
let baseSpeed = 2; // Ajout d'une vitesse de base
let gameState = new GameState(); // Utilisation du gestionnaire d'état

function setup() {
    createCanvas(windowWidth, windowHeight);

    // Créer des étoiles pour le fond
    for (let i = 0; i < 50; i++) {
        stars.push(new Star());
    }

    // Créer les orbites
    for (let i = 0; i < 3; i++) {
        orbits.push(new Orbit(radiusOrbits[i]));
    }

    // Initialiser le joueur
    player = new Player(orbits[0].radius);

    // Créer un item
    item = new Item();
}

function draw() {
    background('#050135');

    // Afficher les étoiles en fond
    for (let star of stars) {
        star.update();
        star.display();
    }

    if (gameState.is('menu')) {
        displayMenu();
    } else if (gameState.is('playing')) {
        playGame();
    } else if (gameState.is('gameover')) {
        displayGameOver();
    }
}

function playGame() {
    // Affichage des orbites
    for (let orbit of orbits) {
        orbit.display();
    }

    // Affichage et mise à jour du joueur
    player.update();
    player.display();

    // Affichage et mise à jour de l'item
    if (item) {
        item.display();
    }

    // Gérer la collecte de l'item
    if (item && item.checkTouch(player.x, player.y)) {
        score++;
        particles.push(new Particle(item.x, item.y));
        item.respawn();

        // Ajouter des obstacles en fonction du score
        addObstacle();
    }

    // Afficher les obstacles et vérifier les collisions
    for (let obstacle of obstacles) {
        obstacle.update();
        obstacle.display();
        if (obstacle.checkCollision(player.x, player.y)) {
            gameOver = true;
            gameState.setState('gameover');
        }
    }

    // Gérer les particules
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].display();
        if (particles[i].isFinished()) {
            particles.splice(i, 1);
        }
    }

    // Afficher le score
    displayScore();
}

// Fonction pour ajouter des obstacles en fonction du score
function addObstacle() {
    if (score >= 5 && obstacles.length < 3) {
        // Ajoutez un obstacle dans l'orbite correspondante en fonction du score
        let orbitIndex = score - 5; // 5 -> 0, 6 -> 1, 8 -> 2
        if (orbitIndex < radiusOrbits.length) {
            // Vérifiez si l'orbite a déjà un obstacle
            if (!obstacles.some(obstacle => obstacle.radius === radiusOrbits[orbitIndex])) {
                obstacles.push(new Obstacle(radiusOrbits[orbitIndex]));
            }
        }
    }
}

function displayMenu() {
    fill('#ffbc63');
    textSize(50);
    textAlign(CENTER);
    text("Orbit Dash", width / 2, height / 2 - 100);
    
    fill('#ffbc63');
    rectMode(CENTER);
    rect(width / 2, height / 2, 200, 50);
    
    fill(0);
    textSize(30);
    text("Play", width / 2, height / 2 + 10);
}

function displayGameOver() {
    background("#050135");
    fill(255, 0, 0);
    textSize(54);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 3 - 10);
    fill('#ffbc63');
    textSize(25);
    text('Score: ' + score, width / 2, height / 2 + 20);
    text('Try again', width / 2, height / 2 + 150);
}

// Fonction pour afficher le score
function displayScore() {
    textSize(32);
    fill("#ffbc63");
    textAlign(CENTER, CENTER);
    text(score, width / 2, height - 50);
}

function touchStarted() {
    console.log("Screen touched!");
    if (gameState.is('menu')) {
        gameState.setState('playing');
    } else if (gameState.is('gameover')) {
        resetGame();
    } else if (gameState.is('playing')) {
        // Changement d'orbite
        let currentIndex = orbits.findIndex(orbit => orbit.radius === player.radius);
        let nextOrbitIndex = (currentIndex + 1) % orbits.length; 
        player.changeOrbit(orbits[nextOrbitIndex].radius);
        console.log(`Changed orbit to radius: ${player.radius}`); // Vérifiez le rayon du joueur
    }
    return false;
}

function resetGame() {
    score = 0;
    obstacles = [];
    player = new Player(orbits[0].radius);
    item = new Item();
    gameState.setState('playing');
}
