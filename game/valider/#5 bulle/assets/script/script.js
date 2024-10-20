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

        let lastClickTime = 0;
        const hudHeight = document.getElementById("hud").offsetHeight;
        let currentNumber = 1;
        let errors = 0;
        let correctBubblesClicked = 0;
        const errorsDisplay = document.getElementById("errors");
        const bubbleSize = 80;
        const initialBubbles = 20;
        const maxBubbles = 20;
        const bubbles = [];
        let timer = 20;
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
            img.src = 'assets/sprite/bubble3.png';
            img.onload = () => {
                ctx.drawImage(img, 0, 0, bubbleSize, bubbleSize);
                ctx.font = ` ${bubbleSize / 5}px Arial`;
                ctx.fillStyle = "blue";
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
                teleportBubble(bubble);
            } else {
                bubble.style.position = 'absolute';
                bubble.style.left = `${x}px`;
                bubble.style.top = `${y}px`;
            }
        };

        function updateZIndex() {
            bubbles.forEach(bubble => {
                bubble.style.zIndex = parseInt(bubble.dataset.number) === currentNumber ? '1' : '0';
            });
        }

        for (let i = 1; i <= initialBubbles; i++) {
            const bubble = createBubble(i);
            positionBubbleRandomly(bubble);
            bubbles.push(bubble);
        }

        updateZIndex();

        function teleportBubble(bubble) {
            let newX, newY;
            let attempts = 0;
            const maxAttempts = 100;
            do {
                newX = Math.random() * (gameContainer.clientWidth - bubbleSize);
                newY = Math.random() * (gameContainer.clientHeight - hudHeight - bubbleSize);
                attempts++;
            } while (isOverlapping(newX, newY, bubbleSize, bubbles) && attempts < maxAttempts);
            if (attempts >= maxAttempts) {
                console.warn("Could not find non-overlapping position for bubble");
                teleportBubble(bubble);
            } else {
                bubble.style.left = `${newX}px`;
                bubble.style.top = `${newY}px`;
            }
        }

        function startTeleportation() {
            const randomInterval = Math.floor(Math.random() * 4000) + 1000;
            setTimeout(() => {
                for (let i = 0; i < initialBubbles; i++) {
                    teleportBubble(bubbles[i]);
                }
                startTeleportation();
            }, randomInterval);
        }

        bubbles.forEach(bubble => {
            animateBubble(bubble);
            bubble.addEventListener("click", (event) => {
                if (endGameContainer.style.display === 'flex') return;
        
                bubble.classList.add('clicked');
        
                const number = parseInt(bubble.dataset.number);
                const boundingBox = bubble.getBoundingClientRect();
                const mouseX = event.clientX;
                const mouseY = event.clientY;
        
                if (mouseX >= boundingBox.left && mouseX <= boundingBox.right && mouseY >= boundingBox.top && mouseY <= boundingBox.bottom) {
                    if (number === currentNumber) {
                        // Disable click events to prevent multiple clicks
                        bubble.style.pointerEvents = 'none';
        
                        bubble.classList.add('explode');
                        setTimeout(() => {
                            bubble.style.visibility = 'hidden';
                            const popAudio = bubblePopAudio.cloneNode(true);
                            popAudio.play();
                            bubblesPopped++;
                            bubblesPoppedDisplay.textContent = `${bubblesPopped}`;
                            correctBubblesClicked++; // Incrémenter le nombre de bulles correctement cliquées
                            console.log(`Correct bubble clicked! Current number: ${currentNumber}`);
                            currentNumber++; // Incrémenter seulement après avoir vérifié la bulle
        
                            updateZIndex(); // Mettre à jour le z-index
        
                            if (correctBubblesClicked >= maxBubbles) {
                                endGame('win'); // Vérifier si le joueur a cliqué sur toutes les bulles correctes
                            }
        
                            if (bubblesPopped >= maxBubbles) {
                                endGame('win');
                            }
                        }, 500);
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
                            img.src = 'assets/sprite/bubble3-error.png';
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
                                originalImg.src = 'assets/sprite/bubble3.png';
                                originalImg.onload = () => {
                                    ctx.drawImage(originalImg, 0, 0, bubbleSize, bubbleSize);
                                    ctx.font = `${bubbleSize / 5}px Arial`;
                                    ctx.fillStyle = "blue";
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
        
        function checkEndGame() {
            if (bubblesPopped >= maxBubbles) {
                clearInterval(timerInterval); // Arrêter le timer
                backgroundMusic.pause();
                backgroundMusic.currentTime = 0;
                endGame('win');
            } else if (errors >= 3) {
                clearInterval(timerInterval); // Arrêter le timer
                backgroundMusic.pause();
                backgroundMusic.currentTime = 0;
                endGame('lose');
            } else if (correctBubblesClicked >= maxBubbles) {
                clearInterval(timerInterval); // Arrêter le timer
                backgroundMusic.pause();
                backgroundMusic.currentTime = 0;
                endGame('win');
            }
        }
        
        
        function endGame(result) {
            endGameContainer.style.display = 'flex';
            const endGameMessage = document.getElementById('end-game-message');
            if (result === 'win') {
                endGameMessage.textContent = 'Vous avez gagné !';
            } else {
                endGameMessage.textContent = 'Vous avez perdu !';
            }
        
            bubbles.forEach(bubble => {
                bubble.style.visibility = 'hidden';
                bubble.style.pointerEvents = 'none';
            });
        
            currentNumber = 1;
            errors = 0;
            correctBubblesClicked = 0;
            bubblesPopped = 0;
            timer = 20;
            timerDisplay.textContent = timer;
            errorsDisplay.innerHTML = "❤️❤️❤️";
        }

        function animateBubble(bubble) {
            function moveBubble() {
                const duration = 200 + Math.random() * 500;
                const deltaX = Math.random() * 200 - 100;
                const deltaY = Math.random() * 200 - 100;
                let newX = bubble.offsetLeft + deltaX;
                let newY = bubble.offsetTop + deltaY;

                if (newX < 0) newX = 0;
                if (newX > gameContainer.clientWidth - bubbleSize) newX = gameContainer.clientWidth - bubbleSize;
                if (newY < 0) newY = 0;
                if (newY > gameContainer.clientHeight - hudHeight - bubbleSize) newY = gameContainer.clientHeight - hudHeight - bubbleSize;

                if (!isOverlapping(newX, newY, bubbleSize, bubbles)) {
                    bubble.style.left = `${newX}px`;
                    bubble.style.top = `${newY}px`;
                }

                setTimeout(moveBubble, duration);
            }
            moveBubble();
        }

        function addNewBubble() {
            const newBubbleNumber = bubbles.length + 1;
            if (newBubbleNumber <= maxBubbles) {
                const newBubble = createBubble(newBubbleNumber);
                positionBubbleRandomly(newBubble);
                bubbles.push(newBubble);
                animateBubble(newBubble);
                newBubble.addEventListener("click", (event) => {
                    if (endGameContainer.style.display === 'flex') return;

                    newBubble.classList.add('clicked');

                    const number = parseInt(newBubble.dataset.number);
                    const boundingBox = newBubble.getBoundingClientRect();
                    const mouseX = event.clientX;
                    const mouseY = event.clientY;
                    if (mouseX >= boundingBox.left && mouseX <= boundingBox.right && mouseY >= boundingBox.top && mouseY <= boundingBox.bottom) {
                        if (number === currentNumber) {
                            newBubble.classList.add('explode');
                            setTimeout(() => {
                                newBubble.style.visibility = 'hidden';
                                const popAudio = bubblePopAudio.cloneNode(true);
                                popAudio.play();
                                bubblesPopped++;
                                newBubble.style.pointerEvents = 'none';
                                bubblesPoppedDisplay.textContent = `${bubblesPopped}`;
                                currentNumber++;
                                correctBubblesClicked++;
                                updateZIndex();
                                if (correctBubblesClicked >= maxBubbles) {
                                    endGame('win');
                                }
                            }, 500);
                        } else {
                            errors++;
                            errorsDisplay.innerHTML = "❤️".repeat(3 - errors);
                            if (errors >= 3) {
                                setTimeout(() => {
                                    endGame('lose');
                                }, 500);
                            } else {
                                const ctx = newBubble.getContext('2d');
                                ctx.clearRect(0, 0, bubbleSize, bubbleSize);
                                const img = new Image();
                                img.src = 'assets/sprite/bubble3-error.png';
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
                                    originalImg.src = 'assets/sprite/bubble3.png';
                                    originalImg.onload = () => {
                                        ctx.drawImage(originalImg, 0, 0, bubbleSize, bubbleSize);
                                        ctx.font = `${bubbleSize / 5}px Arial`;
                                        ctx.fillStyle = "blue";
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
            }
        }

        startTeleportation();
    });

    replayButton.addEventListener('click', () => {
        location.reload();
    });
});

