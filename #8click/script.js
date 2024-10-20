let score = 0;
let timer = 30;
let scoreDisplay = document.getElementById('score');
let timerDisplay = document.getElementById('timer');
let balls = Array.from(document.querySelectorAll('.ball'));
let activeBall = null;
let gameInterval;
let effectTimeout;
const effectDuration = 500; // Durée de l'effet en ms
const effectTimes = 3; // Nombre de fois que l'effet se répète

function startGame() {
    score = 0;
    timer = 30;
    updateScore();
    updateTimer();

    gameInterval = setInterval(updateGame, 1000);
    moveToNextEffect(); // Commence l'effet sur une boule
}

function handleClick(event) {
    if (event.target === activeBall) {
        score++;
        updateScore();
        resetEffect(); // Réinitialise l'effet dès qu'une boule est cliquée
    }
}

function updateScore() {
    scoreDisplay.textContent = `Score : ${score}`;
}

function updateTimer() {
    timerDisplay.textContent = `Temps restant : ${timer}s`;
}

function updateGame() {
    timer--;
    updateTimer();

    if (timer <= 0) {
        clearInterval(gameInterval);
        clearTimeout(effectTimeout);
        balls.forEach(ball => {
            ball.removeEventListener('click', handleClick);
            ball.classList.remove('enlarge', 'highlight'); // Réinitialiser toutes les boules
        });
        alert('Temps écoulé ! Votre score final est ' + score);
    }
}

function moveToNextEffect() {
    // Choisir une boule aléatoire pour l'effet
    let randomIndex = Math.floor(Math.random() * balls.length);
    activeBall = balls[randomIndex];
    
    if (activeBall) {
        activeBall.classList.add('highlight'); // Change la couleur de la boule
        activeBall.classList.add('enlarge'); // Agrandit la boule

        effectTimeout = setTimeout(() => {
            resetEffect();
        }, effectDuration * effectTimes);
    }
}

function resetEffect() {
    if (activeBall) {
        activeBall.classList.remove('highlight', 'enlarge'); // Réinitialise la boule
        activeBall = null; // La boule affectée est désactivée
    }
    moveToNextEffect(); // Passe à la boule suivante
}

balls.forEach(ball => {
    ball.addEventListener('click', handleClick);
});

window.onload = startGame;
