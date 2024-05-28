document.addEventListener("DOMContentLoaded", () => {
    const gameContainer = document.getElementById("game-container");
    const hudHeight = document.getElementById("hud").offsetHeight;
    let currentNumber = 1;
    let errors = 0;
    const errorsDisplay = document.getElementById("errors");
    const bubbleSize = 116; // Taille de la bulle en pixels
    const numBubbles =20; // Nombre de bulles à générer
    const bubbles = [];
    let timer = 20; // Durée du timer en secondes
    const timerDisplay = document.getElementById("timer");
    let timerInterval;

    // Récupérer l'élément audio
    const bubblePopAudio = document.getElementById('bubble-pop-audio');
      // Récupérer l'élément audio
    const bubblePopErrorAudio = document.getElementById('bubble-pop-error-audio');

    // Récupérer l'élément audio pour le fond sonore
const backgroundMusic = document.getElementById('background-music');

// Ajuster le volume du fond sonore
backgroundMusic.volume = 0.5; // Vous pouvez ajuster ce volume selon vos préférences

// Ajuster le volume du son d'erreur
bubblePopErrorAudio.volume = 0.8; // Volume plus élevé que le fond sonore

// Ajuster le volume du son des bulles
bubblePopAudio.volume = 0.6; 







  // Fonction pour créer une bulle avec le numéro donné
// Fonction pour créer une bulle avec le numéro donné
const createBubble = (number) => {
    const bubble = document.createElement('button'); // Utiliser 'button' au lieu de 'div'
    bubble.classList.add('bubble');
    bubble.dataset.number = number;

    // Ajouter l'image PNG à la bulle
    const img = document.createElement('img');
    img.src = 'bublepix2.png'; // Chemin vers votre image PNG
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


    // Décompte du timer
    timerInterval = setInterval(() => {
        timer--;
        if (timer < 0) {
            clearInterval(timerInterval);
            alert("Temps écoulé ! vous avez perdu!!!");
            location.reload();
        } else {
            timerDisplay.textContent = timer;
        }
    }, 1000);

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
            const number = parseInt(bubble.dataset.number);
            const boundingBox = bubble.getBoundingClientRect();
            const mouseX = event.clientX;
            const mouseY = event.clientY;

            if (mouseX >= boundingBox.left && mouseX <= boundingBox.right && mouseY >= boundingBox.top && mouseY <= boundingBox.bottom) {
                if (number === currentNumber) {
                    bubble.classList.add('explode');
                    setTimeout(() => {
                        bubble.style.visibility = 'hidden';
                        bubblePopAudio.play();
                    }, 500);
                    currentNumber++;
                    if (currentNumber > numBubbles) {
                        alert("Vous avez gagné !");
                        location.reload();
                    }
                } else {
                    errors++;
                    errorsDisplay.innerHTML = "❤️".repeat(3 - errors);
                    if (errors >= 3) {
                        setTimeout(() => {
                            alert("Vous avez perdu !");
                            location.reload();
                        }, 500);
                    } else {
                        const bubbleImage = bubble.querySelector('img');
                        const originalSrc = bubbleImage.src;
                        bubbleImage.src = 'bublepix2-error.png'; // Changer l'image en cas d'erreur
                        bubblePopErrorAudio.play();

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
        });
    });


    // Fonction pour créer et animer les particules




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
