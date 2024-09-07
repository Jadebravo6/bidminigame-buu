const gunContainer = document.getElementById('gun-container');
const gunImage = document.getElementById('gun');
const messageElement = document.getElementById('message');
const countElement = document.getElementById('count');
const modal = document.getElementById("myModal");
const playerOption = document.getElementById("player-option");
const computerOption = document.getElementById("computer-option");
let fireSound;
let deguaineSound;
let animationPlayed = false;
let playerTurn = true; // Variable pour suivre le tour du joueur
let bulletCount = 5; // Nombre de coups de gun

// Fonction pour précharger le son
function preloadSound(url) {
  const audio = new Audio();
  audio.src = url;
  return audio;
}

// Préchargement des sons
fireSound = preloadSound('fire.m4a');
deguaineSound = preloadSound('deguaine.m4a');

// Fonction pour ouvrir le modal
function openModal() {
  modal.style.display = "block";
}

// Fonction pour fermer le modal
function closeModal() {
  modal.style.display = "none";
}

// Fermer le modal lorsqu'on clique en dehors de la zone de contenu
window.onclick = function(event) {
  if (event.target === modal) {
    closeModal();
  }
}

// Fonction pour effectuer le tir avec un choix aléatoire entre fire et deguaine
function performShot() {
  if (!animationPlayed && playerTurn && bulletCount > 0) {
    const playerRandomNumber = Math.random(); // Générer un nombre aléatoire pour le joueur
    if (playerRandomNumber < 0.5) {
      gunImage.src = 'fire.gif';
      if (fireSound) {
        fireSound.currentTime = 0; // Réinitialiser la position de lecture
        fireSound.play(); // Jouer le son de fire
      }
      setTimeout(() => {
        gameOver('player');
      }, 1000);
    } else {
      gunImage.src = 'deguaine2.gif';
      if (deguaineSound) {
        deguaineSound.currentTime = 0; // Réinitialiser la position de lecture
        deguaineSound.play(); // Jouer le son de deguaine
      }
      animationPlayed = true;
      setTimeout(() => {
        gunImage.src = 'repos.gif'; // Réinitialiser l'image après l'animation
        animationPlayed = false;
        playerTurn = false; // Passer le tour au PC
        bulletCount--; // Décrémenter le nombre de coups de gun
        updateCount(); // Mettre à jour l'affichage du décompte
        if (bulletCount === 0) {
          gameOver('nobody');
        } else {
          messageElement.textContent = "C'est au tour de l'ordinateur de tirer";
          messageElement.style.display = 'block';
          setTimeout(() => {
            messageElement.style.display = 'none'; // Masquer le message après quelques secondes
            computerTurn(); // Appeler la fonction pour le tour de l'ordinateur après que le joueur a tiré
          }, 2000); // Durée d'affichage du message en millisecondes
        }
      }, 1000); // Durée de l'animation en millisecondes
    }
    // Affichage du décompte
    updateCount();
  }
}

// Fonction pour le tour de l'ordinateur avec un choix aléatoire entre fire et deguaine
function computerTurn() {
  setTimeout(() => {
    const computerRandomNumber = Math.random(); // Générer un nombre aléatoire pour l'ordinateur
    if (computerRandomNumber < 0.5) {
      gunImage.src = 'fire.gif';
      if (fireSound) {
        fireSound.currentTime = 0; // Réinitialiser la position de lecture
        fireSound.play(); // Jouer le son de fire
      }
      setTimeout(() => {
        gameOver('computer');
      }, 1000);
    } else {
      gunImage.src = 'deguaine2.gif';
      if (deguaineSound) {
        deguaineSound.currentTime = 0; // Réinitialiser la position de lecture
        deguaineSound.play(); // Jouer le son de deguaine
      }
      setTimeout(() => {
        gunImage.src = 'repos.gif'; // Réinitialiser l'image après l'animation
        playerTurn = true; // Passer le tour au joueur
        bulletCount--; // Décrémenter le nombre de coups de gun
        updateCount(); // Mettre à jour l'affichage du décompte
        if (bulletCount === 0) {
          gameOver('nobody');
        } else {
          messageElement.textContent = "À votre tour de tirer";
          messageElement.style.display = 'block';
          setTimeout(() => {
            messageElement.style.display = 'none'; // Masquer le message après quelques secondes
          }, 2000); // Durée d'affichage du message en millisecondes
        }
      }, 1000); // Durée de l'animation de l'ordinateur en millisecondes
    }
    // Affichage du décompte
    updateCount();
  }, 2000); // Ajouter un délai avant que l'ordinateur ne commence à jouer
}

// Fonction pour mettre à jour l'affichage du décompte
function updateCount() {
  countElement.textContent = `Il reste ${bulletCount} coup(s) de gun`;
}

// Fonction pour gérer la fin de la partie
function gameOver(winner) {
  if (winner === 'player') {
    messageElement.textContent = "Désolé, vous avez perdu !";
    messageElement.style.display = 'block';
  } else if (winner === 'computer') {
    messageElement.textContent = " Félicitations ! Vous avez survécu !";
    messageElement.style.display = 'block';
  } else {
    messageElement.textContent = "Désolé, personne n'a tiré !";
    messageElement.style.display = 'block';
  }
}

// Écouteur d'événement pour le clic sur le conteneur du pistolet
gunContainer.addEventListener('click', performShot);

// Écouteurs d'événement pour les options du modal
playerOption.addEventListener('click', () => {
  closeModal();
  playerTurn = true; // Le joueur prend la main
  messageElement.textContent = "À votre tour de tirer";
  messageElement.style.display = 'block';
});

computerOption.addEventListener('click', () => {
  closeModal();
  playerTurn = false; // L'ordinateur prend la main
  messageElement.textContent = "C'est au tour de l'ordinateur de tirer";
  messageElement.style.display = 'block';
  setTimeout(() => {
    computerTurn(); // Début du tour de l'ordinateur
  }, 2000); // Délai avant que l'ordinateur ne commence à jouer
});

// Initialiser le jeu
openModal(); // Afficher le modal au début du jeu
