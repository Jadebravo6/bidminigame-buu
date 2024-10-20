// script.js
const player = document.getElementById('player');
const obstacle = document.getElementById('obstacle');
let isJumping = false;
let jumpCount = 0;

function jump() {
    if (isJumping) return;
    isJumping = true;
    let jumpHeight = 0;
    const jumpInterval = setInterval(() => {
        if (jumpHeight >= 100) {
            clearInterval(jumpInterval);
            const fallInterval = setInterval(() => {
                if (jumpHeight <= 0) {
                    clearInterval(fallInterval);
                    isJumping = false;
                    return;
                }
                jumpHeight -= 10;
                player.style.bottom = `${20 + jumpHeight}px`;
            }, 20);
        } else {
            jumpHeight += 10;
            player.style.bottom = `${20 + jumpHeight}px`;
        }
    }, 20);
}

function moveObstacle() {
    let obstaclePos = window.innerWidth;
    const moveInterval = setInterval(() => {
        if (obstaclePos < -30) {
            obstaclePos = window.innerWidth;
        } else {
            obstaclePos -= 5;
        }
        obstacle.style.left = `${obstaclePos}px`;
        if (obstaclePos < 80 && obstaclePos > 50 && !isJumping) {
            alert('Game Over!');
            document.location.reload();
        }
    }, 20);
}

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        jump();
    }
});

moveObstacle();
