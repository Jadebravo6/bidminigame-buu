// Définir la santé initiale du joueur
let playerHealth = 100; // Par exemple, la santé initiale du joueur est de 100
// Définir la santé maximale du joueur
let maxPlayerHealth = 100; // Par exemple, la santé maximale du joueur est de 100

class Projectile {
  constructor(x, y, velocityX, velocityY) {
    this.element = document.createElement('div');
    this.element.className = 'projectile';
    this.element.style.left = x + 'px';
    this.element.style.top = y + 'px';
    document.querySelector('.projectiles').appendChild(this.element);
    
    this.x = x;
    this.y = y;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
  }

  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;

    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
  }
}

const projectiles = [];
let isFiring = false;
let isMovingLeft = false;
let isMovingRight = false;
let enemiesKilled = 0;

document.addEventListener('keydown', function(event) {
  if (event.code === 'Space') {
    isFiring = true;
  } else if (event.code === 'ArrowLeft') {
    isMovingLeft = true;
  } else if (event.code === 'ArrowRight') {
    isMovingRight = true;
  }
});

document.addEventListener('keyup', function(event) {
  if (event.code === 'Space') {
    isFiring = false;
  } else if (event.code === 'ArrowLeft') {
    isMovingLeft = false;
  } else if (event.code === 'ArrowRight') {
    isMovingRight = false;
  }
});

// Écouter l'événement de dégâts infligés au joueur
document.addEventListener('playerDamaged', function(event) {
  playerHealth -= event.detail.damage; // Réduire la santé du joueur
  if (playerHealth < 0) {
    playerHealth = 0; // Assurer que la santé ne devient pas négative
  }
  updatePlayerHealthBar(); // Mettre à jour l'affichage de la barre de vie du joueur
});

// Fonction pour mettre à jour la barre de vie du joueur
// Fonction pour mettre à jour la barre de vie du joueur
function updatePlayerHealthBar() {
  const healthBarFill = document.getElementById('health-bar-fill');
  const playerHealthDisplay = document.getElementById('player-health');
  const healthBarWidth = (playerHealth / maxPlayerHealth) * 100;
  
  healthBarFill.style.width = healthBarWidth + '%';
  playerHealthDisplay.textContent = playerHealth;
}


function handleEnemyProjectileCollision() {
  const damage = 2; // Dégâts infligés par chaque projectile ennemi
  // Déclencher l'événement de dégâts infligés au joueur
  document.dispatchEvent(new CustomEvent('playerDamaged', { detail: { damage: damage } }));
}





// Charger le fichier audio
const fireSound = new Audio('assets/sound/f14/fire.mp3');

function fireProjectile() {
  // Jouer le son de tir
  fireSound.play();

  const avion = document.getElementById('avion');
  const avionRect = avion.getBoundingClientRect();
  const avionWidth = avionRect.width;
  const avionHeight = avionRect.height;
  const projectile = new Projectile(
    avionRect.left + avionWidth / 2,
    avionRect.top - avionHeight / 2,
    0,
    -5 // Vitesse initiale vers le haut
  );
  projectiles.push(projectile);
}

function moveAvion() {
  const avion = document.getElementById('avion');
  const avionRect = avion.getBoundingClientRect();
  const avionWidth = avionRect.width;
  const gameContainer = document.querySelector('.game-container');
  const gameContainerRect = gameContainer.getBoundingClientRect();
  const gameContainerWidth = gameContainerRect.width;

  if (isMovingLeft && avionRect.left > 0) {
    avion.style.left = Math.max(avionRect.left - 5, 0) + 'px';
  }

  if (isMovingRight && avionRect.right < gameContainerWidth) {
    avion.style.left = Math.min(avionRect.left + 5, gameContainerWidth - avionWidth) + 'px';
  }
}




function updateProjectiles() {
  for (let i = 0; i < projectiles.length; i++) {
    // Vérifiez si projectiles[i] est défini
    if (projectiles[i]) {
      projectiles[i].update();
      
      // Vérifiez les collisions avec les ennemis
      for (let j = 0; j < enemies.length; j++) {
        const projectileRect = projectiles[i].element.getBoundingClientRect();
        const enemyRect = enemies[j].element.getBoundingClientRect();

        if (
          projectileRect.bottom >= enemyRect.top &&
          projectileRect.top <= enemyRect.bottom &&
          projectileRect.right >= enemyRect.left &&
          projectileRect.left <= enemyRect.right
        ) {
          // Collision détectée entre le projectile et un ennemi
          // Réduisez la santé de l'ennemi ou détruisez l'ennemi
          const enemyDestroyed = enemies[j].hit(); // Essayez de frapper l'ennemi
          if (enemyDestroyed) {
            // Si l'ennemi est détruit, supprimez-le de la liste des ennemis
            enemies.splice(j, 1);
            j--; // Décrémentez j pour éviter les erreurs d'index après la suppression
            enemiesKilled++; // Incrémentez le compteur d'ennemis tués
            updateEnemiesKilledUI(); // Mettez à jour l'affichage des ennemis tués
          }
          
          // Supprimez le projectile
          projectiles[i].element.remove();
          projectiles.splice(i, 1);
          break; // Sortez de la boucle ennemis pour passer au projectile suivant
        }
      }

      // Supprimez les projectiles qui sortent de l'écran
      if (
        projectiles[i] &&
        (projectiles[i].x < 0 ||
          projectiles[i].x > window.innerWidth ||
          projectiles[i].y < 0 ||
          projectiles[i].y > window.innerHeight)
      ) {
        projectiles[i].element.remove();
        projectiles.splice(i, 1);
        i--;
      }
    }
  }
}


setInterval(moveAvion, 1000 / 60);
setInterval(updateProjectiles, 1000 / 60);

setInterval(function() {
  if (isFiring) {
    fireProjectile();
  }
}, 500); // Interval pour le tir en rafale
