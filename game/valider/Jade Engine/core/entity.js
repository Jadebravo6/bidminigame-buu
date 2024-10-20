// entity.js
class Entity {
    constructor(x, y, width, height, cssClass = 'game-element') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.cssClass = cssClass;
        this.domElement = null;
    }

    init() {
        // Initialisation de l'entité (pour DOM)
        if (this.cssClass) {
            this.domElement = document.createElement('div');
            this.domElement.className = this.cssClass;
            this.domElement.style.position = 'absolute';
            this.domElement.style.width = `${this.width}px`;
            this.domElement.style.height = `${this.height}px`;
            this.domElement.style.left = `${this.x}px`;
            this.domElement.style.top = `${this.y}px`;
            this.scene.engine.rootElement.appendChild(this.domElement);
        }
    }

    update() {
        // Mise à jour de l'entité (logique de jeu)
    }

    render() {
        // Rendu de l'entité (DOM)
        if (this.domElement) {
            this.domElement.style.left = `${this.x}px`;
            this.domElement.style.top = `${this.y}px`;
        }
    }

    destroy() {
        // Destruction de l'entité
        if (this.domElement) {
            this.domElement.remove();
        }
    }
}

export default Entity;
