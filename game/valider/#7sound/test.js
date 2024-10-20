// Tableau contenant les questions du quiz. Chaque question a un texte, une liste de réponses et une réponse correcte.
const questions = [
    {
        question: "Quelle est la capitale de la France ?",
        answers: ["Paris", "Londres", "Berlin", "Madrid"],
        correct: "Paris"
    },
    {
        question: "Quel est le plus grand océan du monde ?",
        answers: ["Atlantique", "Pacifique", "Indien", "Arctique"],
        correct: "Pacifique"
    }
    // Ajoutez d'autres questions ici
];















// Index de la question actuellement affichée, initialisé à 0 (première question)
let currentQuestionIndex = 0;

// Score du joueur, initialisé à 0
let score = 0;

// Références aux éléments HTML du DOM pour afficher les questions, les scores et le bouton "Suivant"
const questionContainer = document.getElementById('question-container');
const nextButton = document.getElementById('next-button');
const scoreContainer = document.getElementById('score-container');

// Fonction pour afficher une question et ses réponses
function showQuestion(question) {
    // Mise à jour du contenu de questionContainer avec la question et les boutons de réponse
    questionContainer.innerHTML = `
        <h2>${question.question}</h2>
        ${question.answers.map(answer => `
            <button class="answer-btn">${answer}</button>
        `).join('')}
    `;

    // Ajout des événements de clic aux boutons de réponse
    document.querySelectorAll('.answer-btn').forEach(button => {
        button.addEventListener('click', () => {
            // Vérifie si la réponse sélectionnée est correcte
            if (button.textContent === question.correct) {
                score++; // Incrémente le score si la réponse est correcte
            }
            // Vérifie s'il y a encore des questions à afficher
            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++; // Passe à la question suivante
                showQuestion(questions[currentQuestionIndex]); // Affiche la prochaine question
            } else {
                showScore(); // Affiche le score final si toutes les questions ont été répondues
            }
        });
    });
}

// Fonction pour afficher le score final
function showScore() {
    questionContainer.innerHTML = ''; // Vide le contenu de questionContainer
    scoreContainer.innerHTML = `<h2>Votre score est ${score} sur ${questions.length}</h2>`; // Affiche le score
    nextButton.style.display = 'none'; // Cache le bouton "Suivant" car le quiz est terminé
}

// Ajoute un événement de clic au bouton "Suivant" pour passer à la question suivante
nextButton.addEventListener('click', () => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++; // Passe à la question suivante
        showQuestion(questions[currentQuestionIndex]); // Affiche la prochaine question
    } else {
        showScore(); // Affiche le score final si toutes les questions ont été répondues
    }
});

// Initialisation du quiz en affichant la première question
showQuestion(questions[currentQuestionIndex]);
