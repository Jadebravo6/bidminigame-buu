document.addEventListener("DOMContentLoaded", () => {
    const menuContainer = document.getElementById("menu-container");
    const startButton = document.getElementById("start-button");
    const endGameContainer = document.getElementById('end-game-container');
    const gameContainer = document.getElementById("game-container");
    const replayButton = document.getElementById('replay-btn');
    const backgroundMusic = document.getElementById('background-music');
    endGameContainer.style.display = 'none';

    startButton.addEventListener("click", () => {
        menuContainer.style.display = "none";
        gameContainer.style.display = "block";
        endGameContainer.style.display = 'none';
        backgroundMusic.volume = 0.5;
        backgroundMusic.currentTime = 0;
        backgroundMusic.play();

        const hudHeight = document.getElementById("hud").offsetHeight;
        let currentNumber = 1;
        let errors = 0;
        const errorsDisplay = document.getElementById("errors");
        const bubbleSize = 116;
        const numBubbles = 20;
        const bubbles = [];
        let timer = 20;
        const timerDisplay = document.getElementById("timer");
        let timerInterval;
        const bubbleIcon = document.querySelector('.bubble-icon');
        const bubblesPoppedDisplay = document.getElementById("bubbles-popped");
        let bubblesPopped = 0;
        const bubblePopAudio = document.getElementById('bubble-pop-audio');
        const bubblePopErrorAudio = document.getElementById('bubble-pop-error-audio');
        bubblePopErrorAudio.volume = 0.8;
        bubblePopAudio.volume = 0.6;

        timerInterval = setInterval(() => {
            timer--;
            if (timer < 0) {
                clearInterval(timerInterval);
                endGame('lose');
            } else {
                timerDisplay.textContent = timer;
            }
        }, 1000);

        const createBubble = (number) => {
            const bubble = document.createElement('button');
            bubble.classList.add('bubble');
            bubble.dataset.number = number;
            const img = document.createElement('img');
            img.src = 'assets/sprite/bublepix2.png';
            img.width = bubbleSize;
            img.height = bubbleSize;
            bubble.appendChild(img);
            const numberText = document.createElement('div');
            numberText.classList.add('number-text');
            numberText.textContent = number;
            bubble.appendChild(numberText);
            gameContainer.appendChild(bubble);
            return bubble;
        };

        const positionBubbleRandomly = (bubble) => {
            const x = Math.random() * (gameContainer.clientWidth - bubbleSize);
            const y = Math.random() * (gameContainer.clientHeight - hudHeight - bubbleSize);
            bubble.style.left = `${x}px`;
            bubble.style.top = `${y}px`;
        };

        for (let i = 1; i <= numBubbles; i++) {
            const bubble = createBubble(i);
            positionBubbleRandomly(bubble);
            bubbles.push(bubble);
        }

        bubbles.forEach(bubble => {
            animateBubble(bubble);
            bubble.addEventListener("click", (event) => {
                if (endGameContainer.style.display === 'flex') return;
                const number = parseInt(bubble.dataset.number);
                const boundingBox = bubble.getBoundingClientRect();
                const mouseX = event.clientX;
                const mouseY = event.clientY;
                if (mouseX >= boundingBox.left && mouseX <= boundingBox.right && mouseY >= boundingBox.top && mouseY <= boundingBox.bottom) {
                    if (number === currentNumber) {
                        bubble.classList.add('explode');
                        setTimeout(() => {
                            bubble.style.visibility = 'hidden';
                            const popAudio = bubblePopAudio.cloneNode(true);
                            popAudio.play();
                            bubblesPopped++;
                            bubblesPoppedDisplay.textContent = `${bubblesPopped}`;
                        }, 500);
                        currentNumber++;
                        if (currentNumber > numBubbles) {
                            endGame('win');
                        }
                    } else {
                        errors++;
                        errorsDisplay.innerHTML = "❤️".repeat(3 - errors);
                        if (errors >= 3) {
                            setTimeout(() => {
                                endGame('lose');
                            }, 500);
                        } else {
                            const bubbleImage = bubble.querySelector('img');
                            const originalSrc = bubbleImage.src;
                            bubbleImage.src = 'assets/sprite/bublepix2-error.png';
                            const errorAudio = bubblePopErrorAudio.cloneNode(true);
                            errorAudio.play();
                            setTimeout(() => {
                                bubbleImage.src = originalSrc;
                            }, 1000);
                            bubble.querySelector('.number-text').classList.add('error');
                            setTimeout(() => {
                                bubble.querySelector('.number-text').classList.remove('error');
                            }, 1000);
                        }
                    }
                }
                checkEndGame();
            });
        });

        function endGame(result) {
            clearInterval(timerInterval);
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
            endGameContainer.style.display = 'flex';
            const endGameMessage = document.getElementById('end-game-message');
            if (result === 'win') {
                endGameMessage.textContent = 'Vous avez gagné !';
            } else {
                endGameMessage.textContent = 'Vous avez perdu !';
            }
        }

        function checkEndGame() {
            if (currentNumber > numBubbles) {
                endGame('win');
            } else if (errors >= 3) {
                endGame('lose');
            }
        }

        function animateBubble(bubble) {
            function moveBubble() {
                const duration = 500 + Math.random() * 1000;
                const deltaX = Math.random() * 100 - 50;
                const deltaY = Math.random() * 100 - 50;
                let newX = bubble.offsetLeft + deltaX;
                let newY = bubble.offsetTop + deltaY;
                if (newX < 0) newX = 0;
                if (newX > gameContainer.clientWidth - bubbleSize) newX = gameContainer.clientWidth - bubbleSize;
                if (newY < 0) newY = 0;
                if (newY > gameContainer.clientHeight - hudHeight - bubbleSize) newY = gameContainer.clientHeight - hudHeight - bubbleSize;
                bubble.style.transform = `translate(${newX - bubble.offsetLeft}px, ${newY - bubble.offsetTop}px)`;
                setTimeout(moveBubble, duration);
            }
            moveBubble();
        }

        function teleportBubble(bubble) {
            positionBubbleRandomly(bubble);
        }

        function startTeleportation() {
            const randomInterval = Math.floor(Math.random() * 4000) + 1000; // Entre 1 et 5 secondes
            setTimeout(() => {
                const numTeleports = Math.floor(Math.random() * (numBubbles / 2)) + 1; // Nombre de bulles à téléporter (entre 1 et la moitié des bulles)
                for (let i = 0; i < numTeleports; i++) {
                    const bubbleIndex = Math.floor(Math.random() * numBubbles);
                    teleportBubble(bubbles[bubbleIndex]);
                }
                startTeleportation(); // Appel récursif pour continuer les téléportations
            }, randomInterval);
        }

        startTeleportation();
    });

    replayButton.addEventListener('click', () => {
        location.reload();
    });
});
