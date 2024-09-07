const cursor = document.querySelector(".cursor");
const holes = [...document.querySelectorAll(".hole")];
const scoreEl = document.querySelector(".score span");
const timerEl = document.querySelector(".timer span");
let score = 0;
let speed = 900; // Vitesse initiale du jeu
let timeLeft = 60; // Durée du jeu en secondes
let gameRunning = true; // Variable pour contrôler l'état du jeu

function run() {
  if (!gameRunning) return; // Vérifie si le jeu est toujours en cours

  const i = Math.floor(Math.random() * holes.length);
  const hole = holes[i];
  let timer = null;

  const img = document.createElement("img");
  img.classList.add("mole");
  img.src = "https://github.com/0shuvo0/whack-a-mole/blob/main/assets/mole.png?raw=true";

  img.addEventListener("click", () => {
    score += 10;
    scoreEl.textContent = score;
    img.src = "https://github.com/0shuvo0/whack-a-mole/blob/main/assets/mole-whacked.png?raw=true";
    clearTimeout(timer);
    setTimeout(() => {
      hole.removeChild(img);
      run();
    }, 500);
  });

  hole.appendChild(img);

  timer = setTimeout(() => {
    hole.removeChild(img);
    run();
  }, speed); // Utilisation de la variable speed pour définir la vitesse du jeu
}

run();

window.addEventListener("mousemove", (e) => {
  cursor.style.top = e.pageY + "px";
  cursor.style.left = e.pageX + "px";
});

window.addEventListener("mousedown", () => {
  cursor.classList.add("active");
});

window.addEventListener("mouseup", () => {
  cursor.classList.remove("active");
});

// Logique pour ajuster la vitesse en fonction du score
function updateSpeed() {
  if (score >= 20 && speed !== 700) {
    speed = 700; // Augmente la vitesse à 700 si le score atteint 20
  } else if (score >= 50 && speed !== 400) {
    speed = 400; // Augmente la vitesse à 400 si le score atteint 50
  } else if (score >= 120 && speed !== 300) {
    speed = 300; // Réduit la vitesse à 300 si le score atteint 120
  }
}

// Vérifie et met à jour la vitesse à chaque nouvelle apparition du mole
setInterval(updateSpeed, 1000); // Vérifie toutes les secondes

// Minuteur du jeu
const gameTimer = setInterval(() => {
  timeLeft--;
  timerEl.textContent = timeLeft;
  if (timeLeft === 0) {
    clearInterval(gameTimer); // Arrête le minuteur du jeu
    gameRunning = false; // Met à jour l'état du jeu
    showModal(); // Affiche la modal de fin de partie
  }
}, 1000);

// Fonction pour afficher la modal de fin de partie
function showModal() {
  const modalHTML = `
    <div class="modal">
      <div class="modal-content">
        <h2>Partie Terminée</h2>
        <p>Votre score est : <span class="modal-score">${score}</span></p>
        <button class="modal-button" onclick="reloadPage()">OK</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Fonction pour recharger la page
function reloadPage() {
  location.reload();
}
