class Enemy {
  constructor(x, y, velocityY) {
    this.element = document.createElement('div');
    this.element.className = 'enemy';
    this.element.style.left = x + 'px';
    this.element.style.top = y + 'px';
    document.querySelector('.game-container').appendChild(this.element);

    this.x = x;
    this.y = y;
    this.velocityY = velocityY;
    this.health = 3; // Nombre de coups nécessaires pour tuer l'ennemi
    this.fireInterval = Math.random() * (3000 - 1000) + 1000; // Interval de tir aléatoire entre 1 et 3 secondes
    this.lastFireTime = 0; // Temps du dernier tir
  }

  update() {
    this.y += this.velocityY;
    this.element.style.top = this.y + 'px';

    this.tryToShoot(); // Essayer de tirer à chaque mise à jour
  }

  remove() {
    this.element.remove();
  }

  hit() {
    this.health--; // Réduire la santé de l'ennemi lorsqu'il est touché par un projectile

    if (this.health <= 0) {
      // Si la santé de l'ennemi atteint 0 ou moins, le supprimer
      this.remove();
      return true; // Indiquer que l'ennemi a été tué
    }

    return false; // Indiquer que l'ennemi est encore en vie
  }

  tryToShoot() {
    const currentTime = Date.now();
    if (currentTime - this.lastFireTime > this.fireInterval) {
      this.shoot();
      this.lastFireTime = currentTime;
    }
  }

  shoot() {
    const projectile = new Projectile(
      this.x + this.element.offsetWidth / 2,
      this.y + this.element.offsetHeight,
      0, // Vitesse horizontale nulle
      5 // Vitesse verticale vers le bas
    );
    projectiles.push(projectile);
  }
}

const enemies = [];

function createEnemy() {
  const x = Math.random() * (window.innerWidth - 150); // Position horizontale aléatoire
  const enemy = new Enemy(x, -150, 2); // Créer un nouvel ennemi en haut de l'écran
  enemies.push(enemy);
}




function handlePlayerProjectileCollision() {
  for (let i = 0; i < projectiles.length; i++) {
    const projectileRect = projectiles[i].element.getBoundingClientRect(); // Récupérer le rectangle de collision du projectile

    for (let j = 0; j < enemies.length; j++) {
      const enemyRect = enemies[j].element.getBoundingClientRect(); // Récupérer le rectangle de collision de l'ennemi

      // Vérifier la collision entre le projectile et l'ennemi
      if (
        projectileRect.bottom >= enemyRect.top &&
        projectileRect.top <= enemyRect.bottom &&
        projectileRect.right >= enemyRect.left &&
        projectileRect.left <= enemyRect.right
      ) {
        // Collision détectée entre le projectile du joueur et un ennemi
        const enemyDestroyed = enemies[j].hit(); // Essayez de frapper l'ennemi
        if (enemyDestroyed) {
          // Si l'ennemi est détruit, supprimez-le de la liste des ennemis
          enemies.splice(j, 1);
          j--; // Décrémentez j pour éviter les erreurs d'index après la suppression
          enemiesKilled++; // Incrémentez le compteur d'ennemis tués
          updateEnemiesKilledUI(); // Mettez à jour l'affichage des ennemis tués
        }

        // Supprimez le projectile du joueur seulement s'il a touché un ennemi
        projectiles[i].element.remove();
        projectiles.splice(i, 1);
        break; // Sortez de la boucle ennemis pour passer au projectile suivant
      }
    }
  }
}





function updateEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].update();

    // Supprimer les ennemis qui sortent de l'écran
    if (enemies[i].y > window.innerHeight) {
      enemies[i].remove();
      enemies.splice(i, 1);
      i--;
    }
  }
}

function updateEnemiesKilledUI() {
  const enemiesKilledElement = document.getElementById('enemies-killed');
  enemiesKilledElement.textContent = 'Ennemis tués : ' + enemiesKilled;
}

setInterval(updateEnemies, 1000 / 60);
setInterval(createEnemy, 2000); // Créer un nouvel ennemi toutes les 2 secondes
