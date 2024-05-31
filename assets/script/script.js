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
        const bubbleSize = 100; // taille des bulles
        const numBubbles = 20;
        const bubbles = [];
        let timer = 50;
        const timerDisplay = document.getElementById("timer");
        let timerInterval;
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
            const bubbleCanvas = document.createElement('canvas');
            bubbleCanvas.width = bubbleSize;
            bubbleCanvas.height = bubbleSize;
            bubbleCanvas.classList.add('bubble');
            bubbleCanvas.dataset.number = number;

            const ctx = bubbleCanvas.getContext('2d');
            const img = new Image();
            img.src = 'assets/sprite/bublepix2.png';
            img.onload = () => {
                ctx.drawImage(img, 0, 0, bubbleSize, bubbleSize);
                ctx.font = `${bubbleSize / 5}px Arial`;
                ctx.fillStyle = "white";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(number, bubbleSize / 2, bubbleSize / 2);
            };

            gameContainer.appendChild(bubbleCanvas);
            return bubbleCanvas;
        };

        const isOverlapping = (x, y, size, bubbles) => {
            for (let bubble of bubbles) {
                const bubbleRect = bubble.getBoundingClientRect();
                const bubbleX = bubbleRect.left;
                const bubbleY = bubbleRect.top;
                const distance = Math.sqrt(Math.pow(x - bubbleX, 2) + Math.pow(y - bubbleY, 2));
                if (distance < size) {
                    return true;
                }
            }
            return false;
        };

        const positionBubbleRandomly = (bubble) => {
            let x, y;
            let attempts = 0;
            do {
                x = Math.random() * (gameContainer.clientWidth - bubbleSize);
                y = Math.random() * (gameContainer.clientHeight - hudHeight - bubbleSize);
                attempts++;
            } while (isOverlapping(x, y, bubbleSize, bubbles) && attempts < 100);
            if (attempts >= 100) {
                console.warn("Could not find non-overlapping position for bubble");
            }
            bubble.style.position = 'absolute';
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
                            const ctx = bubble.getContext('2d');
                            ctx.clearRect(0, 0, bubbleSize, bubbleSize);
                            const img = new Image();
                            img.src = 'assets/sprite/bublepix2-error.png';
                            img.onload = () => {
                                ctx.drawImage(img, 0, 0, bubbleSize, bubbleSize);
                                ctx.font = `${bubbleSize / 5}px Arial`;
                                ctx.fillStyle = "white";
                                ctx.textAlign = "center";
                                ctx.textBaseline = "middle";
                                ctx.fillText(number, bubbleSize / 2, bubbleSize / 2);
                            };
                            const errorAudio = bubblePopErrorAudio.cloneNode(true);
                            errorAudio.play();
                            setTimeout(() => {
                                ctx.clearRect(0, 0, bubbleSize, bubbleSize);
                                const originalImg = new Image();
                                originalImg.src = 'assets/sprite/bublepix2.png';
                                originalImg.onload = () => {
                                    ctx.drawImage(originalImg, 0, 0, bubbleSize, bubbleSize);
                                    ctx.font = `${bubbleSize / 5}px Arial`;
                                    ctx.fillStyle = "white";
                                    ctx.textAlign = "center";
                                    ctx.textBaseline = "middle";
                                    ctx.fillText(number, bubbleSize / 2, bubbleSize / 2);
                                };
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
                const duration = 200 + Math.random() * 500; // Réduire la durée pour augmenter la vitesse
                const deltaX = Math.random() * 200 - 100; // Augmenter le déplacement pour plus de dynamisme
                const deltaY = Math.random() * 200 - 100; // Augmenter le déplacement pour plus de dynamisme
                let newX = bubble.offsetLeft + deltaX;
                let newY = bubble.offsetTop + deltaY;

                // Check boundaries
                if (newX < 0) newX = 0;
                if (newX > gameContainer.clientWidth - bubbleSize) newX = gameContainer.clientWidth - bubbleSize;
                if (newY < 0) newY = 0;
                if (newY > gameContainer.clientHeight - hudHeight - bubbleSize) newY = gameContainer.clientHeight - hudHeight - bubbleSize;

                // Check for overlapping
                if (!isOverlapping(newX, newY, bubbleSize, bubbles)) {
                    bubble.style.left = `${newX}px`;
                    bubble.style.top = `${newY}px`;
                }

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
