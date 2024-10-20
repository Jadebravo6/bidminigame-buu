// scene.js
class Scene {
    constructor(engine) {
        this.engine = engine;
        this.entities = [];
    }

    init() {
        // Initialisation de la scène
        this.entities.forEach(entity => entity.init());
    }

    addEntity(entity) {
        this.entities.push(entity);
        entity.scene = this;
    }

    update() {
        this.entities.forEach(entity => entity.update());
    }

    render() {
        this.entities.forEach(entity => entity.render());
    }

    clear() {
        this.entities = [];
    }
}

export default Scene;
