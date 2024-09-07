document.addEventListener('DOMContentLoaded', function() {
  const avion = document.getElementById('avion');
  const gameContainer = document.querySelector('.game-container');
  const avionWidth = avion.offsetWidth;
  const avionHeight = avion.offsetHeight;
  const gameContainerWidth = gameContainer.offsetWidth;
  const gameContainerHeight = gameContainer.offsetHeight;
  const clouds = document.querySelectorAll('.cloud');
  let tirer = false; // Variable pour suivre si on tire ou non

  // Fonction pour déplacer l'avion
  function moveAvion(xDistance, yDistance) {
    let avionLeft = avion.offsetLeft + xDistance;
    let avionTop = avion.offsetTop + yDistance;
    avionLeft = Math.max(avionLeft, 0); // Limite gauche
    avionLeft = Math.min(avionLeft, gameContainerWidth - avionWidth); // Limite droite
    avionTop = Math.max(avionTop, 0); // Limite haut
    avionTop = Math.min(avionTop, gameContainerHeight - avionHeight); // Limite bas
    avion.style.left = avionLeft + 'px';
    avion.style.top = avionTop + 'px';
  }

  // Fonction pour faire feu
  function fire() {
    if (tirer) {
      const avion = document.getElementById('avion');
      const avionRect = avion.getBoundingClientRect();
      const avionWidth = avionRect.width;
  
      // Trouver l'ennemi le plus proche
      let closestEnemy = null;
      let closestDistance = Infinity;
      for (let i = 0; i < enemies.length; i++) {
        const enemyRect = enemies[i].element.getBoundingClientRect();
        const distance = Math.sqrt(Math.pow(avionRect.left - enemyRect.left, 2) + Math.pow(avionRect.top - enemyRect.top, 2));
        if (distance < closestDistance) {
          closestEnemy = enemies[i];
          closestDistance = distance;
        }
      }
  
      if (closestEnemy) {
        // Calculer la direction vers l'ennemi le plus proche
        const dx = closestEnemy.x - avionRect.left + closestEnemy.element.offsetWidth / 2;
        const dy = closestEnemy.y - avionRect.top;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const velocityX = dx / distance * 5; // Vitesse horizontale du projectile
        const velocityY = dy / distance * 5; // Vitesse verticale du projectile
  
        // Créer un projectile
        const projectile = document.createElement('div');
        projectile.className = 'projectile';
        projectile.style.left = (avionRect.left + (avionWidth / 2)) + 'px'; // Positionner le projectile devant l'avion
        projectile.style.top = (avionRect.top) + 'px'; // Positionner le projectile au-dessus de l'avion
        document.body.appendChild(projectile); // Ajouter le projectile au corps du document
  
        // Déplacer le projectile vers l'ennemi le plus proche
        const projectileInterval = setInterval(() => {
          const projectileRect = projectile.getBoundingClientRect();
          const enemyRect = closestEnemy.element.getBoundingClientRect();
  
          // Vérifier la collision entre le projectile et l'ennemi
          if (
            projectileRect.bottom >= enemyRect.top &&
            projectileRect.top <= enemyRect.bottom &&
            projectileRect.right >= enemyRect.left &&
            projectileRect.left <= enemyRect.right
          ) {
            // Supprimer le projectile lorsqu'il touche l'ennemi
            clearInterval(projectileInterval);
            document.body.removeChild(projectile);
            closestEnemy.hit(); // Frapper l'ennemi
          } else {
            // Déplacement du projectile vers l'ennemi
            projectile.style.left = (parseInt(projectile.style.left) + velocityX) + 'px';
            projectile.style.top = (parseInt(projectile.style.top) + velocityY) + 'px';
          }
        }, 50); // Ajustez la vitesse du projectile selon vos besoins
      }
    }
  }
  

  // Fonction pour gérer le mouvement de l'avion avec le tactile
  function touchMove(event) {
    event.preventDefault(); // Empêcher le comportement par défaut du toucher (comme le défilement)
    const touch = event.touches[0];
    const touchX = touch.clientX;
    const touchY = touch.clientY;
    const avionX = avion.getBoundingClientRect().left;
    const avionY = avion.getBoundingClientRect().top;
    const xDistance = touchX - avionX - (avionWidth / 2);
    const yDistance = touchY - avionY - (avionHeight / 2);
    moveAvion(xDistance, yDistance);
  }

  // Gestionnaire d'événement pour le toucher de l'avion
  avion.addEventListener('mousedown', function() {
    tirer = true; // Commencer à tirer lorsque l'utilisateur touche l'avion avec la souris
    fire();
  });

  // Gestionnaire d'événement pour l'arrêt du toucher de l'avion
  avion.addEventListener('mouseup', function() {
    tirer = false; // Arrêter de tirer lorsque l'utilisateur arrête de toucher l'avion avec la souris
  });

  // Gestionnaire d'événement pour le toucher de l'avion sur les appareils tactiles
  avion.addEventListener('touchstart', function(event) {
    tirer = true; // Commencer à tirer lorsque l'utilisateur touche l'avion avec le tactile
    fire();
    touchMove(event); // Appeler la fonction pour déplacer l'avion avec le tactile
  });

  // Gestionnaire d'événement pour l'arrêt du toucher de l'avion sur les appareils tactiles
  avion.addEventListener('touchend', function(event) {
    tirer = false; // Arrêter de tirer lorsque l'utilisateur arrête de toucher l'avion avec le tactile
  });

  // Gestionnaire d'événement pour déplacer l'avion avec la souris
  document.addEventListener('mousemove', function(event) {
    if (event.target === avion && tirer) {
      const mouseX = event.clientX;
      const mouseY = event.clientY;
      const avionX = avion.getBoundingClientRect().left;
      const avionY = avion.getBoundingClientRect().top;
      const xDistance = mouseX - avionX - (avionWidth / 2);
      const yDistance = mouseY - avionY - (avionHeight / 2);
      moveAvion(xDistance, yDistance);
    }
  });

  // Gestionnaire d'événement pour le mouvement de l'avion avec le tactile
  document.addEventListener('touchmove', touchMove);

});
