// Classe pour gérer l'état du jeu (menu, jeu, gameover)
class GameState {
    constructor() {
      this.state = 'menu'; // Etat initial du jeu
    }
  
    setState(newState) {
      this.state = newState;
    }
  
    is(state) {
      return this.state === state;
    }
  }
  
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
  
  // Classe pour les obstacles (hérite de OrbitalObject)
  class Obstacle extends OrbitalObject {
    constructor(radius) {
      super(radius, random(0.02, 0.04));
      this.direction = 1;
    }
  
    display() {
      fill(255, 0, 0);
      noStroke();
      ellipse(this.x, this.y, 30); // Taille de l'obstacle
    }
  
    checkCollision(px, py) {
      let d = dist(px, py, this.x, this.y);
      return d < 30; // Vérifie la collision avec le joueur
    }
  
    invertDirection() {
      this.direction *= -1;
      this.speed *= this.direction;
    }
  }
  
  // Classe pour les items à collecter (hérite de OrbitalObject)
  class Item extends OrbitalObject {
    constructor() {
      super(radiusOrbits[floor(random(3))], 0); // Pas de mouvement
    }
  
    display() {
      fill(255, 204, 0);
      noStroke();
      ellipse(this.x, this.y, 15); // Taille et couleur de l'item
    }
  
    checkTouch(px, py) {
      let d = dist(px, py, this.x, this.y);
      return d < 20; // Vérifie si le joueur touche l'item
    }
  
    respawn() {
      this.angle = random(TWO_PI);
      this.radius = radiusOrbits[floor(random(3))];
      this.update(); // Met à jour la position
    }
  }
  
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
  