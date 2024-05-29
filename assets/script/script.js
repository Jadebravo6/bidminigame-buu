document.addEventListener("DOMContentLoaded", () => {
    const menuContainer = document.getElementById("menu-container");
    const startButton = document.getElementById("start-button");
    const endGameContainer = document.getElementById('end-game-container');
    const gameContainer = document.getElementById("game-container");

    const replayButton = document.getElementById('replay-btn'); // Le bouton "Rejouer"

    // Récupérer l'élément audio pour le fond sonore
    const backgroundMusic = document.getElementById('background-music');

    // Cacher la fenêtre de fin de partie au chargement de la page
    endGameContainer.style.display = 'none';

    startButton.addEventListener("click", () => {
        menuContainer.style.display = "none"; // Cacher le menu
        gameContainer.style.display = "block"; // Afficher le jeu
        endGameContainer.style.display = 'none';

        // Ajuster le volume du fond sonore et démarrer la musique
        backgroundMusic.volume = 0.5; // Vous pouvez ajuster ce volume selon vos préférences
        backgroundMusic.currentTime = 0; // Remettre la musique au début
        backgroundMusic.play();

        const hudHeight = document.getElementById("hud").offsetHeight;
        let currentNumber = 1;
        let errors = 0;
        const errorsDisplay = document.getElementById("errors");
        const bubbleSize = 116; // Taille de la bulle en pixels
        const numBubbles = 10; // Nombre de bulles à générer
        const bubbles = [];
        let timer = 20; // Durée du timer en secondes
        const timerDisplay = document.getElementById("timer");
        let timerInterval;
        const bubbleIcon = document.querySelector('.bubble-icon');
        const bubblesPoppedDisplay = document.getElementById("bubbles-popped");
        let bubblesPopped = 0;

        // Récupérer l'élément audio
        const bubblePopAudio = document.getElementById('bubble-pop-audio');
        const bubblePopErrorAudio = document.getElementById('bubble-pop-error-audio');

        // Ajuster le volume des sons
        bubblePopErrorAudio.volume = 0.8; // Volume plus élevé que le fond sonore
        bubblePopAudio.volume = 0.6;

        // Gestionnaire d'intervalle de timer
        timerInterval = setInterval(() => {
            timer--;
            if (timer < 0) {
                clearInterval(timerInterval);
                // Arrêter le jeu lorsque le temps est écoulé
                endGame('lose');
            } else {
                timerDisplay.textContent = timer;
            }
        }, 1000);

        // Fonction pour créer une bulle avec le numéro donné
        const createBubble = (number) => {
            const bubble = document.createElement('button'); // Utiliser 'button' au lieu de 'div'
            bubble.classList.add('bubble');
            bubble.dataset.number = number;

            // Ajouter l'image PNG à la bulle
            const img = document.createElement('img');
            img.src = 'assets/sprite/bublepix2.png'; // Chemin vers votre image PNG
            img.width = bubbleSize;
            img.height = bubbleSize;
            bubble.appendChild(img);

            // Créer l'élément texte pour afficher le numéro
            const numberText = document.createElement('div');
            numberText.classList.add('number-text');
            numberText.textContent = number;
            bubble.appendChild(numberText);

            gameContainer.appendChild(bubble);
            return bubble;
        };

        // Fonction pour positionner une bulle de manière aléatoire dans le jeu
        const positionBubbleRandomly = (bubble) => {
            const x = Math.random() * (gameContainer.clientWidth - bubbleSize);
            const y = Math.random() * (gameContainer.clientHeight - hudHeight - bubbleSize);
            bubble.style.left = `${x}px`;
            bubble.style.top = `${y}px`;
        };

        // Créer et positionner les bulles
        for (let i = 1; i <= numBubbles; i++) {
            const bubble = createBubble(i);
            positionBubbleRandomly(bubble);
            bubbles.push(bubble);
        }

        bubbles.forEach(bubble => {
            animateBubble(bubble);
            bubble.addEventListener("click", (event) => {
                // Vérifier si la modal est affichée
                if (endGameContainer.style.display === 'flex') return; // Sortir de la fonction si la modal est affichée

                const number = parseInt(bubble.dataset.number);
                const boundingBox = bubble.getBoundingClientRect();
                const mouseX = event.clientX;
                const mouseY = event.clientY;

                if (mouseX >= boundingBox.left && mouseX <= boundingBox.right && mouseY >= boundingBox.top && mouseY <= boundingBox.bottom) {
                    if (number === currentNumber) {
                        bubble.classList.add('explode');

                        setTimeout(() => {
                            bubble.style.visibility = 'hidden';
                            const popAudio = bubblePopAudio.cloneNode(true); // Clone the audio element
                            popAudio.play();

                            bubblesPopped++;
                            bubblesPoppedDisplay.textContent = `${bubblesPopped}`;
                        }, 500);
                        currentNumber++;
                        if (currentNumber > numBubbles) {
                            // Afficher la fenêtre de fin de partie
                            endGame('win'); // Appel à la fonction endGame pour indiquer la victoire
                        }
                    } else {
                        errors++;
                        errorsDisplay.innerHTML = "❤️".repeat(3 - errors);
                        if (errors >= 3) {
                            setTimeout(() => {
                                endGame('lose'); // Appel à la fonction endGame pour indiquer la défaite
                            }, 500);
                        } else {
                            const bubbleImage = bubble.querySelector('img');
                            const originalSrc = bubbleImage.src;
                            bubbleImage.src = 'assets/sprite/bublepix2-error.png'; // Changer l'image en cas d'erreur
                            const errorAudio = bubblePopErrorAudio.cloneNode(true); // Clone the audio element
                            errorAudio.play();

                            setTimeout(() => {
                                bubbleImage.src = originalSrc; // Revenir à l'image initiale après 1 seconde
                            }, 1000);

                            bubble.querySelector('.number-text').classList.add('error');
                            setTimeout(() => {
                                bubble.querySelector('.number-text').classList.remove('error');
                            }, 1000);
                        }
                    }
                }
                checkEndGame(); // Appel à la fonction pour vérifier la fin de la partie à chaque clic sur une bulle
            });
        });

        // Fonction pour gérer la fin du jeu
        function endGame(result) {
            // Arrêter le jeu si le résultat est une victoire ou une défaite
            clearInterval(timerInterval);

            // Arrêter la musique de fond
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0; // Remettre la musique au début

            // Afficher la fenêtre de fin de partie
            endGameContainer.style.display = 'flex'; // ou 'block' selon votre préférence

            // Code pour afficher le message de fin en fonction du résultat
            const endGameMessage = document.getElementById('end-game-message');
            if (result === 'win') {
                endGameMessage.textContent = 'Vous avez gagné !';
            } else {
                endGameMessage.textContent = 'Vous avez perdu !';
            }
        }

        // Fonction pour vérifier la fin de la partie
        function checkEndGame() {
            if (currentNumber > numBubbles) {
                endGame('win');
            } else if (errors >= 3) {
                endGame('lose');
            }
        }

        // Fonction pour animer les bulles
        function animateBubble(bubble) {
            function moveBubble() {
                const duration = 500 + Math.random() * 1000; // Durée entre 0.5 et 1.5 secondes
                const deltaX = Math.random() * 100 - 50; // Déplacement en X entre -50px et 50px
                const deltaY = Math.random() * 100 - 50; // Déplacement en Y entre -50px et 50px

                let newX = bubble.offsetLeft + deltaX;
                let newY = bubble.offsetTop + deltaY;

                // Vérifie que la bulle reste dans les limites du conteneur de jeu et au-dessus de l'HUD
                if (newX < 0) newX = 0;
                if (newX > gameContainer.clientWidth - bubbleSize) newX = gameContainer.clientWidth - bubbleSize;
                if (newY < 0) newY = 0;
                if (newY > gameContainer.clientHeight - hudHeight - bubbleSize) newY = gameContainer.clientHeight - hudHeight - bubbleSize;

                bubble.style.transform = `translate(${newX - bubble.offsetLeft}px, ${newY - bubble.offsetTop}px)`;
                setTimeout(moveBubble, duration);
            }
            moveBubble();
        }
    });

    // Ajouter un gestionnaire d'événement pour le bouton "Rejouer"
    replayButton.addEventListener('click', () => {
        location.reload(); // Recharger la page
    });
});
