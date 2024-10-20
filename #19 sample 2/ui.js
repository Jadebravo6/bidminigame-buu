function displayMenu() {
    fill('#ffbc63');
    textAlign(CENTER);
    textSize(50);
    text("Orbit Dash", width / 2, height / 2 - 100);
    fill('#ffbc63');
    rectMode(CENTER);
    rect(width / 2, height / 2, 200, 50, 10);
    fill(0);
    textSize(30);
    text("play", width / 2, height / 2 + 10);
  }
  
  function displayScore(score) {
    textSize(32);
    fill("#ffbc63");
    textAlign(CENTER, CENTER);
    text(score, width / 2, height - 50);
  }
  
  function displayGameOver(score) {
    background("#050135");
    textSize(54);
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 3 - 10);
    textSize(25);
    fill("#ffbc63");
    text("Score: " + score, width / 2, height / 2 + 20);
    fill("#ffbc63");
    text("try again", width / 2, height / 2 + 150);
  }
  
  export { displayMenu, displayScore, displayGameOver };
  