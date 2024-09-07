const choices = document.querySelectorAll('.choice');
const result = document.getElementById('result');

choices.forEach(choice => {
    choice.addEventListener('click', () => {
        const playerChoice = choice.id;
        const computerChoice = getComputerChoice();
        const winner = getWinner(playerChoice, computerChoice);
        showResult(winner, computerChoice);
    });
});

function getComputerChoice() {
    const computerChoices = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * 3);
    return computerChoices[randomIndex];
}

function getWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return 'draw';
    } else if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        return 'player';
    } else {
        return 'computer';
    }
}

function showResult(winner, computerChoice) {
    if (winner === 'draw') {
        result.innerText = 'Égalité!';
    } else if (winner === 'player') {
        result.innerText = 'Vous avez gagné!';
    } else {
        result.innerText = `L'ordinateur a choisi ${computerChoice}. Vous avez perdu!`;
    }
}
