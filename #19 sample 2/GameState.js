// Classe pour gérer l'état du jeu (menu, jeu, gameover)
class GameState {
    constructor() {
        this.state = 'menu'; // État initial du jeu
    }

    setState(newState) {
        this.state = newState;
    }

    is(state) {
        return this.state === state;
    }
}
