let player;
let orbits = [];
let currentOrbit = 0; // La position actuelle de l'orbite du joueur
let radiusOrbits = [70, 100, 130]; // Rayons des 3 orbites
let baseSpeed = 2; // Vitesse de base en pixels par frame
let isTouching = false; // Variable pour gérer l'état du toucher
let score = 0; // Score du joueur
let item; // L'item à toucher
let obstacles = []; // Tableau pour les obstacles
let particles = []; // Tableau pour les particules
let stars = []; // Tableau pour les étoiles dans le fond
let gameOver = false; // État de fin de jeu
let menuActive = true; // Variable pour gérer l'affichage du menu

let collectSound, gameOverSound, obstacleSound, switchOrbitSound; // Sons

let inversionAt15Done = false; // Indicateur pour savoir si l'inversion à 15 a été faite
let randomInversionActive = false; // Indicateur pour savoir si l'inversion aléatoire après 20 est activée

// Précharger les sons
function preload() {
  // Charger les sons - tu devras ajouter les chemins corrects
  collectSound = loadSound('sound/collect.wav');
  gameOverSound = loadSound('sound/gameover.wav');
  obstacleSound = loadSound('sound/obstacle.wav'); // Son pour l'apparition d'un obstacle
  switchOrbitSound = loadSound('sound/switchOrbit.wav'); // Son pour le changement d'orbite
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Créer des étoiles pour le fond
  for (let i = 0; i < 50; i++) {
    stars.push(new Star());
  }
  
  // Créer 3 orbites
  for (let i = 0; i < 3; i++) {
    orbits.push(new Orbit(radiusOrbits[i]));
  }

  // Initialiser le joueur sur la première orbite
  player = new Player(orbits[currentOrbit].radius);
  
  // Créer un item au départ
  item = new Item();
}

function draw() {
  background('#050135');
  
  // Afficher les étoiles en fond
  for (let star of stars) {
    star.update();
    star.display();
  }

  if (menuActive) {
    displayMenu(); // Affiche le menu principal
  } else {
    // Afficher les orbites
    for (let orbit of orbits) {
      orbit.display();
    }
  
    // Afficher le joueur
    player.display();
  
    // Afficher l'item
    if (item) {
      item.display();
    }
  
    if (!gameOver) {
      // Mise à jour du joueur (mouvement circulaire)
      player.update();
  
      // Vérifier la collision avec l'item
      if (item && item.checkTouch(player.getPosition().x, player.getPosition().y)) {
        score++; // Incrémenter le score
        console.log('Score: ' + score);
        collectSound.play(); // Jouer le son de collecte
        particles.push(new Particle(item.x, item.y));
        item.respawn();
  
        // Ajouter des obstacles selon le score et jouer un son quand un obstacle apparaît
        if (score === 3 || score === 6 || score === 8) {
          let orbitIndex = (score === 3) ? 0 : (score === 6) ? 1 : 2;
          obstacles.push(new Obstacle(orbitIndex));
          obstacleSound.play(); // Jouer le son de l'apparition d'un obstacle
        }
      }
  
      // Gérer l'inversion de direction à 15 points (une seule fois)
      if (score >= 20 && !inversionAt15Done) {
        for (let obstacle of obstacles) {
          obstacle.invertDirection(); // Inverser la direction une fois
        }
        inversionAt15Done = true; // Marquer l'inversion comme faite
      }
  
      // Changer aléatoirement la direction des obstacles après 20 points
      if (score >= 25 && !randomInversionActive) {
        randomInversionActive = true; // Activer l'inversion aléatoire
      }
  
      // Si inversion aléatoire est active, changer parfois la direction
      if (randomInversionActive) {
        for (let obstacle of obstacles) {
          if (random() < 0.01) { // 1% de chance de changer de direction à chaque frame
            obstacle.invertDirection();
          }
        }
      }
  
      // Vérifier les collisions avec les obstacles
      for (let obstacle of obstacles) {
        obstacle.update();
        obstacle.display();
        if (obstacle.checkCollision(player.getPosition().x, player.getPosition().y)) {
          gameOver = true; // Fin de partie si collision
          gameOverSound.play(); // Jouer le son de Game Over
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
    } else {
      displayGameOver();
    }
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

// Le reste de ton code reste inchangé : Orbits, Player, Item, Obstacle, etc.


// Classe pour les orbites
class Orbit {
  constructor(radius) {
    this.radius = radius;
  }

  display() {
    noFill();
    stroke(255);
    ellipse(width / 2, height / 2, this.radius * 2);
  }
}

// Classe pour le joueur
class Player {
  constructor(radius) {
    this.angle = 0; // Angle initial
    this.radius = radius; // Rayon initial (orbite actuelle)
    this.speed = this.calculateSpeed(); // Vitesse ajustée pour l'orbite actuelle
  }

  calculateSpeed() {
    return baseSpeed / this.radius; // Calcul de la vitesse angulaire
  }

  update() {
    this.angle += this.speed; // Mise à jour de l'angle avec la vitesse calculée
  }

  display() {
    let x = width / 2 + cos(this.angle) * this.radius;
    let y = height / 2 + sin(this.angle) * this.radius;
    //couleur du player
    fill("#ffbc63");
    noStroke();
    ellipse(x, y, 25); // Taille du joueur
  }

  getPosition() {
    return {
      x: width / 2 + cos(this.angle) * this.radius,
      y: height / 2 + sin(this.angle) * this.radius
    };
  }

  changeOrbit(newRadius) {
    this.radius = newRadius;
    this.speed = this.calculateSpeed(); // Recalculer la vitesse pour la nouvelle orbite
  }
}

// Classe pour l'item
class Item {
  constructor() {
    this.respawn(); // Appeler la méthode respawn pour positionner l'item
  }

  respawn() {
    // Choisir une orbite aléatoire
    this.orbitIndex = floor(random(3)); // Choisir une orbite entre 0 et 2
    this.radius = radiusOrbits[this.orbitIndex]; // Mettre à jour le rayon
    this.angle = random(TWO_PI); // Nouvelle position aléatoire sur l'orbite
    this.updatePosition(); // Mettre à jour la position de l'item
  }

  updatePosition() {
    this.x = width / 2 + cos(this.angle) * this.radius; // Position x
    this.y = height / 2 + sin(this.angle) * this.radius; // Position y
  }

  display() {
    fill(255, 204, 0);
    noStroke();
    ellipse(this.x, this.y, 15); // Taille de l'item
  }

  checkTouch(px, py) {
    let d = dist(px, py, this.x, this.y);
    return d < 20; // Vérifier si le joueur touche l'item
  }
}

class Obstacle {
    constructor(orbitIndex) {
      this.orbitIndex = orbitIndex; // Index de l'orbite où l'obstacle apparaît
      this.angle = random(TWO_PI); // Position aléatoire sur l'orbite
      this.radius = radiusOrbits[this.orbitIndex]; // Rayon de l'orbite
      this.speed = random(0.02, 0.04); // Génère une vitesse aléatoire pour chaque obstacle
      this.direction = 1; // Direction de mouvement : 1 pour horaire, -1 pour antihoraire
    }
  
    update() {
      this.angle += this.speed * this.direction; // Mise à jour de l'angle de l'obstacle
    }
  
    display() {
      this.updatePosition(); // Mettre à jour la position avant d'afficher
      fill(255, 0, 0);
      noStroke();
      ellipse(this.x, this.y, 30); // Taille de l'obstacle
    }
  
    updatePosition() {
      this.x = width / 2 + cos(this.angle) * this.radius; // Position x
      this.y = height / 2 + sin(this.angle) * this.radius; // Position y
    }
  
    checkCollision(px, py) {
      let d = dist(px, py, this.x, this.y);
      return d < 30; // Vérifier si le joueur touche l'obstacle
    }
  
    // Inverser la direction
    invertDirection() {
      this.direction *= -1;
    }
  }
  
// Classe pour les particules
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(5, 10);
    this.lifespan = 255; // Durée de vie initiale
  }

  update() {
    this.lifespan -= 5; // Réduire la durée de vie
  }

  display() {
    fill(255, this.lifespan);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }

  isFinished() {
    return this.lifespan < 0; // Vérifier si la particule a fini sa durée de vie
  }
}

function touchStarted() {
  if (menuActive) {
    // Vérifier si le joueur a touché le bouton "Jouer"
    if (touches[0].x > width / 2 - 100 && touches[0].x < width / 2 + 100 &&
        touches[0].y > height / 2 - 25 && touches[0].y < height / 2 + 25) {
      menuActive = false; // Démarrer le jeu
    }
  } else if (gameOver) {
    // Réinitialiser le jeu après la fin
    resetGame();
  } else {
    if (!isTouching) {
      currentOrbit = (currentOrbit + 1) % 3; // Alterne entre les 3 orbites
      player.changeOrbit(orbits[currentOrbit].radius);
      switchOrbitSound.play(); // Jouer le son du changement d'orbite
      isTouching = true; // Indique qu'un toucher est en cours
    }
  }

  return false; // Empêche le comportement par défaut du navigateur
}

  
  function touchEnded() {
    isTouching = false; // Réinitialiser l'état du toucher une fois qu'il est terminé
    return false; // Empêche le comportement par défaut du navigateur
  }
  
function displayMenu() {
    fill(''); // Jaune pour le titre
    textAlign(CENTER);
    textSize(50);
    text("Orbit Dash", width / 2, height / 2 - 100); // Titre du jeu
  
    // Affichage du bouton "Jouer"
    fill('#ffbc63'); // Jaune pour le bouton
    rectMode(CENTER);
    rect(width / 2, height / 2, 200, 50, 10); // Bouton rectangulaire avec coins arrondis
  
    fill(0); // Texte noir
    textSize(30);
    text("play", width / 2, height / 2 + 10);
  }

  
// Fonction pour afficher le score
function displayScore() {
  textSize(32); // Taille de la police
  fill("#ffbc63"); // Couleur du texte
  textAlign(CENTER, CENTER);
  text( score, width / 2, height - 50); // Afficher le score au centre en bas de l'écran
}

// Fonction pour afficher l'écran de Game Over
function displayGameOver() {
  background("#050135")
  textSize(54); // Taille de la police
  fill(255,0,0); // Couleur du texte de game over
  textAlign(CENTER, CENTER);
  text('Game Over', width / 2, height / 3 - 10);
  textSize(25);
  fill('#ffbc63'); // Couleur du texte du score final
  text('Score: ' + score, width / 2, height / 2 + 20);

  
  fill('#ffbc63');
  text('try again', width / 2, height / 2 + 150);
}

// Réinitialiser le jeu
function mousePressed() {
  if (gameOver) {
    resetGame(); // Réinitialiser le jeu si c'est la fin
  }
}

// Fonction pour réinitialiser le jeu
function resetGame() {
  score = 0;
  obstacles = []; // Réinitialiser le tableau des obstacles
  gameOver = false; // Réinitialiser l'état du jeu
  player = new Player(orbits[currentOrbit].radius); // Réinitialiser le joueur
  item = new Item(); // Réinitialiser l'item
}
