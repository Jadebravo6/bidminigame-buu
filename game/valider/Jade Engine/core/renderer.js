// renderer.js
class Renderer {
    constructor(rootElement) {
        this.rootElement = rootElement;
        this.context = null;

        if (rootElement.tagName.toLowerCase() === 'canvas') {
            this.context = rootElement.getContext('2d');
        }
    }

    renderEntity(entity) {
        if (this.context) {
            // Rendu sur Canvas
            this.context.fillStyle = entity.color || '#000';
            this.context.fillRect(entity.x, entity.y, entity.width, entity.height);
        } else {
            // Rendu avec le DOM (CSS)
            if (!entity.domElement) {
                entity.init();
            }
            entity.render();
        }
    }

    clear() {
        if (this.context) {
            this.context.clearRect(0, 0, this.rootElement.width, this.rootElement.height);
        }
    }
}

export default Renderer;
