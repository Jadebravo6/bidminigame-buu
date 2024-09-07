const icons = ['fa-gem', 'fa-heart', 'fa-bolt', 'fa-anchor', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb', 'fa-gem', 'fa-heart', 'fa-bolt', 'fa-anchor', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
let flippedCards = [];
let matchedCards = [];
let moves = 0;
let canFlip = false; // Initialement, le jeu ne peut pas être retourné jusqu'à ce que le bouton "Commencer" soit cliqué
let timerInterval; // Variable pour stocker l'ID de l'intervalle du timer
let minutes = 0;
let seconds = 0;
let totalSeconds = 0;
let gameEnded = false; // Variable pour suivre si la partie est terminée
let errors = 0; // Variable pour suivre le nombre d'erreurs
const initialChances = 8; // Nombre initial de chances

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('play-button');
    startButton.addEventListener('click', startGame);
});

function startGame() {
    initializeGame();
}

function initializeGame() {
    const grid = document.querySelector('.grid');
    grid.innerHTML = '';
    errors = 0; // Réinitialiser le compteur d'erreurs à zéro
    moves = 0;
    matchedCards = [];
    const shuffledIcons = shuffle(icons);

    shuffledIcons.forEach(icon => {
        const card = document.createElement('div');
        card.classList.add('card');

        const iconElement = document.createElement('i');
        iconElement.classList.add('fas', icon);
        card.appendChild(iconElement);

        card.addEventListener('click', () => flipCard(card));

        grid.appendChild(card);
    });

    // Réinitialiser le nombre de chances restantes à la valeur initiale
    document.getElementById('chances').textContent = initialChances;



    startTimer(); // Démarrer le chronomètre dès que le jeu démarre
    canFlip = true; // Permettre de retourner les cartes une fois que le jeu a commencé
}


function startTimer() {
    clearInterval(timerInterval); // Arrêter le chronomètre précédent, s'il existe
    totalSeconds = 60; // Définir le nombre total de secondes à 60 pour une minute
    updateTimer(); // Mettre à jour le chronomètre immédiatement après le démarrage
    timerInterval = setInterval(updateTimer, 1000); // Démarrer un nouveau chronomètre
}

function updateTimer() {
    totalSeconds--;
    if (totalSeconds < 0) {
        showResult("Temps écoulé! Vous avez perdu."); // Afficher le message de fin de partie lorsque le temps est écoulé
        clearInterval(timerInterval); // Arrêter le chronomètre lorsque le temps est écoulé
        return;
    }
    seconds = totalSeconds % 60;
    minutes = Math.floor(totalSeconds / 60);
    // Mettre à jour l'affichage du chronomètre
    document.getElementById('timer').textContent = formatTime(minutes) + ':' + formatTime(seconds);
}


function formatTime(time) {
    return (time < 10) ? '0' + time : time; // Ajoute un zéro devant si la valeur est inférieure à 10
}

function flipCard(card) {
    // Vérifiez si le jeu n'a pas encore commencé et que la carte est en train de se retourner pendant cette période d'attente
    if (!canFlip && card.classList.contains('flipped')) {
        // Ajoutez une classe pour changer la couleur de la carte en rouge pendant cette période
        card.classList.add('temporary-red');
        // Attendez 1 seconde pour que la carte devienne rouge pendant une courte période
        setTimeout(() => {
            card.classList.remove('temporary-red'); // Retirez la classe pour revenir à la couleur normale
        }, 1000);
        return;
    }

    // Le jeu a commencé ou la carte ne se retourne pas pendant cette période d'attente
    if (!canFlip || flippedCards.length === 2 || card.classList.contains('flipped') || card.classList.contains('has-match')) {
        return;
    }

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        const icon1 = flippedCards[0].querySelector('i').classList[1];
        const icon2 = flippedCards[1].querySelector('i').classList[1];

        canFlip = false;

        if (icon1 === icon2) {
            setTimeout(() => {
                flippedCards.forEach(card => {
                    card.classList.add('has-match');
                    matchedCards.push(card);
                });

                if (matchedCards.length === icons.length) {
                    showResult(`Bravo! Vous avez gagné en ${moves} coups.`);
                }

                flippedCards = [];
                canFlip = true;
            }, 1000);
        } else {
            setTimeout(() => {
                flippedCards.forEach(card => {
                    card.classList.remove('flipped');
                    card.querySelector('i').classList.remove(getColorClass(card.querySelector('i').classList[1])); // Retire la classe de couleur de l'icône
                });
                flippedCards = [];
                canFlip = true;

                // Incrémenter le compteur d'erreurs
                errors++;
                // Mettre à jour le nombre de chances restantes dans l'interface utilisateur
                if (errors === initialChances) {
                    showResult("Vous avez perdu! Trop d'erreurs.");
                    return; // Arrêter le jeu si le joueur a perdu
                }
                // Mettre à jour le nombre de chances restantes dans l'interface utilisateur
                document.getElementById('chances').textContent = initialChances - errors;
                
            }, 1000);
        }

        moves++;
    } else {
        // Ajoute la classe de couleur à l'icône de la carte retournée
        card.querySelector('i').classList.add(getColorClass(card.querySelector('i').classList[1]));
    }
}

// Fonction pour obtenir la classe de couleur associée à un type d'icône
function getColorClass(iconClass) {
    switch (iconClass) {
        case 'fa-gem':
            return 'color-gem';
        case 'fa-heart':
            return 'color-heart';
        case 'fa-bolt':
            return 'color-bolt';
        case 'fa-anchor':
            return 'color-anchor';
        case 'fa-cube':
            return 'color-cube';
        case 'fa-leaf':
            return 'color-leaf';
        case 'fa-bicycle':
            return 'color-bicycle';
        case 'fa-bomb':
            return 'color-bomb';
        default:
            return ''; // Retourne une chaîne vide si aucune correspondance n'est trouvée
    }
}

function showResult(message) {
    const modal = document.getElementById('myModal');
    const modalMessage = document.getElementById('modal-message');
    
    // Mettre à jour le nombre de chances restantes
    document.getElementById('chances').textContent = initialChances - errors;
    
    modal.style.display = 'block';
    modalMessage.textContent = message + " Temps écoulé: " + formatTime(minutes) + ':' + formatTime(seconds);
    clearInterval(timerInterval); // Arrêter le chronomètre

    // Indiquer que la partie est terminée
    gameEnded = true;
}

// Fonction pour recharger la page
function reloadPage() {
    location.reload();
}

// Ferme la fenêtre modale lorsque l'utilisateur clique sur le bouton de fermeture
document.querySelector('.close').addEventListener('click', function() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
});

// Gère le comportement lorsque l'utilisateur clique sur le bouton OK de la fenêtre modale
document.getElementById('modal-ok-btn').addEventListener('click', function() {
    if (gameEnded) {
        initializeGame(); // Redémarre la partie seulement si la partie est terminée
        gameEnded = false; // Réinitialiser la variable pour indiquer que la partie n'est plus terminée
    }
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
});

function restartGame() {
    initializeGame();
    totalSeconds = 0;
    clearInterval(timerInterval); // Arrêter le chronomètre
    document.getElementById('timer').textContent = '00:00'; // Réinitialiser l'affichage du chronomètre
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
